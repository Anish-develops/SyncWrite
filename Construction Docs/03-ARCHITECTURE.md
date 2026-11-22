# 🏗️ System Architecture — SyncWrite

> Detailed architecture diagrams, data flows, and component interactions.

---

## 1. High-Level System Architecture

```mermaid
flowchart TB
    subgraph Clients["Clients (Browsers)"]
        C1["User A<br/>React + Monaco + xterm.js"]
        C2["User B<br/>React + Monaco + xterm.js"]
        C3["User C<br/>React + Monaco + xterm.js"]
    end

    subgraph Server["SyncWrite Server (Node.js)"]
        subgraph HTTP["HTTP Layer"]
            Express["Express.js<br/>REST API"]
            AuthMW["Auth Middleware<br/>JWT Verification"]
        end

        subgraph WS["WebSocket Layer (Socket.IO)"]
            CollabNS["Collaboration Namespace<br/>/collab"]
            TermNS["Terminal Namespace<br/>/terminal"]
            ChatNS["Chat Namespace<br/>/chat"]
            LSPNS["LSP Namespace<br/>/lsp"]
        end

        subgraph Core["Core Services"]
            YjsMgr["Yjs Manager<br/>CRDT Document Store"]
            TermMgr["Terminal Manager<br/>tmux Sessions"]
            LSPMgr["LSP Manager<br/>Language Servers"]
            MergeTrk["Merge Tracker<br/>Edit History & Attribution"]
        end

        subgraph Storage["Storage Layer"]
            SQLite[("SQLite<br/>Users, Projects, Metadata")]
            FS[("File System<br/>Project Files & Yjs State")]
        end
    end

    subgraph AI["AI Providers (Direct from Client)"]
        OpenAI["OpenAI API"]
        Gemini["Gemini API"]
        Claude["Anthropic API"]
    end

    C1 & C2 & C3 -->|"REST (HTTPS)"| Express
    Express --> AuthMW
    AuthMW --> SQLite

    C1 & C2 & C3 -->|"WebSocket"| CollabNS & TermNS & ChatNS & LSPNS

    CollabNS --> YjsMgr
    CollabNS --> MergeTrk
    YjsMgr --> FS
    TermNS --> TermMgr
    TermMgr -->|"node-pty"| Tmux["tmux processes"]
    LSPNS --> LSPMgr
    LSPMgr --> Pyright["Pyright"] & TSServer["tsserver"]
    ChatNS --> SQLite

    C1 -.->|"Direct HTTPS"| OpenAI & Gemini & Claude
    C2 -.->|"Direct HTTPS"| OpenAI & Gemini & Claude
```

---

## 2. Collaboration Architecture (CRDT + Yjs)

```mermaid
sequenceDiagram
    participant A as User A (Browser)
    participant WS as WebSocket Server
    participant Yjs as Yjs Manager
    participant DB as SQLite + Filesystem
    participant B as User B (Browser)

    Note over A, B: Both users open the same file

    A->>WS: Connect to room (project:file)
    WS->>Yjs: Get/Create Y.Doc for file
    Yjs->>DB: Load persisted Yjs state (if exists)
    DB-->>Yjs: Binary Yjs state vector
    Yjs-->>WS: Y.Doc instance
    WS-->>A: Sync step 1 (state vector)
    A-->>WS: Sync step 2 (missing updates)

    B->>WS: Connect to room (project:file)
    WS-->>B: Full document state

    Note over A, B: Real-time editing begins

    A->>A: Type "hello" at line 5
    A->>WS: Yjs update (binary delta)
    WS->>Yjs: Apply update to Y.Doc
    WS->>B: Broadcast update
    B->>B: Apply update → "hello" appears at line 5

    B->>B: Type "world" at line 5 (same line!)
    B->>WS: Yjs update (binary delta)
    WS->>Yjs: Apply update to Y.Doc
    WS->>A: Broadcast update
    A->>A: CRDT auto-merge → "helloworld" (no conflict!)

    Note over Yjs, DB: Periodic persistence (every 30s)
    Yjs->>DB: Persist Y.Doc state to filesystem
```

### CRDT Document Model

```
Y.Doc (one per file)
├── Y.Text ("content")     → The file's text content
├── Y.Map ("metadata")     → File metadata (language, encoding)
└── Y.Array ("history")    → Edit event log for merge visualization

Awareness (ephemeral, per-connection)
├── cursor: { line, column, file }
├── selection: { start, end }
├── user: { id, name, color }
└── state: "active" | "idle" | "away"
```

---

## 3. Terminal Architecture

```mermaid
flowchart LR
    subgraph Browser
        XT["xterm.js<br/>Terminal Renderer"]
    end

    subgraph Server
        SIO["Socket.IO<br/>/terminal namespace"]
        TM["Terminal Manager"]
        PTY["node-pty<br/>Pseudo Terminal"]
        TMUX["tmux session<br/>user-project-id"]
        SHELL["bash / zsh"]
    end

    XT -->|"input (keystrokes)"| SIO
    SIO --> TM
    TM --> PTY
    PTY --> TMUX
    TMUX --> SHELL

    SHELL -->|"stdout + stderr"| TMUX
    TMUX --> PTY
    PTY --> TM
    TM --> SIO
    SIO -->|"output (ANSI)"| XT
```

