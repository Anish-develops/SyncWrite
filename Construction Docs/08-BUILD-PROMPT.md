# 🤖 Build Prompt — SyncWrite

> A comprehensive prompt to recreate the entire SyncWrite project from scratch.
> Copy this prompt into an AI coding assistant to generate the project.

---

## The Prompt

```
You are building a full-stack web application called "SyncWrite" — a collaborative code editor
that allows multiple users to simultaneously write, edit, and run code in shared projects.
Think of it as a self-hosted Replit clone with real-time collaboration, AI-powered code
intelligence, and merge visualization.

=== PROJECT STRUCTURE ===

This is a TypeScript monorepo using npm workspaces with 3 packages:
- client/ — React 18 frontend (Vite, Tailwind CSS)
- server/ — Node.js backend (Express, Socket.IO)
- shared/ — Shared TypeScript types and constants

=== TECH STACK ===

Frontend:
- React 18 with Vite 5 as build tool
- TypeScript 5 for type safety
- Tailwind CSS 3 for styling
- Zustand 4 for state management
- React Router 6 for client-side routing
- Monaco Editor (@monaco-editor/react) as the code editor
- Yjs 13 as the CRDT engine for real-time collaboration
- y-monaco for binding Yjs to Monaco Editor
- y-websocket for Yjs WebSocket transport
- xterm.js 5 for terminal emulation in the browser
- xterm-addon-fit for terminal auto-resize
- Socket.IO Client 4 for WebSocket communication
- Axios for REST API calls
- react-resizable-panels for draggable layout dividers
- Lucide React for icons

Backend:
- Node.js 20 LTS
- Express.js 4 for REST API
- Socket.IO 4 for WebSocket server (namespaces: /collab, /terminal, /chat, /lsp)
- better-sqlite3 for SQLite database (WAL mode enabled)
- Yjs server-side with document persistence to filesystem
- node-pty for pseudo-terminal (bridges to tmux)
- tmux for terminal session management
- bcrypt for password hashing
- jsonwebtoken for JWT (access token: 1h, refresh token: 7d)
- Zod for request validation
- uuid for ID generation
- cors, helmet, express-rate-limit for security
- archiver for ZIP file creation

AI (Client-Side Only — API keys NEVER touch the server):
- OpenAI SDK (npm: openai) for GPT-4o completions
- Google Generative AI SDK (npm: @google/generative-ai) for Gemini completions
- Anthropic via server-side proxy (Anthropic doesn't support browser CORS)
- Monaco InlineCompletionProvider for ghost-text autocomplete suggestions
- Debounced trigger: 300ms after last keystroke

LSP (Backend):
- Pyright for Python language intelligence
- TypeScript Language Server (tsserver) for JS/TS intelligence
- LSP messages proxied via WebSocket (JSON-RPC over Socket.IO /lsp namespace)

=== DATABASE SCHEMA (SQLite) ===

Tables:
1. users (id TEXT PK, email TEXT UNIQUE, username TEXT, password_hash TEXT, avatar_color TEXT DEFAULT '#6366F1', created_at TEXT, updated_at TEXT)
2. projects (id TEXT PK, name TEXT, owner_id TEXT FK→users, language TEXT DEFAULT 'javascript', template TEXT NULLABLE, description TEXT, invite_code TEXT UNIQUE, created_at TEXT, updated_at TEXT)
3. project_members (project_id TEXT FK→projects, user_id TEXT FK→users, role TEXT CHECK('owner','editor'), joined_at TEXT, PRIMARY KEY(project_id, user_id))
4. project_files (id TEXT PK, project_id TEXT FK→projects, path TEXT, type TEXT CHECK('file','directory'), size INTEGER, created_at TEXT, updated_at TEXT, UNIQUE(project_id, path))
5. chat_messages (id TEXT PK, project_id FK, user_id FK, message TEXT, code_ref TEXT NULLABLE, created_at TEXT)
6. edit_events (id TEXT PK, project_id FK, user_id FK, file_path TEXT, event_type TEXT CHECK('insert','delete','replace'), line INTEGER, column INTEGER, content TEXT, length INTEGER, created_at TEXT)
7. ai_reviews (id TEXT PK, project_id FK, user_id FK, file_path TEXT, provider TEXT CHECK('openai','gemini','anthropic'), comments TEXT JSON, created_at TEXT)

Enable: foreign_keys=ON, journal_mode=WAL, synchronous=NORMAL

=== REST API ENDPOINTS ===

Auth:
- POST /api/auth/register — { email, username, password } → { user, accessToken, refreshToken }
- POST /api/auth/login — { email, password } → { user, accessToken, refreshToken }
- POST /api/auth/refresh — { refreshToken } → { accessToken }
- GET /api/auth/me — (auth required) → user profile
- PUT /api/auth/profile — (auth required) { username?, avatarColor? } → updated user

Projects:
- POST /api/projects — (auth) { name, language, description?, template? } → project
- GET /api/projects — (auth) → paginated project list (owned + member)
- GET /api/projects/:id — (auth, member) → project with members
- PUT /api/projects/:id — (auth, owner) { name?, description? } → updated project
- DELETE /api/projects/:id — (auth, owner) → 204
- POST /api/projects/:id/invite — (auth, owner) → { inviteCode, inviteUrl }
- POST /api/projects/join/:inviteCode — (auth) → { projectId, role }
- DELETE /api/projects/:id/members/:userId — (auth, owner) → 204

Files:
- GET /api/projects/:id/files — (auth, member) → recursive file tree JSON
- GET /api/projects/:id/files/:path — (auth, member) → { path, content, language, size }
- POST /api/projects/:id/files — (auth, member) { path, type, content? } → file record
- PUT /api/projects/:id/files/:path — (auth, member) { content } → updated file
- PUT /api/projects/:id/files/:path/rename — (auth, member) { newPath } → { oldPath, newPath }
- DELETE /api/projects/:id/files/:path — (auth, member) → 204
- GET /api/projects/:id/download — (auth, member) → ZIP file

Templates:
- GET /api/templates → array of { id, name, language, description, files, runCommand, icon }

Chat:
- GET /api/projects/:id/chat?limit=50&before=messageId — (auth, member) → { messages, hasMore }

History:
- GET /api/projects/:id/history?file=path&limit=100 — (auth, member) → { events }

Reviews:
- GET /api/projects/:id/reviews?file=path — (auth, member) → { reviews }
- POST /api/projects/:id/reviews — (auth, member) { filePath, provider, comments } → review

=== WEBSOCKET EVENTS (Socket.IO) ===

Connection: auth via { token } in handshake, projectId in query.

/collab namespace:
- yjs:sync (bidirectional) — Uint8Array — Yjs sync protocol
- awareness:update (bidirectional) — Uint8Array — cursor, selection, user info
- file:open (client→server) — { filePath }
- file:close (client→server) — { filePath }
- presence:users (server→client) — User[]
- presence:join (server→client) — User
- presence:leave (server→client) — { userId }
- merge:event (server→client) — EditEvent

/terminal namespace:
- terminal:create (client→server) — { cols, rows }
- terminal:created (server→client) — { terminalId }
- terminal:input (client→server) — { terminalId, data }
- terminal:output (server→client) — { terminalId, data }
- terminal:resize (client→server) — { terminalId, cols, rows }
- terminal:exit (server→client) — { terminalId, code }
- terminal:kill (client→server) — { terminalId }

/chat namespace:
- chat:message (bidirectional) — { message, codeRef? }
- chat:typing (client→server) — { userId }

/lsp namespace:
- lsp:request (client→server) — { id, method, params }
- lsp:response (server→client) — { id, result?, error? }
- lsp:notification (bidirectional) — { method, params }

=== COLLABORATION ENGINE (CRDT) ===

Use Yjs with y-monaco binding:
- Each file = one Y.Doc containing a Y.Text for content
- Yjs sync protocol runs over Socket.IO (not raw WebSocket)
- Server maintains an in-memory Map<string, Y.Doc> (key = projectId:filePath)
- Persistence: serialize Y.Doc state to ./projects/{projectId}/.yjs/{encodedFilePath}.ystate
- Persist every 30 seconds and when last user disconnects from a document
- On first open: if .ystate exists, load it; otherwise create Y.Doc from file content on disk
- Awareness protocol shares: { cursor: {line, col}, selection: {start, end}, user: {id, name, color} }

=== TERMINAL ENGINE ===

- Each user gets private tmux sessions (named: sw-{userId}-{projectId}-{tabIndex})
- node-pty spawns tmux with working directory = ./projects/{projectId}/
- Input from xterm.js → Socket.IO → node-pty.write()
- Output from node-pty.onData() → Socket.IO → xterm.js
- Resize: xterm-addon-fit → Socket.IO → node-pty.resize(cols, rows)
- Idle cleanup: kill tmux sessions after 30 minutes of no I/O
- Support multiple terminal tabs per user

=== AI FEATURES ===

Autocomplete:
- Implement Monaco InlineCompletionProvider interface
- On trigger: take 200 lines before cursor + 50 lines after as context
- Build a prompt: "Complete the following {language} code. Only return the completion, no explanation."
- Call the user's selected AI provider directly from the browser
- API key stored in localStorage (key: "syncwrite_ai_key_{provider}")
- Support switching between OpenAI, Gemini, Anthropic via dropdown
- Debounce: 300ms after last keystroke before triggering
- Show as ghost text; accept with Tab, dismiss by continuing to type

Code Review:
- User clicks "AI Review" button or presses Ctrl+Shift+R
- Send file content to AI with prompt: "Review this {language} code. Return a JSON array of objects with: line (number), severity ('error'|'warning'|'info'), message (string), suggestion (string, the corrected code)."
- Parse the JSON response
- Render as Monaco decorations: gutter icons (colored dots) + hover tooltips with message + suggestion
- Display in a side panel with accept/dismiss per comment
- Save review results to server via POST /api/projects/:id/reviews

=== LSP INTEGRATION ===

- LSP Manager spawns Pyright (for .py files) and tsserver (for .js/.ts files) as child processes
- Communication via stdio (stdin/stdout pipes)
- JSON-RPC messages framed with Content-Length headers
- Server-side: parse JSON-RPC from LSP stdio → emit via Socket.IO /lsp namespace
- Client-side: use monaco-languageclient or manual registration of providers
- Features to support: textDocument/diagnostics, textDocument/hover, textDocument/completion, textDocument/definition
- One LSP server instance per project (shared among all collaborators)
- Kill LSP servers when last user leaves the project

=== MERGE VISUALIZATION ===

- Hook into Yjs Y.Text observe() to capture insert/delete events
- Each event tagged with userId from awareness state
- Store edit events in SQLite (edit_events table) for history
- Visualization modes:
  1. Live attribution: color-coded background highlights showing who edited each region (fade after 30 seconds)
  2. Timeline: scrollable list of edit events with user, file, timestamp, and snippet
  3. Playback: slider to step through edit history chronologically, replaying changes in the editor

=== PROJECT TEMPLATES ===

Provide 9 templates:
1. python-flask: Flask REST API (app.py, requirements.txt, README.md)
2. python-fastapi: FastAPI + Uvicorn (main.py, requirements.txt, README.md)
3. node-express: Express REST API (index.js, package.json, README.md)
4. react-app: React + Vite (src/App.jsx, src/main.jsx, index.html, package.json, vite.config.js, README.md)
5. go-gin: Gin web server (main.go, go.mod, README.md)
6. rust-actix: Actix-web server (src/main.rs, Cargo.toml, README.md)
7. java-spring: Spring Boot basics (src/Main.java, pom.xml, README.md)
8. c-project: C with Makefile (src/main.c, include/main.h, Makefile, README.md)
9. cpp-project: C++ with CMake (src/main.cpp, include/main.hpp, CMakeLists.txt, README.md)

Each template includes working boilerplate code that runs immediately.

=== UI LAYOUT & AESTHETIC DIRECTION ===

Design Philosophy: "Industrial Workshop"
- Warm, utilitarian, craftsman aesthetic. Avoid the generic AI slop palette (NO cyan-on-dark, NO purple/blue gradients, NO glassmorphism/glow borders).
- Light-mode-first with a considered warm-charcoal dark mode. All neutrals subtly warm-tinted (OKLCH).
- Primary accent: Terracotta (oklch(55% 0.14 35)), Secondary: Deep slate blue, Surfaces: Warm cream/sand paper tones.
- Typography: "Instrument Sans" (Google Fonts) for display/UI (weights 400, 500, 600, 700) + "JetBrains Mono" ONLY for code & terminal.
- Strict 8px fluid spacing scale. Left-aligned, asymmetric compositions, no cards-inside-cards or generic icon grids.
- Layout:
  * LEFT: 240px collapsible file tree sidebar (warm sunken background, 16px row indent, custom language icons).
  * CENTER: Editor with active tab bleeding into editor surface (2px terracotta top-border indicator), custom warm-tinted Monaco theme.
  * BOTTOM: Resizable dark-warm terminal drawer (min 120px) with custom tabs.
  * RIGHT: Toggleable 280px drawer for Chat or AI Review comments.
  * TOP: 48px Header bar with bold project title, overlapping colored collaborator presence dots, invite & settings controls.
- Auth Pages: Asymmetric 60/40 two-column layout with bold editorial typography ("Build together."), NOT a centered floating glass card.
- Project Dashboard: Clean, scannable table/list layout with subtle row hovers, NOT an identical card grid.

=== AUTHENTICATION ===

- Simple email + password signup (no OAuth)
- bcrypt for hashing (cost factor 12)
- JWT access token (1h expiry) + refresh token (7d expiry)
- Access token sent as Bearer token in Authorization header
- Refresh token sent in POST body to /api/auth/refresh
- WebSocket auth: token passed in Socket.IO handshake auth object
- Rate limit auth endpoints: 5 requests/minute per IP

=== SUPPORTED LANGUAGES ===

The terminal must have these runtimes available:
- Python 3.11+ (python3, pip)
- Node.js 20+ (node, npm)
- Go 1.21+ (go)
- Rust 1.75+ (rustc, cargo)
- Java 17+ (javac, java)
- GCC 12+ (gcc)
- G++ 12+ (g++)

=== FILE STORAGE ===

- User projects stored at: ./projects/{project-uuid}/
- Yjs state stored at: ./projects/{project-uuid}/.yjs/
- SQLite database at: ./data/syncwrite.db
- All runtime data directories are gitignored

=== BUILD & RUN ===

Root package.json scripts:
- "dev": runs both client (vite) and server (nodemon) concurrently
- "build": builds shared → client → server
- "start": runs the production server

The server serves the built client in production (express.static pointing to client/dist).

=== IMPORTANT NOTES ===

1. AI API keys are NEVER sent to the SyncWrite server. They are stored in browser localStorage and API calls go directly from the browser to the AI provider.
2. Exception: Anthropic doesn't support browser CORS, so implement a lightweight proxy endpoint: POST /api/ai/proxy/anthropic that forwards the request (API key in request body, not stored).
3. Yjs documents are the source of truth for file content while anyone has the file open. They are flushed to disk periodically.
4. Each user gets their own tmux session — terminals are NOT shared between users.
5. LSP servers are shared per-project — all users see the same diagnostics.
6. The merge visualization tracks edit attribution using Yjs awareness (which user made which edit).

Build the complete project with all files, working code, and proper error handling.
Start with the monorepo setup, then build Phase 1 (foundation), then Phase 2 (collaboration),
and so on through all 7 phases.
```

