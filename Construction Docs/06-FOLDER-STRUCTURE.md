# 📁 Project Folder Structure — SyncWrite

> Complete monorepo structure with every file and directory.

---

## Overview

```
syncwrite/                              # Monorepo root
├── 📄 package.json                     # Workspace root (npm workspaces)
├── 📄 .gitignore
├── 📄 .env.example
├── 📄 README.md
├── 📄 LICENSE
│
├── 📂 client/                          # ── React Frontend ──
├── 📂 server/                          # ── Node.js Backend ──
├── 📂 shared/                          # ── Shared Types ──
└── 📂 projects/                        # ── User Project Storage (gitignored) ──
```

---

## Detailed Structure

### Root

```
syncwrite/
├── package.json                        # npm workspaces config
├── .gitignore                          # Ignore node_modules, projects/, data/, .env
├── .env.example                        # Template for environment variables
├── .eslintrc.json                      # ESLint config
├── .prettierrc                         # Prettier config
├── README.md                           # Project documentation
├── LICENSE                             # MIT or ISC
└── tsconfig.base.json                  # Shared TypeScript config
```

**Root `package.json`:**
```json
{
  "name": "syncwrite",
  "private": true,
  "workspaces": ["client", "server", "shared"],
  "scripts": {
    "dev": "concurrently \"npm run dev -w server\" \"npm run dev -w client\"",
    "build": "npm run build -w shared && npm run build -w client && npm run build -w server",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write \"**/*.{ts,tsx,json,css}\""
  },
  "devDependencies": {
    "concurrently": "^8.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "typescript": "^5.0.0"
  }
}
```

---

### `shared/` — Shared Types & Constants

```
shared/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                        # Re-export everything
    ├── types/
    │   ├── user.ts                     # User, AuthResponse
    │   ├── project.ts                  # Project, ProjectMember
    │   ├── file.ts                     # FileNode, FileTree
    │   ├── terminal.ts                 # TerminalSession
    │   ├── chat.ts                     # ChatMessage, CodeRef
    │   ├── ai.ts                       # AIProvider, AIReview, ReviewComment
    │   ├── editor.ts                   # EditEvent, MergeEvent
    │   └── template.ts                 # ProjectTemplate
    ├── events.ts                       # WebSocket event name constants
    └── constants.ts                    # Shared constants (languages, colors, limits)
```

---

### `client/` — React Frontend

