# 🔌 API Endpoints — SyncWrite

> Every REST endpoint and WebSocket event, with request/response schemas.

---

## Base URL

```
http://localhost:3001/api
```

## Authentication

All protected endpoints require:
```
Authorization: Bearer <access_token>
```

---

## 1. Authentication Endpoints

### POST `/api/auth/register`

Create a new user account.

| Field | Details |
|-------|---------|
| **Auth** | None |
| **Rate Limit** | 5 requests/minute per IP |

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securePassword123"
}
```

**Validation Rules:**
- `email`: valid email format, unique
- `username`: 2-30 characters, alphanumeric + underscore
- `password`: minimum 8 characters, at least 1 number

**Response (201):**
```json
{
  "user": {
    "id": "uuid-v4",
    "email": "user@example.com",
    "username": "johndoe",
    "avatarColor": "#6366F1",
    "createdAt": "2025-01-15T10:30:00Z"
  },
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi..."
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Validation error (details in body) |
| 409 | Email already registered |

---

### POST `/api/auth/login`

Authenticate and receive tokens.

| Field | Details |
|-------|---------|
| **Auth** | None |
| **Rate Limit** | 5 requests/minute per IP |

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid-v4",
    "email": "user@example.com",
    "username": "johndoe",
    "avatarColor": "#6366F1"
  },
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi..."
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Invalid email or password |
| 429 | Too many login attempts |

---

### POST `/api/auth/refresh`

Get a new access token using a refresh token.

| Field | Details |
|-------|---------|
| **Auth** | None (refresh token in body) |

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOi..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOi..."
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 401 | Invalid or expired refresh token |

---

### GET `/api/auth/me`

Get current user profile.

| Field | Details |
|-------|---------|
| **Auth** | Required |