---

## Usage Notes

> [!TIP]
> **This prompt is ~2,500 words.** Most AI coding assistants have context limits. For best results:
> 1. Use the full prompt for the initial architecture + setup (Phase 1)
> 2. For subsequent phases, reference the specific phase section from `07-MVP-AND-BUILD-PLAN.md`
> 3. Feed the relevant endpoint definitions from `05-API-ENDPOINTS.md` when building routes

> [!IMPORTANT]
> **Before using this prompt**, ensure you have read and agreed with all architectural decisions in the other documents. Modify the prompt to reflect any changes you've made to the tech stack, schema, or API design.

---

## Quick Start Prompt (Minimal — Phase 1 Only)

For a faster start, use this condensed prompt to get the foundation built first:

```
Build a TypeScript monorepo called "syncwrite" with npm workspaces:
- client/ (React 18 + Vite + Tailwind CSS + Zustand)
- server/ (Express + Socket.IO + better-sqlite3)
- shared/ (shared TypeScript types)

Phase 1 requirements:
1. Auth system: email/password registration + login, bcrypt hashing, JWT tokens (access 1h, refresh 7d)
2. SQLite database with tables: users, projects, project_members, project_files
3. REST API for: auth (register, login, refresh, me), projects (CRUD), files (tree, read, create, update, delete, rename)
4. React pages: Landing, Login, Register, Dashboard (project list), Editor (IDE layout)
5. File tree sidebar (recursive, with context menu for create/rename/delete)
6. Monaco Editor with file tabs and syntax highlighting
7. VS Code-inspired layout: sidebar | editor tabs + editor | terminal placeholder at bottom

The editor page should have a resizable 3-panel layout using react-resizable-panels.
Use Lucide React for icons. Use Zod for input validation on the server.
Store project files at ./projects/{uuid}/ on the server filesystem.
```