```
client/
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── index.html
│
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── fonts/                          # JetBrains Mono (editor font)
│       ├── JetBrainsMono-Regular.woff2
│       └── JetBrainsMono-Bold.woff2
│
└── src/
    ├── main.tsx                        # React entry point
    ├── App.tsx                         # Root component + router
    ├── index.css                       # Tailwind imports + global styles
    ├── vite-env.d.ts                   # Vite type declarations
    │
    ├── api/                            # ── HTTP API Client Layer ──
    │   ├── client.ts                   # Axios instance with auth interceptor
    │   ├── auth.ts                     # register, login, refresh, getMe, updateProfile
    │   ├── projects.ts                 # CRUD, invite, join, members
    │   ├── files.ts                    # getTree, getFile, createFile, updateFile, delete, rename, download
    │   ├── templates.ts                # getTemplates
    │   ├── chat.ts                     # getHistory
    │   ├── reviews.ts                  # getReviews, saveReview
    │   └── history.ts                  # getEditHistory
    │
    ├── pages/                          # ── Page Components (Routes) ──
    │   ├── Landing.tsx                 # Public landing page
    │   ├── Login.tsx                   # Login form page
    │   ├── Register.tsx                # Registration form page
    │   ├── Dashboard.tsx               # Project list + create button
    │   ├── Editor.tsx                  # Main IDE layout (the core page)
    │   ├── JoinProject.tsx             # Join via invite link (/join/:code)
    │   └── NotFound.tsx                # 404 page
    │
    ├── components/                     # ── Reusable Components ──
    │   │
    │   ├── layout/                     # -- App Layout --
    │   │   ├── AppLayout.tsx           # Sidebar + Editor + Terminal layout
    │   │   ├── Header.tsx              # Top bar (project name, users, settings)
    │   │   ├── Sidebar.tsx             # Left sidebar container
    │   │   └── ResizablePanel.tsx      # Draggable panel dividers
    │   │
    │   ├── editor/                     # -- Monaco Editor --
    │   │   ├── CodeEditor.tsx          # Main Monaco wrapper + Yjs binding
    │   │   ├── EditorTabs.tsx          # Open file tabs
    │   │   ├── EditorTab.tsx           # Single tab component
    │   │   ├── MonacoConfig.ts         # Monaco options + keybindings
    │   │   ├── CollaborativeCursors.tsx # Remote user cursor decorations
    │   │   ├── MergeVisualizer.tsx     # Color-coded edit attribution overlay
    │   │   ├── MergeTimeline.tsx       # Timeline panel (scrollable event list)
    │   │   ├── MergePlayback.tsx       # Playback slider + controls
    │   │   └── AICompletionProvider.ts # Monaco InlineCompletionProvider impl
    │   │
    │   ├── filetree/                   # -- File Explorer --
    │   │   ├── FileTree.tsx            # Recursive tree component
    │   │   ├── FileTreeNode.tsx        # Single file/folder node
    │   │   ├── FileContextMenu.tsx     # Right-click menu (rename, delete, etc.)
    │   │   ├── NewFileDialog.tsx       # Create file/folder modal
    │   │   └── FileIcon.tsx            # Language-specific file icons
    │   │
    │   ├── terminal/                   # -- Terminal --
    │   │   ├── TerminalPanel.tsx       # Terminal container (bottom panel)
    │   │   ├── Terminal.tsx            # Single xterm.js instance
    │   │   ├── TerminalTabs.tsx        # Multiple terminal tabs
    │   │   └── TerminalManager.ts      # Terminal lifecycle management
    │   │
    │   ├── collaboration/              # -- Collaboration UI --
    │   │   ├── PresencePanel.tsx       # Online users list
    │   │   ├── UserAvatar.tsx          # Colored circle with initial
    │   │   ├── UserCursorLabel.tsx     # Cursor name label
    │   │   ├── ChatPanel.tsx           # Chat sidebar
    │   │   ├── ChatMessage.tsx         # Single message component
    │   │   ├── ChatInput.tsx           # Message input + code ref
    │   │   └── TypingIndicator.tsx     # "User is typing..." indicator
    │   │
    │   ├── ai/                         # -- AI Features --
    │   │   ├── AISettingsModal.tsx      # API key input + provider selector
    │   │   ├── AIReviewPanel.tsx        # Review results sidebar
    │   │   ├── AIReviewComment.tsx      # Single review comment
    │   │   ├── AIReviewTrigger.tsx      # "Review" button in toolbar
    │   │   └── providers/              # Provider-specific API wrappers
    │   │       ├── index.ts            # Provider factory
    │   │       ├── openai.ts           # OpenAI completion + review
    │   │       ├── gemini.ts           # Gemini completion + review
    │   │       └── anthropic.ts        # Claude completion + review
    │   │
    │   ├── project/                    # -- Project Management --
    │   │   ├── ProjectList.tsx         # Grid/list of projects
    │   │   ├── ProjectCard.tsx         # Single project card
    │   │   ├── CreateProjectModal.tsx  # New project dialog
    │   │   ├── TemplateSelector.tsx    # Template picker with icons
    │   │   ├── InviteModal.tsx         # Share invite link dialog
    │   │   └── ProjectSettings.tsx     # Project settings panel
    │   │
    │   ├── auth/                       # -- Authentication --
    │   │   ├── LoginForm.tsx           # Email + password form
    │   │   ├── RegisterForm.tsx        # Registration form
    │   │   └── ProtectedRoute.tsx      # Route guard (redirect if unauthenticated)
    │   │
    │   └── common/                     # -- Shared UI Components --
    │       ├── Button.tsx              # Styled button variants
    │       ├── Input.tsx               # Form input
    │       ├── Modal.tsx               # Generic modal wrapper
    │       ├── Dropdown.tsx            # Dropdown menu
    │       ├── ContextMenu.tsx         # Right-click context menu
    │       ├── Tooltip.tsx             # Hover tooltip
    │       ├── Loading.tsx             # Loading spinner
    │       ├── Skeleton.tsx            # Loading skeleton
    │       └── EmptyState.tsx          # Empty state illustration
    │
    ├── hooks/                          # ── Custom React Hooks ──
    │   ├── useAuth.ts                  # Auth state + login/logout/register
    │   ├── useProject.ts              # Current project state
    │   ├── useYjs.ts                   # Yjs document + provider setup
    │   ├── useAwareness.ts             # Yjs awareness (cursors, presence)
    │   ├── useTerminal.ts              # Terminal socket management
    │   ├── useFileTree.ts              # File tree state + operations
    │   ├── useChat.ts                  # Chat messages + socket
    │   ├── useAI.ts                    # AI provider + completion state
    │   ├── useAIReview.ts              # AI review trigger + results
    │   ├── useMergeHistory.ts          # Edit history + playback state
    │   ├── useLSP.ts                   # LSP diagnostics + features
    │   └── useSocket.ts               # Socket.IO connection management
    │
    ├── store/                          # ── Zustand State Stores ──
    │   ├── authStore.ts                # User + tokens
    │   ├── projectStore.ts             # Current project + members
    │   ├── editorStore.ts              # Open files, active tab, editor state
    │   ├── fileTreeStore.ts            # File tree data
    │   ├── terminalStore.ts            # Terminal sessions
    │   ├── chatStore.ts                # Chat messages
    │   ├── aiStore.ts                  # AI settings (provider, key stored separately)
    │   └── settingsStore.ts            # Theme, font size, keybindings
    │
    ├── context/                        # ── React Contexts ──
    │   ├── SocketContext.tsx            # Socket.IO connection provider
    │   ├── YjsContext.tsx              # Yjs document provider
    │   └── ThemeContext.tsx            # Dark/light theme provider
    │
    ├── utils/                          # ── Utility Functions ──
    │   ├── socket.ts                   # Socket.IO client factory
    │   ├── yjs.ts                      # Yjs document helpers
    │   ├── fileIcons.ts                # Extension → icon mapping
    │   ├── languageDetect.ts           # Extension → Monaco language mapping
    │   ├── colors.ts                   # User avatar color palette
    │   ├── debounce.ts                 # Debounce utility
    │   ├── formatters.ts              # Date, file size formatters
    │   └── constants.ts               # Client-side constants
    │
    └── types/                          # ── Client-Specific Types ──
        ├── monaco.d.ts                 # Monaco type extensions
        └── xterm.d.ts                  # xterm.js type extensions
```

