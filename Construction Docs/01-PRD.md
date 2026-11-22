# 📋 Product Requirements Document — SyncWrite

> **Collaborative Code Editor with AI-Powered Intelligence**
> College Minor Project | Self-Hosted | Open Source

---

## 1. Product Overview

**SyncWrite** is a web-based collaborative code editor that enables multiple developers to simultaneously write, edit, run, and debug code within shared projects. It combines the editing power of Monaco Editor, real-time collaboration via CRDT, per-user sandboxed terminals via tmux, AI-powered code completion, and Language Server Protocol intelligence into a single self-hosted platform.

### 1.1 Vision Statement

*"A self-hosted, collaborative coding environment where multiple developers can code together in real-time — like Google Docs for code, with the power of a real IDE."*

### 1.2 Target Users

- Computer science students working on group projects
- Developers doing pair/mob programming
- Educators running live coding sessions
- Open-source contributors needing a quick shared workspace

### 1.3 Key Differentiators vs Replit/CodeSandbox

| Feature | Replit | CodeSandbox | SyncWrite |
|---------|--------|-------------|-----------|
| Self-hosted | ❌ | ❌ | ✅ |
| Free & open source | ❌ | Partial | ✅ |
| CRDT-based merge | ❌ | ❌ | ✅ |
| Merge visualization | ❌ | ❌ | ✅ |
| BYO API key for AI | ❌ | ❌ | ✅ |
| AI code review mode | ❌ | ❌ | ✅ |
| Per-user terminals | ✅ | ❌ | ✅ |
| LSP integration | Partial | Partial | ✅ |
| 7 language support | ✅ | Partial | ✅ |

---

## 2. User Stories

### 2.1 Authentication

| ID | As a... | I want to... | So that... |
|----|---------|-------------|------------|
| US-01 | Visitor | Register with email and password | I can create and own projects |
| US-02 | Visitor | Log in with my credentials | I can access my projects |
| US-03 | User | Update my display name and avatar color | Collaborators can identify me |
| US-04 | User | Log out securely | My session is terminated |

### 2.2 Project Management

| ID | As a... | I want to... | So that... |
|----|---------|-------------|------------|
| US-05 | User | Create a new blank project | I can start coding from scratch |
| US-06 | User | Create a project from a template | I can bootstrap quickly |
| US-07 | User | See all my projects on a dashboard | I can navigate between them |
| US-08 | Owner | Delete a project | I can clean up old work |
| US-09 | Owner | Invite others via a shareable link | Others can join my project |
| US-10 | Owner | Remove a member from a project | I can control access |

### 2.3 File Management

| ID | As a... | I want to... | So that... |
|----|---------|-------------|------------|
| US-11 | Member | See a file tree in the sidebar | I can navigate the project structure |
| US-12 | Member | Create new files and folders | I can organize code |
| US-13 | Member | Rename and delete files/folders | I can refactor the structure |
| US-14 | Member | Open files in editor tabs | I can work on multiple files |
| US-15 | Member | Download the project as a ZIP | I can save it locally |

### 2.4 Code Editing & Collaboration

| ID | As a... | I want to... | So that... |
|----|---------|-------------|------------|
| US-16 | Member | Edit code with syntax highlighting | I can read and write code easily |
| US-17 | Member | See other users' cursors in real-time | I know where they are editing |
| US-18 | Member | Edit the same file simultaneously | We can pair program in real-time |
| US-19 | Member | See which user edited which lines | I can understand contribution history |
| US-20 | Member | View a merge visualization timeline | I can see how concurrent edits were merged |
| US-21 | Member | Playback editing history | I can review how the code evolved |

### 2.5 Terminal

| ID | As a... | I want to... | So that... |
|----|---------|-------------|------------|
| US-22 | Member | Open a private terminal | I can run commands independently |
| US-23 | Member | Select a language runtime | I can run Python, Node, Go, etc. |
| US-24 | Member | Resize the terminal panel | I can adjust my workspace layout |
| US-25 | Member | Have multiple terminal tabs | I can run different processes |