### Terminal Session Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Creating: User clicks "New Terminal"
    Creating --> Running: tmux session created + node-pty attached
    Running --> Paused: User disconnects (tab close)
    Paused --> Running: User reconnects (tmux attach)
    Paused --> Killed: Timeout (30 min idle)
    Running --> Killed: User clicks "Kill Terminal"
    Killed --> [*]
```

**Key Design Decisions:**
- Each user gets their own tmux session named `sw-{userId}-{projectId}-{tabIndex}`
- tmux sessions persist across WebSocket disconnects (browser close → reopen → reattach)
- Idle sessions killed after 30 minutes to conserve resources
- Terminal working directory is set to the project's filesystem root
- All 7 language runtimes available in the terminal's PATH

---

## 4. AI Integration Architecture

```mermaid
flowchart LR
    subgraph Browser["Browser (Client-Side Only)"]
        Editor["Monaco Editor"]
        AIP["AI Completion Provider"]
        AIR["AI Review Engine"]
        KeyStore["localStorage<br/>(API Key)"]
    end

    subgraph External["External AI APIs"]
        OAI["OpenAI<br/>api.openai.com"]
        GEM["Gemini<br/>generativelanguage.googleapis.com"]
        ANT["Anthropic<br/>api.anthropic.com"]
    end

    Editor -->|"onDidChangeContent"| AIP
    AIP -->|"Read key"| KeyStore
    AIP -->|"POST /completions"| OAI & GEM & ANT
    OAI & GEM & ANT -->|"completion text"| AIP
    AIP -->|"InlineCompletion"| Editor

    Editor -->|"User triggers review"| AIR
    AIR -->|"Read key"| KeyStore
    AIR -->|"POST /chat"| OAI & GEM & ANT
    OAI & GEM & ANT -->|"review comments JSON"| AIR
    AIR -->|"Decorations"| Editor
```

### AI Autocomplete Flow

1. User types in Monaco → 300ms debounce
2. `AICompletionProvider.provideInlineCompletions()` fires
3. Build prompt: `{file_content_before_cursor} + {file_language} + {instruction}`
4. Read API key from `localStorage`
5. Call selected provider's completion endpoint directly from browser
6. Parse response → return as `InlineCompletion` items
7. Monaco renders ghost text at cursor position
8. User presses Tab to accept or keeps typing to dismiss

### AI Code Review Flow

1. User clicks "AI Review" button (or Ctrl+Shift+R)
2. Build review prompt with file content + diff (if available)
3. Call AI provider with structured output request (JSON mode)
4. Parse response into array of `{ line, message, severity, suggestion }`
5. Render as Monaco decorations: gutter icons + inline hover messages
6. User can accept (apply suggestion), dismiss, or discuss in chat

---

## 5. LSP Architecture

```mermaid
flowchart TB
    subgraph Client["Browser"]
        Monaco["Monaco Editor"]
        LC["Language Client<br/>(monaco-languageclient)"]
    end

    subgraph Server["Node.js Server"]
        WSProxy["WebSocket Proxy<br/>/lsp namespace"]
        LSPMgr["LSP Manager"]
    end

    subgraph LSPServers["LSP Server Processes"]
        Pyright["Pyright<br/>(Python)"]
        TSServer["tsserver<br/>(JS/TS)"]
    end

    Monaco --> LC
    LC -->|"LSP JSON-RPC<br/>over WebSocket"| WSProxy
    WSProxy --> LSPMgr
    LSPMgr -->|"stdio pipe"| Pyright
    LSPMgr -->|"stdio pipe"| TSServer
    Pyright & TSServer -->|"diagnostics, completions,<br/>hover, definitions"| LSPMgr
    LSPMgr --> WSProxy
    WSProxy --> LC
    LC --> Monaco
```

### LSP Lifecycle

1. When a project is opened, the server checks the project's language(s)
2. If Python files exist → spawn Pyright with `rootUri` = project directory
3. If JS/TS files exist → spawn tsserver with `rootUri` = project directory
4. LSP server processes are shared among all collaborators in the same project
5. All users see the same diagnostics (errors/warnings)
6. LSP servers are killed when the last user leaves the project

---

## 6. Merge Visualization Architecture

```mermaid
flowchart TD
    subgraph YjsLayer["Yjs Layer"]
        YDoc["Y.Doc"]
        Observer["Y.Text Observer<br/>(on delta events)"]
    end

    subgraph TrackingLayer["Merge Tracker"]
        EditLog["Edit Event Log<br/>Y.Array"]
        Attribution["Per-character Attribution<br/>Map: position → userId"]
    end

    subgraph RenderLayer["Visualization"]
        Decorations["Monaco Decorations<br/>Color-coded backgrounds"]
        Timeline["Timeline Panel<br/>Scrollable event list"]
        Playback["Playback Slider<br/>Step through history"]
    end

    YDoc --> Observer
    Observer -->|"insert/delete events<br/>+ awareness userId"| EditLog
    EditLog --> Attribution
    Attribution --> Decorations
    EditLog --> Timeline
    EditLog --> Playback