---

### `server/` — Node.js Backend

```
server/
├── package.json
├── tsconfig.json
├── nodemon.json
│
└── src/
    ├── index.ts                        # Entry point: starts server
    ├── app.ts                          # Express app setup (middleware, routes)
    ├── server.ts                       # HTTP server + Socket.IO attachment
    │
    ├── config/                         # ── Configuration ──
    │   ├── env.ts                      # Environment variables (dotenv + validation)
    │   ├── database.ts                 # SQLite connection + pragmas
    │   └── constants.ts                # Server constants (limits, timeouts)
    │
    ├── database/                       # ── Database Layer ──
    │   ├── connection.ts               # Database singleton
    │   ├── migrations/                 # SQL migration files
    │   │   ├── 001_create_users.sql
    │   │   ├── 002_create_projects.sql
    │   │   ├── 003_create_project_members.sql
    │   │   ├── 004_create_project_files.sql
    │   │   ├── 005_create_chat_messages.sql
    │   │   ├── 006_create_edit_events.sql
    │   │   └── 007_create_ai_reviews.sql
    │   ├── migrate.ts                  # Migration runner
    │   └── seed/
    │       └── templates.ts            # Seed template data
    │
    ├── models/                         # ── Data Models (SQL queries) ──
    │   ├── User.ts                     # User CRUD queries
    │   ├── Project.ts                  # Project CRUD queries
    │   ├── ProjectMember.ts            # Membership queries
    │   ├── File.ts                     # File metadata queries
    │   ├── ChatMessage.ts              # Chat queries
    │   ├── EditEvent.ts                # Edit history queries
    │   └── AIReview.ts                 # AI review queries
    │
    ├── routes/                         # ── Express Routes ──
    │   ├── index.ts                    # Route aggregator
    │   ├── auth.routes.ts              # /api/auth/*
    │   ├── project.routes.ts           # /api/projects/*
    │   ├── file.routes.ts              # /api/projects/:id/files/*
    │   ├── template.routes.ts          # /api/templates
    │   ├── chat.routes.ts              # /api/projects/:id/chat
    │   ├── history.routes.ts           # /api/projects/:id/history
    │   └── review.routes.ts            # /api/projects/:id/reviews
    │
    ├── controllers/                    # ── Route Handlers ──
    │   ├── auth.controller.ts          # Register, login, refresh, profile
    │   ├── project.controller.ts       # Project CRUD, invite, join
    │   ├── file.controller.ts          # File CRUD, tree, download
    │   ├── template.controller.ts      # List templates
    │   ├── chat.controller.ts          # Chat history
    │   ├── history.controller.ts       # Edit event history
    │   └── review.controller.ts        # AI review CRUD
    │
    ├── services/                       # ── Business Logic ──
    │   ├── auth.service.ts             # Password hashing, JWT generation
    │   ├── project.service.ts          # Project business logic
    │   ├── file.service.ts             # File I/O, tree building
    │   ├── template.service.ts         # Template copying
    │   └── chat.service.ts             # Message handling
    │
    ├── middleware/                      # ── Express Middleware ──
    │   ├── auth.middleware.ts           # JWT verification
    │   ├── project.middleware.ts        # Project membership check
    │   ├── validation.middleware.ts     # Zod schema validation
    │   ├── errorHandler.ts             # Global error handler
    │   └── rateLimiter.ts              # Rate limiting config
    │
    ├── websocket/                      # ── WebSocket (Socket.IO) ──
    │   ├── index.ts                    # Socket.IO server setup + namespace registration
    │   ├── middleware/
    │   │   └── wsAuth.ts               # WebSocket JWT auth middleware
    │   └── handlers/
    │       ├── collaboration.handler.ts # Yjs sync + awareness
    │       ├── terminal.handler.ts      # Terminal create/input/output/kill
    │       ├── chat.handler.ts          # Chat messages + typing
    │       ├── presence.handler.ts      # Join/leave + online users
    │       └── lsp.handler.ts           # LSP message proxying
    │
    ├── collaboration/                  # ── CRDT / Yjs Engine ──
    │   ├── YjsManager.ts              # Document lifecycle (create, load, persist, destroy)
    │   ├── DocumentStore.ts           # In-memory Y.Doc cache + persistence timer
    │   ├── AwarenessManager.ts        # Awareness state aggregation
    │   └── MergeTracker.ts            # Edit event recording for merge visualization
    │
    ├── terminal/                       # ── Terminal Engine ──
    │   ├── TerminalManager.ts          # Terminal session lifecycle
    │   ├── TmuxSession.ts              # tmux command wrappers (new, attach, kill)
    │   └── SessionCleanup.ts           # Idle session cleanup (30 min timeout)
    │
    ├── lsp/                            # ── Language Server Protocol ──
    │   ├── LSPManager.ts               # LSP server lifecycle (spawn, pipe, kill)
    │   ├── servers/
    │   │   ├── python.ts               # Pyright spawn config
    │   │   └── typescript.ts           # tsserver spawn config
    │   └── protocol.ts                 # JSON-RPC message framing
    │
    ├── templates/                      # ── Project Template Files ──
    │   ├── index.ts                    # Template registry
    │   ├── python-flask/
    │   │   ├── app.py
    │   │   ├── requirements.txt
    │   │   └── README.md
    │   ├── python-fastapi/
    │   │   ├── main.py
    │   │   ├── requirements.txt
    │   │   └── README.md
    │   ├── node-express/
    │   │   ├── index.js
    │   │   ├── package.json
    │   │   └── README.md
    │   ├── react-app/
    │   │   ├── src/
    │   │   │   ├── App.jsx
    │   │   │   └── main.jsx
    │   │   ├── index.html
    │   │   ├── package.json
    │   │   ├── vite.config.js
    │   │   └── README.md
    │   ├── go-gin/
    │   │   ├── main.go
    │   │   ├── go.mod
    │   │   └── README.md
    │   ├── rust-actix/
    │   │   ├── src/
    │   │   │   └── main.rs
    │   │   ├── Cargo.toml
    │   │   └── README.md
    │   ├── java-spring/
    │   │   ├── src/
    │   │   │   └── Main.java
    │   │   ├── pom.xml
    │   │   └── README.md
    │   ├── c-project/
    │   │   ├── src/
    │   │   │   └── main.c
    │   │   ├── include/
    │   │   │   └── main.h
    │   │   ├── Makefile
    │   │   └── README.md
    │   └── cpp-project/
    │       ├── src/
    │       │   └── main.cpp
    │       ├── include/
    │       │   └── main.hpp
    │       ├── CMakeLists.txt
    │       └── README.md
    │
    ├── utils/                          # ── Utility Functions ──
    │   ├── jwt.ts                      # JWT sign/verify helpers
    │   ├── hash.ts                     # bcrypt hash/compare
    │   ├── uuid.ts                     # UUID generation
    │   ├── validators.ts               # Zod schemas
    │   ├── fileSystem.ts               # Safe file I/O helpers
    │   ├── inviteCode.ts              # Random invite code generator
    │   └── logger.ts                   # Winston or console logger
    │
    └── types/                          # ── Server-Specific Types ──
        ├── express.d.ts                # Express Request augmentation (req.user)
        └── socket.d.ts                 # Socket.IO type augmentation
```

