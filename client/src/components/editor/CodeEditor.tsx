import React, { useEffect, useRef, useState, useCallback } from 'react';
import MonacoEditor, { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import * as Y from 'yjs';
import { Socket } from 'socket.io-client';
import { WS_EVENTS, ReviewComment, EditEvent } from '@syncwrite/shared';
import { detectLanguage } from '../../utils/languageDetect';
import { registerMonacoThemes } from './MonacoConfig';
import { createAIInlineCompletionProvider } from './AICompletionProvider';
import { useSettingsStore } from '../../store/settingsStore';
import { useAIStore } from '../../store/aiStore';
import { useEditorStore } from '../../store/editorStore';
import { FileAPI } from '../../api/files';
import toast from 'react-hot-toast';

interface CodeEditorProps {
  filePath: string | null;
  projectId: string;
  socket: Socket | null;
  onCodeRefSelect?: (file: string, line: number, snippet: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  filePath,
  projectId,
  socket,
  onCodeRefSelect,
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof monaco | null>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const isApplyingRemoteRef = useRef(false);

  const { theme, fontSize, wordWrap, minimap } = useSettingsStore();
  const { activeReviewComments } = useAIStore();
  const { setTabDirty } = useEditorStore();

  const [loading, setLoading] = useState(false);
  const [initialContent, setInitialContent] = useState('');
  const language = filePath ? detectLanguage(filePath) : 'plaintext';

  // Load file and bind Yjs document
  useEffect(() => {
    if (!filePath || !projectId) return;

    let isMounted = true;
    setLoading(true);

    const doc = new Y.Doc();
    ydocRef.current = doc;

    // Fetch initial content via REST
    FileAPI.getFile(projectId, filePath)
      .then((res) => {
        if (!isMounted) return;
        setInitialContent(res.content);

        const ytext = doc.getText('content');
        if (ytext.length === 0) {
          ytext.insert(0, res.content);
        }

        // Notify collab socket that file was opened
        socket?.emit(WS_EVENTS.COLLAB.FILE_OPEN, { filePath });
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Failed to load file:', err);
        setLoading(false);
      });

    // Listen for remote Yjs sync updates
    const handleSync = (data: { filePath: string; update: Uint8Array }) => {
      if (data.filePath === filePath && ydocRef.current) {
        try {
          isApplyingRemoteRef.current = true;
          Y.applyUpdate(ydocRef.current, new Uint8Array(data.update));
          const updatedContent = ydocRef.current.getText('content').toString();

          const editor = editorRef.current;
          if (editor && editor.getValue() !== updatedContent) {
            const pos = editor.getPosition();
            editor.setValue(updatedContent);
            if (pos) editor.setPosition(pos);
          }
        } finally {
          isApplyingRemoteRef.current = false;
        }
      }
    };

    socket?.on(WS_EVENTS.COLLAB.SYNC, handleSync);

    return () => {
      isMounted = false;
      socket?.off(WS_EVENTS.COLLAB.SYNC, handleSync);
      socket?.emit(WS_EVENTS.COLLAB.FILE_CLOSE, { filePath });
      ydocRef.current?.destroy();
      ydocRef.current = null;
    };
  }, [filePath, projectId, socket]);

  // Handle Monaco Editor mount
  const handleEditorDidMount: OnMount = (editor, monacoInstance) => {
    editorRef.current = editor;
    monacoRef.current = monacoInstance;

    registerMonacoThemes();
    monacoInstance.editor.setTheme(theme === 'dark' ? 'workshop-dark' : 'workshop-light');

    // Register AI InlineCompletionProvider for this language
    monacoInstance.languages.registerInlineCompletionsProvider(
      language,
      createAIInlineCompletionProvider(language)
    );

    // Context menu item: "Discuss this line in chat"
    editor.addAction({
      id: 'discuss-code',
      label: 'Discuss in Project Chat',
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1,
      run: (ed) => {
        const selection = ed.getSelection();
        if (selection && filePath) {
          const selectedText = ed.getModel()?.getValueInRange(selection) || '';
          onCodeRefSelect?.(filePath, selection.startLineNumber, selectedText);
        }
      },
    });

    // Keyboard shortcut: Ctrl+S to save
    editor.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyS, () => {
      handleManualSave();
    });

    // Listen to local content changes and broadcast to Yjs
    editor.onDidChangeModelContent((e) => {
      if (isApplyingRemoteRef.current) return;
      if (!filePath || !ydocRef.current) return;

      const doc = ydocRef.current;
      const ytext = doc.getText('content');
      const currentVal = editor.getValue();

      // Simple diff sync to Y.Text
      doc.transact(() => {
        ytext.delete(0, ytext.length);
        ytext.insert(0, currentVal);
      });

      const update = Y.encodeStateAsUpdate(doc);
      socket?.emit(WS_EVENTS.COLLAB.SYNC, {
        filePath,
        update,
      });

      setTabDirty(filePath, true);
    });

    // Broadcast cursor position for awareness
    editor.onDidChangeCursorPosition((e) => {
      if (!filePath || !socket) return;
      socket.emit(WS_EVENTS.COLLAB.AWARENESS, {
        filePath,
        awareness: {
          cursor: { line: e.position.lineNumber, column: e.position.column },
        },
      });
    });
  };

  const handleManualSave = useCallback(async () => {
    if (!filePath || !editorRef.current) return;
    const content = editorRef.current.getValue();
    try {
      await FileAPI.updateFile(projectId, filePath, { content });
      setTabDirty(filePath, false);
      toast.success('Saved to server');
    } catch {
      toast.error('Save failed');
    }
  }, [filePath, projectId, setTabDirty]);

  // Update Monaco theme on change
  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(theme === 'dark' ? 'workshop-dark' : 'workshop-light');
    }
  }, [theme]);

  // Update AI review decorations
  useEffect(() => {
    const editor = editorRef.current;
    const monacoInstance = monacoRef.current;
    if (!editor || !monacoInstance) return;

    const decorations: monaco.editor.IModelDeltaDecoration[] = activeReviewComments.map((c) => ({
      range: new monacoInstance.Range(c.line, 1, c.line, 1),
      options: {
        isWholeLine: false,
        linesDecorationsClassName: `gutter-review-${c.severity}`,
        hoverMessage: { value: `**[${c.severity.toUpperCase()}]** ${c.message}\n\n*Suggestion:* \`${c.suggestion || ''}\`` },
      },
    }));

    const oldDecorations = editor.getModel()?.getAllDecorations() || [];
    editor.createDecorationsCollection(decorations);
  }, [activeReviewComments]);

  if (!filePath) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-editor-bg text-text-tertiary select-none">
        <div className="w-12 h-12 mb-3 rounded border border-border flex items-center justify-center font-mono text-sm bg-surface-sunken">
          SW
        </div>
        <span className="text-xs font-medium">Select a file from Explorer to begin writing</span>
        <span className="text-[11px] mt-1 text-text-tertiary">Industrial Workshop Collaborative IDE</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <MonacoEditor
        height="100%"
        language={language}
        value={initialContent}
        onMount={handleEditorDidMount}
        loading={<div className="p-4 text-xs text-text-tertiary">Loading editor...</div>}
        options={{
          fontSize,
          fontFamily: '"JetBrains Mono", monospace',
          fontLigatures: true,
          wordWrap: wordWrap ? 'on' : 'off',
          minimap: { enabled: minimap },
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          inlineSuggest: { enabled: true },
        }}
      />
    </div>
  );
};