```

### Edit Event Structure

```typescript
interface EditEvent {
  id: string;             // Unique event ID
  userId: string;         // Who made the edit
  userName: string;       // Display name
  userColor: string;      // User's color
  timestamp: number;      // Unix timestamp (ms)
  fileId: string;         // Which file
  type: 'insert' | 'delete' | 'replace';
  position: {
    line: number;
    column: number;
  };
  content: string;        // Inserted/deleted text
  length: number;         // Characters affected
}
```

---

## 7. Authentication Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    participant DB as SQLite

    Note over C, S: Registration
    C->>S: POST /api/auth/register { email, username, password }
    S->>S: Validate input (Zod)
    S->>S: Hash password (bcrypt)
    S->>DB: INSERT user
    DB-->>S: User record
    S->>S: Generate JWT (access + refresh)
    S-->>C: { user, accessToken, refreshToken }

    Note over C, S: Login
    C->>S: POST /api/auth/login { email, password }
    S->>DB: SELECT user by email
    DB-->>S: User record + hash
    S->>S: bcrypt.compare(password, hash)
    S->>S: Generate JWT (access + refresh)
    S-->>C: { user, accessToken, refreshToken }

    Note over C, S: Authenticated Request
    C->>S: GET /api/projects (Authorization: Bearer <token>)
    S->>S: Verify JWT
    S->>DB: SELECT projects for user
    DB-->>S: Project list
    S-->>C: { projects: [...] }

    Note over C, S: Token Refresh
    C->>S: POST /api/auth/refresh { refreshToken }
    S->>S: Verify refresh token
    S->>S: Generate new access token
    S-->>C: { accessToken }
```

---

## 8. WebSocket Namespace Design

```mermaid
flowchart TD
    subgraph SocketIO["Socket.IO Server"]
        Default["/  (default)<br/>Connection management"]
        Collab["/collab<br/>Yjs sync + awareness"]
        Terminal["/terminal<br/>PTY I/O"]
        Chat["/chat<br/>Messages"]
        LSP["/lsp<br/>Language Server"]
    end

    subgraph Rooms["Rooms (per namespace)"]
        PR1["project:{projectId}<br/>All project members"]
        FR1["file:{projectId}:{filePath}<br/>Per-file collaboration"]
        TR1["term:{userId}:{projectId}:{tabId}<br/>Per-user terminal"]
    end

    Default --> PR1
    Collab --> FR1
    Terminal --> TR1
    Chat --> PR1
    LSP --> PR1
```

### Socket Events Reference

| Namespace | Event | Direction | Payload |
|-----------|-------|-----------|---------|
| `/collab` | `yjs:sync` | Bidirectional | Yjs binary sync message |
| `/collab` | `awareness:update` | Bidirectional | Awareness state (cursor, selection, user) |
| `/collab` | `file:open` | Client → Server | `{ projectId, filePath }` |
| `/collab` | `file:close` | Client → Server | `{ projectId, filePath }` |
| `/collab` | `merge:event` | Server → Client | `EditEvent` object |
| `/terminal` | `terminal:create` | Client → Server | `{ projectId, shell?, cols, rows }` |
| `/terminal` | `terminal:input` | Client → Server | `{ terminalId, data }` |
| `/terminal` | `terminal:output` | Server → Client | `{ terminalId, data }` |
| `/terminal` | `terminal:resize` | Client → Server | `{ terminalId, cols, rows }` |
| `/terminal` | `terminal:kill` | Client → Server | `{ terminalId }` |
| `/chat` | `chat:message` | Bidirectional | `{ projectId, text, codeRef? }` |
| `/chat` | `chat:typing` | Client → Server | `{ projectId, userId }` |
| `/lsp` | `lsp:request` | Client → Server | JSON-RPC LSP request |
| `/lsp` | `lsp:response` | Server → Client | JSON-RPC LSP response |
| `/lsp` | `lsp:notification` | Bidirectional | JSON-RPC LSP notification |

---

## 9. Data Flow Summary

```mermaid
flowchart LR
    subgraph Input["User Actions"]
        Type["Type Code"]
        Run["Run Command"]
        Chat["Send Message"]
        AI["Request AI"]
    end

    subgraph Processing["Processing"]
        CRDT["CRDT Merge<br/>(Yjs)"]
        PTY["PTY Exec<br/>(tmux)"]
        DB["Store<br/>(SQLite)"]
        Provider["AI Provider<br/>(External)"]
    end

    subgraph Output["Results"]
        Sync["Synced Editor<br/>(All Users)"]
        Term["Terminal Output<br/>(Per User)"]
        Stored["Persisted Message"]
        Suggest["Inline Suggestion"]
    end

    Type --> CRDT --> Sync
    Run --> PTY --> Term
    Chat --> DB --> Stored
    AI --> Provider --> Suggest
```
