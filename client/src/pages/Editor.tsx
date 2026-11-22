import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';
import { useFileTreeStore } from '../store/fileTreeStore';
import { useTerminalStore } from '../store/terminalStore';
import { useChatStore } from '../store/chatStore';
import { useAIStore } from '../store/aiStore';
import { useEditorStore } from '../store/editorStore';
import { Header } from '../components/layout/Header';
import { AppLayout } from '../components/layout/AppLayout';
import { Loading } from '../components/common/Loading';
import { FileAPI } from '../api/files';
import { ChatAPI } from '../api/chat';
import { HistoryAPI } from '../api/history';
import { ReviewAPI } from '../api/reviews';
import { AIProviderService } from '../components/ai/providers';
import { WS_EVENTS, CodeRef, EditEvent, UserPresence } from '@syncwrite/shared';
import toast from 'react-hot-toast';

const WS_BASE_URL =
  import.meta.env.VITE_WS_URL ||
  (import.meta.env.PROD ? window.location.origin : 'http://localhost:3001');

export const Editor: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { accessToken } = useAuthStore();
  const { currentProject, loadProject, setOnlineUsers, addOnlineUser, removeOnlineUser } =
    useProjectStore();
  const { loadTree } = useFileTreeStore();
  const { addTab, removeTab } = useTerminalStore();
  const { setMessages, addMessage, setUserTyping } = useChatStore();
  const {
    provider,
    getApiKey,
    isReviewing,
    setReviewing,
    setReviewComments,
  } = useAIStore();
  const { activeTabPath, openFile, toggleSidePanel } = useEditorStore();

  const [collabSocket, setCollabSocket] = useState<Socket | null>(null);
  const [terminalSocket, setTerminalSocket] = useState<Socket | null>(null);
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);

  const [attachedCodeRef, setAttachedCodeRef] = useState<CodeRef | null>(null);
  const [historyEvents, setHistoryEvents] = useState<EditEvent[]>([]);
  const [isPlaybackOpen, setIsPlaybackOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Project Data & WebSockets
  useEffect(() => {
    if (!projectId || !accessToken) return;

    let isMounted = true;
    setIsLoading(true);

    // Load project details & file tree
    Promise.all([loadProject(projectId), loadTree(projectId)])
      .then(([proj]) => {
        if (!isMounted) return;
        if (!proj) {
          toast.error('Project not found');
          navigate('/dashboard');
          return;
        }

        // Preload chat history
        ChatAPI.getHistory(projectId).then((res) => {
          if (isMounted) setMessages(res.messages);
        });

        // Preload edit history
        HistoryAPI.getHistory(projectId).then((res) => {
          if (isMounted) setHistoryEvents(res.events);
        });

        setIsLoading(false);
      })
      .catch(() => {
        if (isMounted) {
          toast.error('Failed to load project');
          navigate('/dashboard');
        }
      });

    // 1. /collab Socket
    const cSocket = io(`${WS_BASE_URL}/collab`, {
      auth: { token: accessToken, projectId },
      query: { projectId },
      transports: ['websocket', 'polling'],
    });

    cSocket.on(WS_EVENTS.COLLAB.PRESENCE_USERS, (users: UserPresence[]) => {
      setOnlineUsers(users);
    });

    cSocket.on(WS_EVENTS.COLLAB.PRESENCE_JOIN, (user: any) => {
      addOnlineUser(user);
    });

    cSocket.on(WS_EVENTS.COLLAB.PRESENCE_LEAVE, ({ userId }: { userId: string }) => {
      removeOnlineUser(userId);
    });

    cSocket.on(WS_EVENTS.COLLAB.MERGE_EVENT, (event: EditEvent) => {
      setHistoryEvents((prev) => [...prev, event]);
    });

    // 2. /terminal Socket
    const tSocket = io(`${WS_BASE_URL}/terminal`, {
      auth: { token: accessToken, projectId },
      query: { projectId },
      transports: ['websocket', 'polling'],
    });

    tSocket.on(WS_EVENTS.TERMINAL.CREATED, ({ terminalId }: { terminalId: string }) => {
      addTab({
        id: terminalId,
        terminalId,
        title: `term-${terminalId.slice(0, 4)}`,
      });
    });

    // 3. /chat Socket
    const chSocket = io(`${WS_BASE_URL}/chat`, {
      auth: { token: accessToken, projectId },
      query: { projectId },
      transports: ['websocket', 'polling'],
    });

    chSocket.on(WS_EVENTS.CHAT.MESSAGE, (msg) => {
      addMessage(msg);
    });

    chSocket.on(WS_EVENTS.CHAT.TYPING, ({ username }) => {
      setUserTyping(username, true);
    });

    chSocket.on(WS_EVENTS.CHAT.TYPING_STOP, ({ username }) => {
      setUserTyping(username, false);
    });

    setCollabSocket(cSocket);
    setTerminalSocket(tSocket);
    setChatSocket(chSocket);

    return () => {
      isMounted = false;
      cSocket.disconnect();
      tSocket.disconnect();
      chSocket.disconnect();
    };
  }, [projectId, accessToken, navigate]);

  // Terminal actions
  const handleNewTerminal = () => {
    terminalSocket?.emit(WS_EVENTS.TERMINAL.CREATE, { cols: 80, rows: 24 });
  };

  const handleKillTerminal = (id: string) => {
    terminalSocket?.emit(WS_EVENTS.TERMINAL.KILL, { terminalId: id });
    removeTab(id);
  };

  // Chat message send
  const handleSendMessage = (message: string, codeRef?: CodeRef | null) => {
    chatSocket?.emit(WS_EVENTS.CHAT.MESSAGE, { message, codeRef });
  };

  // Code reference selected in editor
  const handleCodeRefSelect = (file: string, line: number, snippet: string) => {
    setAttachedCodeRef({ file, line, snippet });
    toggleSidePanel('chat');
  };

  // Trigger AI Code Review
  const handleTriggerAIReview = async () => {
    if (!activeTabPath || !projectId) {
      toast.error('Open a file first to run AI review');
      return;
    }

    const apiKey = getApiKey(provider);
    if (!apiKey) {
      toast.error(`Please enter your ${provider.toUpperCase()} API key in AI settings`);
      return;
    }

    setReviewing(true);
    try {
      const fileData = await FileAPI.getFile(projectId, activeTabPath);
      const comments = await AIProviderService.getReview(
        provider,
        apiKey,
        fileData.content,
        fileData.language
      );

      setReviewComments(comments);
      toggleSidePanel('review');

      // Persist review to backend
      await ReviewAPI.saveReview(projectId, {
        filePath: activeTabPath,
        provider,
        comments,
      });

      toast.success(`Review completed: ${comments.length} suggestions found`);
    } catch (err: any) {
      toast.error(err.message || 'AI review failed');
    } finally {
      setReviewing(false);
    }
  };

  // Apply suggestion from AI review into current file
  const handleApplySuggestion = async (line: number, suggestion: string) => {
    if (!activeTabPath || !projectId) return;

    try {
      const { content } = await FileAPI.getFile(projectId, activeTabPath);
      const lines = content.split('\n');
      if (line >= 1 && line <= lines.length) {
        lines[line - 1] = suggestion;
        const newContent = lines.join('\n');
        await FileAPI.updateFile(projectId, activeTabPath, { content: newContent });
        toast.success(`Applied suggestion at line ${line}`);
        // Reload tab content
        openFile(activeTabPath);
      }
    } catch {
      toast.error('Failed to apply suggestion');
    }
  };

  // History seek in playback
  const handlePlaybackSeek = (index: number) => {
    const evt = historyEvents[index];
    if (evt && evt.filePath) {
      openFile(evt.filePath);
    }
  };

  if (isLoading || !projectId) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-surface-ground">
        <Loading message="Loading workspace components..." />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-surface-ground overflow-hidden">
      <Header onTriggerAIReview={handleTriggerAIReview} isReviewing={isReviewing} />
      <AppLayout
        projectId={projectId}
        collabSocket={collabSocket}
        terminalSocket={terminalSocket}
        chatSocket={chatSocket}
        onNewTerminal={handleNewTerminal}
        onKillTerminal={handleKillTerminal}
        onSendMessage={handleSendMessage}
        attachedCodeRef={attachedCodeRef}
        onRemoveCodeRef={() => setAttachedCodeRef(null)}
        onCodeRefSelect={handleCodeRefSelect}
        onApplySuggestion={handleApplySuggestion}
        historyEvents={historyEvents}
        isPlaybackOpen={isPlaybackOpen}
        onClosePlayback={() => setIsPlaybackOpen(false)}
        onPlaybackSeek={handlePlaybackSeek}
      />
    </div>
  );
};