---

### `projects/` — User Project Storage

```
projects/                               # ── gitignored, created at runtime ──
└── {project-uuid}/                     # One directory per project
    ├── .yjs/                           # Yjs persistence (binary state files)
    │   ├── src%2Fmain.py.ystate        # URL-encoded file paths
    │   └── README.md.ystate
    ├── src/
    │   ├── main.py
    │   └── utils.py
    ├── requirements.txt
    └── README.md
```

---

### `data/` — Database Storage

```
data/                                   # ── gitignored, created at runtime ──
├── syncwrite.db                        # SQLite database file
├── syncwrite.db-wal                    # WAL file (auto-created)
└── syncwrite.db-shm                    # Shared memory file (auto-created)
```

---

## File Count Summary

| Directory | Files | Description |
|-----------|-------|-------------|
| Root | 8 | Config files |
| `shared/` | 11 | Shared types & constants |
| `client/src/` | ~85 | React components, hooks, stores, utils |
| `server/src/` | ~65 | Routes, controllers, services, WebSocket, engine |
| `server/templates/` | ~30 | Template boilerplate files |
| **Total** | **~199** | Excluding node_modules and runtime data |

---

## Key `.gitignore`

```gitignore
# Dependencies
node_modules/

# Runtime data
projects/
data/

# Environment
.env

# Build output
client/dist/
server/dist/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```