### 2.6 AI Features

| ID | As a... | I want to... | So that... |
|----|---------|-------------|------------|
| US-26 | Member | Enter my AI API key in settings | I can enable AI features |
| US-27 | Member | Choose AI provider (OpenAI/Gemini/Claude) | I can use my preferred provider |
| US-28 | Member | Get inline autocomplete suggestions | I can code faster |
| US-29 | Member | Request an AI code review | I can get automated feedback on my code |
| US-30 | Member | See AI review comments inline | I can understand and act on suggestions |

### 2.7 Language Intelligence (LSP)

| ID | As a... | I want to... | So that... |
|----|---------|-------------|------------|
| US-31 | Member | See syntax errors underlined in real-time | I can fix errors as I type |
| US-32 | Member | Get hover information on symbols | I can understand APIs and types |
| US-33 | Member | Use go-to-definition | I can navigate the codebase |
| US-34 | Member | Get autocomplete from LSP | I get language-aware suggestions |

### 2.8 Project Templates

| ID | As a... | I want to... | So that... |
|----|---------|-------------|------------|
| US-35 | User | Browse available project templates | I can pick a starting point |
| US-36 | User | Bootstrap from a template | I get pre-configured files and run commands |
| US-37 | User | See templates for all 7 languages | I can start in any supported language |

---

## 3. Functional Requirements

### FR-01: Authentication System
- Email + password registration with validation
- JWT-based session management (access + refresh tokens)
- Password hashing with bcrypt (cost factor ≥ 10)
- Protected API routes via middleware

### FR-02: Project CRUD
- Create, read, update, delete projects
- Each project has: name, owner, language, created/updated timestamps
- Project isolation: each project has its own directory on the server filesystem

### FR-03: Real-Time Collaboration (CRDT)
- Yjs documents synced via WebSocket (y-websocket protocol)
- Each file = one Yjs document (Y.Text)
- Awareness protocol for cursor/selection/presence sharing
- Automatic conflict-free merge of concurrent edits
- Document state persisted to SQLite on interval and on last-user-disconnect

### FR-04: File System
- Server-side project directories under `./projects/<project-id>/`
- File tree API returns recursive directory structure
- Create, rename, move, delete files and folders
- File content served via REST; real-time sync via Yjs

### FR-05: Monaco Editor Integration
- Syntax highlighting for: Python, JavaScript, TypeScript, Go, Rust, Java, C, C++
- Editor tabs with unsaved-change indicators
- Minimap, line numbers, word wrap toggle
- Keyboard shortcuts (Ctrl+S to save, Ctrl+P for file search)

### FR-06: Terminal (tmux + xterm.js)
- Each user gets a private tmux session per project
- Terminal input/output streamed via WebSocket
- Support for terminal resize (SIGWINCH)
- Multiple terminal tabs per user
- Pre-installed runtimes: python3, node, go, rustc/cargo, javac/java, gcc, g++

### FR-07: AI Code Completion
- API key stored in browser localStorage (never sent to server)
- API calls made directly from client to AI provider
- Monaco InlineCompletionProvider for ghost-text suggestions
- Supported providers: OpenAI, Google Gemini, Anthropic Claude
- Debounced trigger (300ms after last keystroke)
- Context: current file content + cursor position + file language

### FR-08: AI Code Review
- User triggers review on current file or selected code
- Client sends code + diff to AI provider with a review prompt
- Response parsed into inline comments (line number + message + severity)
- Comments rendered as Monaco decorations (gutter icons + hover tooltips)
- Comments dismissible individually or all at once

### FR-09: Language Server Protocol
- Python: Pyright LSP server
- JavaScript/TypeScript: TypeScript Language Server (tsserver)
- LSP servers run per-project on the backend
- LSP messages proxied via WebSocket to Monaco
- Features: diagnostics, hover, completion, go-to-definition

