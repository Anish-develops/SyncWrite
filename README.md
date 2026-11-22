# 🛠️ SyncWrite — Collaborative Code Editor

> **A self-hosted, collaborative coding environment where multiple developers can code together in real-time — like Google Docs for code, with the power of a real IDE.**

SyncWrite is an open-source, full-stack collaborative web application built as an "Industrial Workshop" IDE. It combines Monaco Editor, Conflict-Free Replicated Data Types (CRDT via Yjs), per-user interactive terminals, Language Server Protocol (LSP) intelligence, and privacy-preserving client-side AI.

---

## 🌟 Key Features

- **Real-Time CRDT Collaboration**: Multiple users editing the exact same file simultaneously with conflict-free merges using Yjs and Monaco Editor.
- **Awareness & Presence**: Live remote cursors with user-colored labels, selections, and active collaborator status.
- **Attribution & Merge Visualization**: Color-coded line-by-line edit attribution fading over time, chronological timeline panel, and time-travel playback scrubber.
- **Per-User Terminals**: Interactive terminal sessions backed by pseudo-terminals and xterm.js with auto-resize and multiple tabs.
- **9 Instant Project Templates**:
  - 🐍 Python Flask (`app.py`, `requirements.txt`)
  - ⚡ Python FastAPI (`main.py`, `requirements.txt`)
  - 🟢 Node.js Express (`index.js`, `package.json`)
  - ⚛️ React + Vite (`src/App.jsx`, `src/main.jsx`, `vite.config.js`)
  - 🐹 Go Gin (`main.go`, `go.mod`)
  - 🦀 Rust Actix (`src/main.rs`, `Cargo.toml`)
  - ☕ Java Spring Boot (`src/Main.java`, `pom.xml`)
  - 🔧 C Project (`src/main.c`, `include/main.h`, `Makefile`)
  - ⚙️ C++ Project (`src/main.cpp`, `include/main.hpp`, `CMakeLists.txt`)
- **Client-Side AI Code Intelligence**:
  - **Inline Autocomplete**: Monaco `InlineCompletionProvider` ghost text suggestions (debounced 300ms) with context before and after the cursor.
  - **AI Code Review**: Automated code review producing gutter decorations, line-by-line feedback, and one-click "Apply Suggestion".
  - **BYO API Keys**: Directly calls OpenAI, Google Gemini, or Anthropic (via proxy) from your browser. Keys are stored in `localStorage` and never saved on the server.
- **In-Project Chat**: Live team chat with code-reference snippets (linking directly to specific file and line).
- **Industrial Workshop Design System**:
  - Warm, utilitarian craftsman aesthetic with terracotta accents (`oklch(55% 0.14 35)`), warm sand paper tones, and deep slate blue.
  - Instrument Sans for UI and JetBrains Mono for code.
  - Thoughtful light and dark modes.

---

## 🏗️ Architecture

```
syncwrite/
├── client/                     # React 18, Vite 5, Tailwind CSS 3, Monaco, Zustand, xterm.js
│   ├── src/
│   │   ├── api/                # Axios REST clients
│   │   ├── components/         # Layout, Editor, FileTree, Terminal, Chat, AI
│   │   ├── pages/              # Landing, Login, Register, Dashboard, Editor, Join
│   │   └── store/              # Zustand stores (Auth, Project, Editor, Terminal, AI)
│   └── vite.config.ts
├── server/                     # Node.js 20+, Express 4, Socket.IO 4, SQLite, Yjs, PTY
│   ├── src/
│   │   ├── collaboration/      # YjsManager, DocumentStore, MergeTracker
│   │   ├── controllers/        # Auth, Project, File, Template, Chat, Review, AI
│   │   ├── database/           # SQLite migrations & schema
│   │   ├── lsp/                # Language Server Protocol stdio manager
│   │   ├── models/             # SQL query models
│   │   ├── terminal/           # TerminalManager (PTY & interactive processes)
│   │   └── websocket/          # Namespaces: /collab, /terminal, /chat, /lsp
│   └── nodemon.json
└── shared/                     # Shared TypeScript types, event constants, & limits
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v20 LTS or newer (tested on v24)
- **npm**: v10 or newer

### 2. Installation
Clone the repository and install all dependencies:

```bash
git clone https://github.com/your-username/syncwrite.git
cd syncwrite
npm install
```

### 3. Build Shared Library & Applications
```bash
npm run build
```

### 4. Development Mode
Run both frontend (Vite) and backend (Express + Socket.IO) concurrently:

```bash
npm run dev
```

- **Client App**: [http://localhost:5173](http://localhost:5173)
- **Server API**: [http://localhost:3001/api](http://localhost:3001/api)

### 5. Production Start
```bash
npm start
```
The server serves both the REST API, WebSocket namespaces, and the built React frontend from a single port (`3001`).

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new account |
| `POST` | `/api/auth/login` | Login and receive JWT access/refresh tokens |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `GET` | `/api/auth/me` | Current user profile |
| `GET` | `/api/projects` | List user projects |
| `POST` | `/api/projects` | Create new project (or bootstrap template) |
| `GET` | `/api/projects/:id` | Project details & members |
| `POST` | `/api/projects/:id/invite` | Generate shareable invite link |
| `POST` | `/api/projects/join/:code` | Join project via invite link |
| `GET` | `/api/projects/:id/files` | Recursive file tree |
| `GET` | `/api/projects/:id/files/*` | Read file content |
| `POST` | `/api/projects/:id/files` | Create file or directory |
| `PUT` | `/api/projects/:id/files/*` | Save file content |
| `DELETE` | `/api/projects/:id/files/*` | Delete file or directory |
| `GET` | `/api/projects/:id/download` | Download project as ZIP |
| `GET` | `/api/templates` | List all 9 project templates |
| `GET` | `/api/projects/:id/chat` | Chat message history |
| `GET` | `/api/projects/:id/history` | Merge edit events history |
| `GET` | `/api/projects/:id/reviews` | AI code review history |
| `POST` | `/api/projects/:id/reviews` | Save AI review results |

---

## 🔒 Security & Privacy

- **Password Security**: Passwords hashed with `bcrypt` (cost factor 12).
- **Authentication**: JWT access token (1h) + refresh token (7d).
- **AI Privacy**: API keys for OpenAI, Gemini, and Claude are **never** stored on the server. All requests originate client-side with keys stored in the user's browser `localStorage`.
- **Path Sanitization**: All file operations check for directory traversal exploits (`../`).

---

## 📄 License

MIT License. Designed and engineered for collaborative software development.
