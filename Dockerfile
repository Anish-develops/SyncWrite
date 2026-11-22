FROM node:22.14.0-bookworm-slim

# Install system dependencies and compiler runtimes
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    gcc \
    g++ \
    make \
    cmake \
    git \
    tmux \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy root and workspace manifests
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies across all workspaces
RUN npm install

# Copy application source code
COPY shared/ ./shared/
COPY server/ ./server/
COPY client/ ./client/
COPY tsconfig.base.json ./

# Build all packages (shared -> client -> server)
RUN npm run build

# Create persistence directories
RUN mkdir -p data projects

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

CMD ["npm", "start"]
