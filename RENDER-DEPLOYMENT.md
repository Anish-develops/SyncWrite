# Deploying SyncWrite to Render 🚀

This guide walks you through deploying **SyncWrite** to [Render](https://render.com) in just a few clicks.

SyncWrite is configured as a single unified service: Express serves the REST API, Socket.IO WebSockets (`/collab`, `/terminal`, `/chat`), and the built React SPA frontend on a single port with automatic HTTPS.

---

## Prerequisites
1. A [GitHub](https://github.com) account.
2. A free [Render](https://dashboard.render.com) account.
3. Git installed on your computer.

---

## Step 1: Push Your Code to GitHub

Open PowerShell or terminal in the project directory (`e:\syncWrite`) and run:

```bash
# 1. Stage all files
git add .

# 2. Create the initial commit
git commit -m "feat: complete SyncWrite collaborative IDE with Render deployment"

# 3. Create a new repository on GitHub (https://github.com/new) named "syncwrite"
# Then link and push:
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/syncwrite.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy on Render

### Option A: 1-Click Blueprint Deploy (Recommended)

1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** in the top navigation and select **Blueprint**.
3. Connect your GitHub account and select your `syncwrite` repository.
4. Render will automatically detect `render.yaml` in the root of the project:
   - **Service Name**: `syncwrite`
   - **Runtime**: `Node 22.14.0`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**: Automatically configures `NODE_ENV=production` and generates high-entropy `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.
5. Click **Apply**. Render will start building and deploying your project!

---

### Option B: Manual Web Service Setup

If you prefer to configure the Web Service manually:

1. In [Render Dashboard](https://dashboard.render.com), click **New +** -> **Web Service**.
2. Select your `syncwrite` repository.
3. Configure the settings:
   - **Name**: `syncwrite`
   - **Region**: Choose the closest region to you (e.g. *Oregon*, *Frankfurt*, or *Singapore*).
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free` (or `Starter` for no inactivity spin-downs)
4. Under **Advanced** -> **Add Environment Variable**, add:

| Key | Value | Description |
|---|---|---|
| `NODE_VERSION` | `22.14.0` | Node.js version with native SQLite support |
| `NODE_ENV` | `production` | Production mode |
| `JWT_ACCESS_SECRET` | *(Click "Generate" or paste random 32+ char string)* | Access token signing key |
| `JWT_REFRESH_SECRET` | *(Click "Generate" or paste random 32+ char string)* | Refresh token signing key |
| `JWT_ACCESS_EXPIRY` | `1h` | Access token lifespan |
| `JWT_REFRESH_EXPIRY` | `7d` | Refresh token lifespan |

5. Click **Create Web Service**.

---

## Step 3: Verification & Access

1. Render will spend ~2-3 minutes building the monorepo (`shared` -> `client` -> `server`).
2. When the build finishes, your service status will turn **Live** with a green checkmark.
3. Your live URL will look like:
   ```
   https://syncwrite-xxxx.onrender.com
   ```
4. Click your Render URL:
   - **Landing Page**: View the industrial workshop design system, features, and starter templates.
   - **Sign Up / Login**: Register an account (the SQLite database and migrations initialize automatically).
   - **Create a Project**: Select any of the 9 starter templates (e.g. *React + Vite*, *Node.js Express*, *Python Flask*).
   - **Real-Time Collaboration**: Open two different browser tabs or share the URL with a teammate to see real-time cursor awareness, Monaco editor edits, chat with code snippets, and in-browser terminal!

---

## Note on Persistent Storage (Free vs Starter Plan)

- **Render Free Plan**: Render's free web services run on ephemeral disks. If the service spins down after 15 minutes of inactivity, any newly created files in `data/` and `projects/` reset on the next wake-up.
- **Render Starter Plan ($7/mo)**: If you want persistent projects and accounts permanently across restarts, you can add a **Disk** to your service:
  1. Go to your service's **Disks** tab -> **Add Disk**.
  2. Set Name: `syncwrite-data`, Mount Path: `/var/data`, Size: `1 GB`.
  3. Add environment variables:
     - `DATA_DIR=/var/data`
     - `PROJECTS_DIR=/var/data/projects`
  4. Click **Save Changes**. Your database and all user project code will persist forever.
