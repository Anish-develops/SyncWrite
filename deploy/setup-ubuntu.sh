#!/bin/bash
set -e

# ==========================================
# SyncWrite Automated Ubuntu VPS Setup Script
# Run as root: sudo bash deploy/setup-ubuntu.sh
# ==========================================

echo "==> 1. Updating apt and installing core utilities..."
apt update && apt upgrade -y
apt install -y curl git build-essential ufw tmux nginx sqlite3

echo "==> 2. Installing Node.js 20 LTS..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

echo "==> 3. Installing language runtimes (Python, C/C++, Java)..."
apt install -y python3 python3-pip python3-venv gcc g++ make cmake openjdk-17-jdk

echo "==> 4. Installing PM2 process manager..."
npm install -g pm2

echo "==> 5. Configuring UFW Firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo ""
echo "=========================================="
echo "✅ Server setup complete!"
echo "Next steps:"
echo " 1. cd /path/to/syncwrite"
echo " 2. cp .env.production.example .env && nano .env"
echo " 3. npm install && npm run build"
echo " 4. pm2 start ecosystem.config.cjs && pm2 save"
echo " 5. Configure Nginx with WebSocket proxy (see DEPLOYMENT.md)"
echo "=========================================="
