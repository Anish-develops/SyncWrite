# 🚢 SyncWrite Deployment Guide & Production Plan

A complete production deployment guide for **SyncWrite** — covering system requirements, environment variables, server architecture, VPS deployment, Docker containerization, Nginx reverse proxy with WebSocket support, SSL configuration, and database backups.

---

## 📋 Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Hardware & OS Requirements](#2-hardware--os-requirements)
3. [Environment Variables Reference](#3-environment-variables-reference)
4. [Deployment Strategy Options](#4-deployment-strategy-options)
5. [Option A: Native VPS Deployment (Recommended)](#5-option-a-native-vps-deployment-recommended)
   - [Step 1: Provisioning & OS Setup](#step-1-provisioning--os-setup)
   - [Step 2: Install Language Runtimes & Tooling](#step-2-install-language-runtimes--tooling)
   - [Step 3: Clone, Configure & Build](#step-3-clone-configure--build)
   - [Step 4: Process Management with PM2](#step-4-process-management-with-pm2)
   - [Step 5: Nginx Configuration with WebSockets](#step-5-nginx-configuration-with-websockets)
   - [Step 6: SSL with Let's Encrypt / Certbot](#step-6-ssl-with-lets-encrypt--certbot)
6. [Option B: Docker & Docker Compose](#6-option-b-docker--docker-compose)
7. [Option C: PaaS Deployment (Railway / Render / Fly.io)](#7-option-c-paas-deployment)
8. [Persistence, Backups & Disaster Recovery](#8-persistence-backups--disaster-recovery)
9. [Production Health Checks & Troubleshooting](#9-production-health-checks--troubleshooting)

---

## 1. Architecture Overview

In production, SyncWrite operates as a **unified service**:
- The **Node.js Server** handles:
  1. Express REST API endpoints (`/api/*`).
  2. Socket.IO WebSocket namespaces (`/collab`, `/terminal`, `/chat`, `/lsp`).
  3. Real-time CRDT synchronization via Yjs.
  4. Pseudo-terminal process execution (tmux / PTY).
  5. SQLite database with WAL mode (`./data/syncwrite.db`).
  6. **Static File Serving**: Serves the pre-built React 18 single-page app from `client/dist`.

This means you only need to run **one persistent Node.js service** behind an Nginx reverse proxy.

```
       Internet / Browsers (HTTPS & WSS)
                      │
                      ▼
               [Nginx / Caddy]
         (SSL Termination, Port 80/443)
                      │
                      ▼
            [SyncWrite Server: 3001]
   ┌──────────────────┼──────────────────┐
   │                  │                  │
[Static React UI]  [REST API]   [Socket.IO WS Engine]
(client/dist)     (/api/*)      (/collab, /terminal, /chat)
                      │                  │
               [SQLite: WAL]     [PTY / Language Runtimes]
              (syncwrite.db)     (python, node, gcc, etc.)
```

---

## 2. Hardware & OS Requirements

### Recommended Server Specifications
| Resource | Minimum (1-5 Users) | Recommended (10-30 Users) | High Traffic |
|---|---|---|---|
| **OS** | Ubuntu 22.04 LTS / Debian 12 | Ubuntu 24.04 LTS / Debian 12 | Ubuntu 24.04 LTS |
| **CPU** | 2 vCPUs | 4 vCPUs | 8 vCPUs |
| **RAM** | 2 GB | 4 GB - 8 GB | 16 GB |
| **Storage** | 20 GB SSD | 40 GB NVMe SSD | 100 GB+ NVMe SSD |
| **Network** | 100 Mbps | 1 Gbps | 1 Gbps+ |

> [!TIP]
> SyncWrite runs comfortably on:
> - **Free Tier**: Oracle Cloud Always Free ARM instance (4 OCPU, 24GB RAM).
> - **VPS Providers**: Hetzner (€4-€7/mo), DigitalOcean ($12/mo), Linode, Vultr, or AWS EC2 `t3.medium` / `t4g.medium`.

---

## 3. Environment Variables Reference

Create a `.env` file in the project root (or export them in your systemd / Docker environment):

### Comprehensive Environment Variables Table

| Variable | Required | Default | Example | Description |
|---|---|---|---|---|
| `NODE_ENV` | Yes | `development` | `production` | Set to `production` for security headers, caching, and static asset serving. |
| `PORT` | No | `3001` | `3001` | Port the internal HTTP and WebSocket server listens on. |
| `CLIENT_URL` | Yes | `http://localhost:5173` | `https://syncwrite.yourdomain.com` | Public domain URL. Used for CORS policy and generating invite links. |
| `JWT_ACCESS_SECRET` | **YES** | *(insecure dev string)* | *(64-hex chars)* | Secret key for signing 1-hour access JWTs. |
| `JWT_REFRESH_SECRET`| **YES** | *(insecure dev string)* | *(64-hex chars)* | Secret key for signing 7-day refresh JWTs. Must differ from access secret. |
| `JWT_ACCESS_EXPIRY` | No | `1h` | `1h` | Access token lifespan. |
| `JWT_REFRESH_EXPIRY`| No | `7d` | `7d` | Refresh token lifespan. |
| `DATA_DIR` | No | `../data` | `/var/lib/syncwrite/data` | Absolute or relative path where SQLite `syncwrite.db` is stored. |
| `PROJECTS_DIR` | No | `../projects` | `/var/lib/syncwrite/projects` | Path where user files, code, and `.yjs` state vector caches are stored. |

### How to Generate Secure Cryptographic Secrets
Run this in your terminal to generate strong 256-bit secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Generate **two separate values**: one for `JWT_ACCESS_SECRET` and one for `JWT_REFRESH_SECRET`.

### What About AI API Keys?
> [!IMPORTANT]
> **AI Keys (OpenAI, Google Gemini, Anthropic) are NOT stored in the server `.env` file.**
> SyncWrite uses a **Bring-Your-Own-Key (BYOK)** model for maximum privacy and cost isolation:
> - Users enter their personal API keys in the IDE header (AI Settings dialog).
> - Keys are stored **only in the user's browser `localStorage`**.
> - Calls to OpenAI and Google Gemini are dispatched directly from the client browser.
> - Anthropic calls are forwarded through a zero-storage server proxy (`POST /api/ai/proxy/anthropic`) solely to satisfy CORS policies.

---

## 4. Deployment Strategy Options

| Strategy | Best For | Pros | Considerations |
|---|---|---|---|
| **Option A: Native VPS (PM2 + Nginx)** | Production, College Servers, Self-Hosting | Full access to real system compilers, lowest latency terminal PTYs, easy upgrades | Requires basic Linux sysadmin |
| **Option B: Docker Compose** | Reproducible multi-environment setup | Everything containerized in one command | Terminal PTY runs inside container |
| **Option C: PaaS (Railway/Render)** | Quick deployment without managing VMs | No server maintenance | Requires persistent volume mount for `./data` and `./projects` |

---

## 5. Option A: Native VPS Deployment (Recommended)

### Step 1: Provisioning & OS Setup
Connect to your Ubuntu server:
```bash
ssh root@your-server-ip
```

Update system packages and configure a firewall:
```bash
apt update && apt upgrade -y
apt install -y curl git build-essential ufw tmux nginx
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
```

### Step 2: Install Language Runtimes & Tooling
SyncWrite features terminal execution for 7 programming languages. Install the runtimes you want available to developers:

```bash
# 1. Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 2. Python 3 & pip
apt install -y python3 python3-pip python3-venv

# 3. GCC & G++ (C/C++ compilers and Make/CMake)
apt install -y gcc g++ make cmake

# 4. OpenJDK (Java 17)
apt install -y openjdk-17-jdk

# 5. Golang (Go 1.21+)
apt install -y golang-go

# 6. Rust & Cargo
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source $HOME/.cargo/env
```

Install PM2 globally for zero-downtime process management:
```bash
npm install -g pm2
```

### Step 3: Clone, Configure & Build
Create a dedicated user for security:
```bash
useradd -m -s /bin/bash syncwrite
su - syncwrite
```

Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/syncwrite.git /home/syncwrite/app
cd /home/syncwrite/app
npm install
```

Create your production configuration `.env`:
```bash
nano .env
```
Paste your production variables:
```ini
NODE_ENV=production
PORT=3001
CLIENT_URL=https://syncwrite.yourdomain.com

JWT_ACCESS_SECRET=your_generated_64_char_hex_secret_here
JWT_REFRESH_SECRET=your_generated_different_64_char_hex_secret_here
JWT_ACCESS_EXPIRY=1h
JWT_REFRESH_EXPIRY=7d

DATA_DIR=/home/syncwrite/app/data
PROJECTS_DIR=/home/syncwrite/app/projects
```

Build the entire project (shared library, React frontend, Express backend):
```bash
npm run build
```

Verify everything compiles cleanly and run the integration test:
```bash
npm test
```

### Step 4: Process Management with PM2
Start SyncWrite with PM2 using the included `ecosystem.config.cjs`:
```bash
pm2 start ecosystem.config.cjs
pm2 save
```

To configure PM2 to auto-start on server boot, run (as root):
```bash
exit # back to root
pm2 startup systemd -u syncwrite --hp /home/syncwrite
systemctl enable pm2-syncwrite
```

### Step 5: Nginx Configuration with WebSockets
Create an Nginx server block:
```bash
nano /etc/nginx/sites-available/syncwrite
```

Paste the following production configuration (replace `syncwrite.yourdomain.com` with your domain or server IP):

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
    listen 80;
    server_name syncwrite.yourdomain.com;

    client_max_body_size 50M;

    # Gzip compression for fast loading
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;

        # WebSocket support (Critical for /collab, /terminal, /chat)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Keep alive long-running terminal and editor sessions
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
```

Enable the site and reload Nginx:
```bash
ln -s /etc/nginx/sites-available/syncwrite /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

### Step 6: SSL with Let's Encrypt / Certbot
Enable automated HTTPS with Certbot:
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d syncwrite.yourdomain.com
```
Certbot will automatically install the certificate and configure HTTP-to-HTTPS redirect.

---

## 6. Option B: Docker & Docker Compose

If you prefer containerized deployment, SyncWrite includes a multi-stage `Dockerfile` and `docker-compose.yml`:

### Run with Docker Compose
```bash
# 1. Clone repo
git clone https://github.com/your-username/syncwrite.git
cd syncwrite

# 2. Copy production environment file
cp .env.production.example .env
nano .env # customize secrets and domain

# 3. Build & start containers
docker compose up -d --build

# 4. View logs
docker compose logs -f
```

The container persists the SQLite database and all user project files to host volumes `./data` and `./projects`.

---

## 7. Option C: PaaS Deployment

If deploying to **Railway**, **Render**, or **Fly.io**:
1. **Persistent Volume Requirement**:
   You **must** attach a persistent disk volume (e.g. `/data`) and set:
   - `DATA_DIR=/data/syncwrite`
   - `PROJECTS_DIR=/data/projects`
   Without a persistent disk, SQLite files and user projects will reset on container restart!
2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `npm start`
4. Set all environment variables (`NODE_ENV=production`, `PORT`, `CLIENT_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`) in your PaaS dashboard.

---

## 8. Persistence, Backups & Disaster Recovery

### What Needs to Be Backed Up?
SyncWrite stores state in two locations:
1. `DATA_DIR/syncwrite.db` (User accounts, project metadata, member roles, chat, reviews, edit event logs).
2. `PROJECTS_DIR/` (Actual source code files and `.yjs` binary state vectors).

### Automated SQLite Backup Script
SQLite WAL mode allows safe, online backups without stopping the server.

Create `/home/syncwrite/backup.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/home/syncwrite/backups/$(date +%Y-%m-%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# 1. Hot online backup of SQLite database
sqlite3 /home/syncwrite/app/data/syncwrite.db ".backup '$BACKUP_DIR/syncwrite.db'"

# 2. Backup user projects
tar -czf "$BACKUP_DIR/projects.tar.gz" -C /home/syncwrite/app projects/

# 3. Retain only last 7 days of backups
find /home/syncwrite/backups/ -maxdepth 1 -type d -mtime +7 -exec rm -rf {} +

echo "Backup complete: $BACKUP_DIR"
```

Make it executable and add to crontab:
```bash
chmod +x /home/syncwrite/backup.sh
crontab -e
# Run daily at 3:00 AM:
0 3 * * * /home/syncwrite/backup.sh >> /home/syncwrite/backup.log 2>&1
```

---

## 9. Production Health Checks & Troubleshooting

### Health Check Endpoints
- **Web App**: Open `https://syncwrite.yourdomain.com` (should display the Industrial Workshop Landing page).
- **REST API Check**: `GET https://syncwrite.yourdomain.com/api/templates` (should return JSON array of 9 templates).
- **WebSocket Verification**: Open browser DevTools Network tab -> Filter by `WS` -> Check for `/socket.io/?EIO=4&transport=websocket` connection with `101 Switching Protocols`.

### Useful Commands
```bash
# Monitor Node process CPU and RAM
pm2 status
pm2 logs syncwrite
pm2 restart syncwrite

# Check Nginx error logs
tail -f /var/log/nginx/error.log

# Check SQLite file size
ls -lh /home/syncwrite/app/data/
```