### FR-10: Merge Visualization
- Track edit operations with user attribution (via Yjs awareness)
- Color-coded regions showing each user's recent edits
- Timeline view: scrollable history of merge events
- Playback mode: step through edits chronologically
- Fade-out effect: highlight intensity decreases over time (30s)

### FR-11: Project Templates
- Pre-defined templates stored in `server/src/templates/`
- Each template: file structure + boilerplate code + run command + language
- Templates for all 7 languages with common frameworks
- One-click creation copies template files into new project directory

### FR-12: Presence & Awareness
- Online user list in sidebar (avatar color + name)
- Per-file user indicators (who has which file open)
- Cursor labels with username
- Typing indicator in chat

### FR-13: In-Project Chat
- Text chat sidebar within the project editor
- Messages stored in SQLite
- Real-time via WebSocket
- Code-linked messages: select code → "Discuss this" → chat message with file:line reference

---

## 4. Non-Functional Requirements

### NFR-01: Performance
- Editor responsiveness: < 50ms keystroke-to-render latency
- CRDT sync latency: < 100ms between peers on same network
- Terminal latency: < 50ms input-to-output
- File tree load: < 500ms for projects with ≤ 500 files

### NFR-02: Scalability (Self-Hosted Context)
- Support 5-10 concurrent users per project
- Support 10-20 active projects per server instance
- SQLite handles up to ~100 concurrent readers (sufficient for college project)

### NFR-03: Security
- Passwords hashed with bcrypt
- JWT tokens with expiry (access: 1h, refresh: 7d)
- Project access restricted to owner + invited members
- Terminal sandboxed per-user (tmux sessions with limited permissions)
- AI API keys never touch the server
- Input sanitization on all API endpoints
- Rate limiting on auth endpoints (5 attempts/min)

### NFR-04: Reliability
- Yjs document state persisted every 30 seconds and on disconnect
- Graceful WebSocket reconnection with exponential backoff
- Terminal session recovery on page reload (tmux attach)

### NFR-05: Usability
- Responsive layout (desktop-first, min-width: 1024px)
- Dark/light theme toggle
- Keyboard-navigable file tree and editor
- Loading skeletons for async operations

---

## 5. Out of Scope (v1)

These features are explicitly **not** included in the initial build:

- OAuth / social login (GitHub, Google)
- Git integration (clone, commit, push)
- Docker containerization per project
- Voice/video chat
- Mobile-optimized layout
- Plugin/extension system
- Version history with named checkpoints
- File upload (drag-and-drop)
- Multi-language LSP beyond Python + JS/TS
- Collaborative debugging (shared breakpoints)
- Project forking / cloning
- Admin dashboard

---

## 6. Success Metrics

For a college minor project, success is measured by:

| Metric | Target |
|--------|--------|
| Two users editing same file simultaneously | Merge works without data loss |
| All 7 language runtimes functional | Code runs and output appears in terminal |
| AI autocomplete triggers | Suggestions appear within 2 seconds |
| AI code review produces inline comments | At least 3 meaningful comments per review |
| LSP diagnostics appear | Errors underline within 1 second of typing |
| Project template bootstrap | Project is runnable within 5 seconds of creation |
| Merge visualization shows attribution | Each user's edits are color-coded correctly |

---

## 7. Glossary

| Term | Definition |
|------|-----------|
| **CRDT** | Conflict-free Replicated Data Type — a data structure that can be edited concurrently and merged automatically without conflicts |
| **Yjs** | A high-performance CRDT implementation for JavaScript |
| **LSP** | Language Server Protocol — a standard protocol for IDE features (autocomplete, diagnostics, hover) |
| **Monaco** | The code editor that powers VS Code, available as a standalone web component |
| **tmux** | Terminal multiplexer — allows multiple terminal sessions on a single server |
| **xterm.js** | Terminal emulator for the browser that renders terminal output |
| **OT** | Operational Transformation — an older alternative to CRDT for real-time collaboration |
| **Awareness** | Yjs protocol for sharing ephemeral state (cursors, selections, presence) |