**Response (200):**
```json
{
  "id": "uuid-v4",
  "email": "user@example.com",
  "username": "johndoe",
  "avatarColor": "#6366F1",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

---

### PUT `/api/auth/profile`

Update user profile.

| Field | Details |
|-------|---------|
| **Auth** | Required |

**Request Body:**
```json
{
  "username": "newname",
  "avatarColor": "#EF4444"
}
```

**Response (200):**
```json
{
  "id": "uuid-v4",
  "email": "user@example.com",
  "username": "newname",
  "avatarColor": "#EF4444"
}
```

---

## 2. Project Endpoints

### POST `/api/projects`

Create a new project.

| Field | Details |
|-------|---------|
| **Auth** | Required |

**Request Body:**
```json
{
  "name": "My Python App",
  "language": "python",
  "description": "A collaborative Python project",
  "template": "python-flask"
}
```

**Valid `language` values:** `python`, `javascript`, `typescript`, `go`, `rust`, `java`, `c`, `cpp`

**Valid `template` values:** `null` (blank), `python-flask`, `python-fastapi`, `node-express`, `react-app`, `go-gin`, `rust-actix`, `java-spring`, `c-project`, `cpp-project`

**Response (201):**
```json
{
  "id": "uuid-v4",
  "name": "My Python App",
  "language": "python",
  "template": "python-flask",
  "description": "A collaborative Python project",
  "inviteCode": "abc123xyz",
  "ownerId": "user-uuid",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

---

### GET `/api/projects`

List all projects the current user owns or is a member of.

| Field | Details |
|-------|---------|
| **Auth** | Required |
| **Query** | `?page=1&limit=20` |

**Response (200):**
```json
{
  "projects": [
    {
      "id": "uuid-v4",
      "name": "My Python App",
      "language": "python",
      "description": "A collaborative Python project",
      "role": "owner",
      "memberCount": 3,
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-16T14:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

---

### GET `/api/projects/:id`

Get project details.

| Field | Details |
|-------|---------|
| **Auth** | Required (must be member) |

**Response (200):**
```json
{
  "id": "uuid-v4",
  "name": "My Python App",
  "language": "python",
  "template": "python-flask",
  "description": "A collaborative Python project",
  "inviteCode": "abc123xyz",
  "owner": {
    "id": "user-uuid",
    "username": "johndoe",
    "avatarColor": "#6366F1"
  },
  "members": [
    {
      "id": "user-uuid",
      "username": "johndoe",
      "avatarColor": "#6366F1",
      "role": "owner",
      "joinedAt": "2025-01-15T10:30:00Z"
    },
    {
      "id": "user-uuid-2",
      "username": "janedoe",
      "avatarColor": "#EF4444",
      "role": "editor",
      "joinedAt": "2025-01-15T11:00:00Z"
    }
  ],
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-16T14:00:00Z"
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 403 | Not a member of this project |
| 404 | Project not found |

---

### PUT `/api/projects/:id`

Update project details.

| Field | Details |
|-------|---------|
| **Auth** | Required (owner only) |

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Response (200):** Updated project object.

---

### DELETE `/api/projects/:id`

Delete a project and all its files.

| Field | Details |
|-------|---------|
| **Auth** | Required (owner only) |

**Response (204):** No content.

---

### POST `/api/projects/:id/invite`

Generate or regenerate the invite code.

| Field | Details |
|-------|---------|
| **Auth** | Required (owner only) |

**Response (200):**
```json
{
  "inviteCode": "new-abc123xyz",
  "inviteUrl": "http://localhost:5173/join/new-abc123xyz"
}
```

---

### POST `/api/projects/join/:inviteCode`

Join a project via invite code.

| Field | Details |
|-------|---------|
| **Auth** | Required |

**Response (200):**
```json
{
  "projectId": "uuid-v4",
  "role": "editor",
  "message": "Successfully joined project"
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 404 | Invalid invite code |
| 409 | Already a member |

---

### DELETE `/api/projects/:id/members/:userId`

Remove a member from the project.

| Field | Details |
|-------|---------|
| **Auth** | Required (owner only, cannot remove self) |

**Response (204):** No content.

---

## 3. File Endpoints

### GET `/api/projects/:id/files`

Get the file tree for a project.

| Field | Details |
|-------|---------|
| **Auth** | Required (must be member) |

**Response (200):**
```json
{
  "tree": [
    {
      "name": "src",
      "path": "src",
      "type": "directory",
      "children": [
        {
          "name": "main.py",
          "path": "src/main.py",
          "type": "file",
          "size": 1234
        },
        {
          "name": "utils.py",
          "path": "src/utils.py",
          "type": "file",
          "size": 567
        }
      ]
    },
    {
      "name": "README.md",
      "path": "README.md",
      "type": "file",
      "size": 890
    }
  ]
}
```

---

### GET `/api/projects/:id/files/:path`

Get the content of a specific file.

| Field | Details |
|-------|---------|
| **Auth** | Required (must be member) |
| **Params** | `:path` — URL-encoded relative file path |

**Response (200):**
```json
{
  "path": "src/main.py",
  "content": "from flask import Flask\n\napp = Flask(__name__)\n...",
  "language": "python",
  "size": 1234,
  "updatedAt": "2025-01-16T14:00:00Z"
}
```

---

### POST `/api/projects/:id/files`

Create a new file or directory.

| Field | Details |
|-------|---------|
| **Auth** | Required (must be member) |

**Request Body:**
```json
{
  "path": "src/models/user.py",
  "type": "file",
  "content": "# User model\n"
}
```

For directories:
```json
{
  "path": "src/models",
  "type": "directory"
}
```

**Response (201):**
```json
{
  "id": "uuid-v4",
  "path": "src/models/user.py",
  "type": "file",
  "size": 14,
  "createdAt": "2025-01-16T14:00:00Z"
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 409 | File already exists at this path |

---

### PUT `/api/projects/:id/files/:path`

Update file content (used for saving, not real-time sync).

| Field | Details |
|-------|---------|
| **Auth** | Required (must be member) |

**Request Body:**
```json
{
  "content": "updated file content..."
}
```

**Response (200):**
```json
{
  "path": "src/main.py",
  "size": 2345,
  "updatedAt": "2025-01-16T15:00:00Z"
}
```

---

### PUT `/api/projects/:id/files/:path/rename`

Rename or move a file/directory.

| Field | Details |
|-------|---------|
| **Auth** | Required (must be member) |

**Request Body:**
```json
{
  "newPath": "src/app.py"
}
```

**Response (200):**
```json
{
  "oldPath": "src/main.py",
  "newPath": "src/app.py"
}
```

---

### DELETE `/api/projects/:id/files/:path`

Delete a file or directory (recursive for directories).

| Field | Details |
|-------|---------|
| **Auth** | Required (must be member) |

**Response (204):** No content.

---

### GET `/api/projects/:id/download`

Download the entire project as a ZIP file.

| Field | Details |
|-------|---------|
| **Auth** | Required (must be member) |

**Response:** Binary ZIP file with `Content-Disposition: attachment; filename="project-name.zip"`

---

## 4. Template Endpoints

### GET `/api/templates`

List all available project templates.

| Field | Details |
|-------|---------|
| **Auth** | None |

**Response (200):**
```json
{
  "templates": [
    {
      "id": "python-flask",
      "name": "Python Flask API",
      "language": "python",
      "description": "REST API with Flask, including routes and error handling",
      "files": ["app.py", "requirements.txt", "README.md"],
      "runCommand": "python app.py",
      "icon": "🐍"
    },
    {
      "id": "python-fastapi",
      "name": "Python FastAPI",
      "language": "python",
      "description": "Modern async API with FastAPI and Uvicorn",
      "files": ["main.py", "requirements.txt", "README.md"],
      "runCommand": "uvicorn main:app --reload",
      "icon": "⚡"
    },
    {
      "id": "node-express",
      "name": "Node.js Express API",
      "language": "javascript",
      "description": "Express REST API with middleware and routing",
      "files": ["index.js", "package.json", "README.md"],
      "runCommand": "node index.js",
      "icon": "🟢"
    },
    {
      "id": "react-app",
      "name": "React Application",
      "language": "javascript",
      "description": "React app with Vite, components, and routing",
      "files": ["src/App.jsx", "src/main.jsx", "index.html", "package.json", "vite.config.js"],
      "runCommand": "npm run dev",
      "icon": "⚛️"
    },
    {
      "id": "go-gin",
      "name": "Go Gin API",
      "language": "go",
      "description": "REST API with Gin framework",
      "files": ["main.go", "go.mod", "README.md"],
      "runCommand": "go run main.go",
      "icon": "🐹"
    },
    {
      "id": "rust-actix",
      "name": "Rust Actix Web",
      "language": "rust",
      "description": "Web server with Actix-web framework",
      "files": ["src/main.rs", "Cargo.toml", "README.md"],
      "runCommand": "cargo run",
      "icon": "🦀"
    },
    {
      "id": "java-spring",
      "name": "Java Spring Boot",
      "language": "java",
      "description": "Spring Boot REST API",
      "files": ["src/Main.java", "pom.xml", "README.md"],
      "runCommand": "javac src/Main.java && java -cp src Main",
      "icon": "☕"
    },
    {
      "id": "c-project",
      "name": "C Project",
      "language": "c",
      "description": "C project with Makefile and header files",
      "files": ["src/main.c", "include/main.h", "Makefile", "README.md"],
      "runCommand": "make && ./build/main",
      "icon": "🔧"
    },
    {
      "id": "cpp-project",
      "name": "C++ Project",
      "language": "cpp",
      "description": "C++ project with CMake build system",
      "files": ["src/main.cpp", "include/main.hpp", "CMakeLists.txt", "README.md"],
      "runCommand": "mkdir -p build && cd build && cmake .. && make && ./main",
      "icon": "⚙️"
    }
  ]
}
```

---

## 5. Chat Endpoints

### GET `/api/projects/:id/chat`

Get chat history for a project.

| Field | Details |
|-------|---------|
| **Auth** | Required (must be member) |
| **Query** | `?limit=50&before=<messageId>` |

**Response (200):**
```json
{
  "messages": [
    {
      "id": "uuid-v4",
      "user": {
        "id": "user-uuid",
        "username": "johndoe",
        "avatarColor": "#6366F1"
      },
      "message": "Hey, check out the function on line 42",
      "codeRef": {
        "file": "src/main.py",
        "line": 42
      },
      "createdAt": "2025-01-16T14:30:00Z"
    }
  ],
  "hasMore": false
}
```

---

## 6. Edit History Endpoints

### GET `/api/projects/:id/history`

Get edit event history for a project.

| Field | Details |
|-------|---------|
| **Auth** | Required (must be member) |
| **Query** | `?file=src/main.py&limit=100&since=<ISO-timestamp>` |

**Response (200):**
```json
{
  "events": [
    {
      "id": "uuid-v4",
      "user": {
        "id": "user-uuid",
        "username": "johndoe",
        "avatarColor": "#6366F1"
      },
      "filePath": "src/main.py",
      "eventType": "insert",
      "line": 10,
      "column": 5,
      "content": "print('hello')",
      "length": 14,
      "createdAt": "2025-01-16T14:30:00Z"
    }
  ],
  "total": 1
}
```

---

## 7. AI Review Endpoints

### GET `/api/projects/:id/reviews`

Get saved AI reviews for a project.

| Field | Details |
|-------|---------|
| **Auth** | Required (must be member) |
| **Query** | `?file=src/main.py` |

**Response (200):**
```json
{
  "reviews": [
    {
      "id": "uuid-v4",
      "user": {
        "id": "user-uuid",
        "username": "johndoe"
      },
      "filePath": "src/main.py",
      "provider": "openai",
      "comments": [
        {
          "line": 15,
          "severity": "warning",
          "message": "This function has no error handling. Consider wrapping in try/except.",
          "suggestion": "try:\n    result = process(data)\nexcept Exception as e:\n    logger.error(f'Processing failed: {e}')\n    raise"
        },
        {
          "line": 28,
          "severity": "info",
          "message": "Consider using a list comprehension here for better readability.",
          "suggestion": "items = [transform(x) for x in data if x.is_valid()]"
        }
      ],
      "createdAt": "2025-01-16T14:30:00Z"
    }
  ]
}
```

---

### POST `/api/projects/:id/reviews`

Save an AI review result (called by client after AI response).

| Field | Details |
|-------|---------|
| **Auth** | Required (must be member) |

**Request Body:**
```json
{
  "filePath": "src/main.py",
  "provider": "openai",
  "comments": [
    {
      "line": 15,
      "severity": "warning",
      "message": "No error handling",
      "suggestion": "Add try/except"
    }
  ]
}
```

**Response (201):** Saved review object.

---

## 8. WebSocket Events Reference

### Connection

```javascript
// Client connects with auth token
const socket = io('http://localhost:3001', {
  auth: { token: accessToken },
  query: { projectId: 'uuid-v4' }
});
```

### Collaboration Namespace (`/collab`)

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `yjs:sync` | Bidirectional | `Uint8Array` | Yjs sync protocol messages |
| `awareness:update` | Bidirectional | `Uint8Array` | Yjs awareness updates (cursors, selections) |
| `file:open` | Client → Server | `{ filePath: string }` | User opened a file |
| `file:close` | Client → Server | `{ filePath: string }` | User closed a file tab |
| `presence:users` | Server → Client | `User[]` | Current online users in project |
| `presence:join` | Server → Client | `User` | A user joined the project |
| `presence:leave` | Server → Client | `{ userId: string }` | A user left the project |
| `merge:event` | Server → Client | `EditEvent` | An edit event for merge visualization |

### Terminal Namespace (`/terminal`)

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `terminal:create` | Client → Server | `{ cols: number, rows: number }` | Create new terminal |
| `terminal:created` | Server → Client | `{ terminalId: string }` | Terminal created confirmation |
| `terminal:input` | Client → Server | `{ terminalId: string, data: string }` | User typed in terminal |
| `terminal:output` | Server → Client | `{ terminalId: string, data: string }` | Terminal output data |
| `terminal:resize` | Client → Server | `{ terminalId: string, cols: number, rows: number }` | Terminal resized |
| `terminal:exit` | Server → Client | `{ terminalId: string, code: number }` | Terminal process exited |
| `terminal:kill` | Client → Server | `{ terminalId: string }` | Kill a terminal |

### Chat Namespace (`/chat`)

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `chat:message` | Bidirectional | `{ message: string, codeRef?: CodeRef }` | Send/receive chat message |
| `chat:typing` | Client → Server | `{ userId: string }` | User is typing indicator |
| `chat:typing:stop` | Client → Server | `{ userId: string }` | User stopped typing |

### LSP Namespace (`/lsp`)

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `lsp:request` | Client → Server | `{ id: number, method: string, params: any }` | LSP JSON-RPC request |
| `lsp:response` | Server → Client | `{ id: number, result?: any, error?: any }` | LSP JSON-RPC response |
| `lsp:notification` | Bidirectional | `{ method: string, params: any }` | LSP notification (diagnostics, etc.) |

---

## Error Response Format

All API errors follow this structure:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error message",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |
| `FORBIDDEN` | 403 | Not allowed to perform this action |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
