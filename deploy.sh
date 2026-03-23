#!/bin/bash
set -e

# =============================================================
# Pyra Wood — Deploy Script for Ubuntu Droplet
# Run as root: bash deploy.sh
# Runs on port 8080 to avoid conflicts with existing apps
# =============================================================

SERVER_IP="129.212.133.64"
PORT="8080"
APP_DIR="/home/deploy/pyrawood"
REPO="https://github.com/akifkavukcuogullari-lab/pyrawood.git"

echo "========================================="
echo "  Pyra Wood — Server Deploy"
echo "  Target: $SERVER_IP:$PORT"
echo "========================================="

# --- 1. System update ---
echo "[1/7] Updating system..."
apt update -y

# --- 2. Create deploy user (skip if exists) ---
echo "[2/7] Setting up deploy user..."
if ! id "deploy" &>/dev/null; then
    adduser --disabled-password --gecos "" deploy
    usermod -aG sudo deploy
    echo "deploy ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/deploy
fi

# --- 3. Install Docker ---
echo "[3/7] Installing Docker..."
if ! command -v docker &>/dev/null; then
    curl -fsSL https://get.docker.com | sh
    usermod -aG docker deploy
fi

# --- 4. Install Nginx (if not already) ---
echo "[4/7] Installing Nginx..."
if ! command -v nginx &>/dev/null; then
    apt install -y nginx
fi

# --- 5. Open port in firewall ---
echo "[5/7] Opening port $PORT..."
ufw allow $PORT/tcp 2>/dev/null || true

# --- 6. Clone repo & configure ---
echo "[6/7] Cloning repository..."
su - deploy -c "
    if [ -d '$APP_DIR' ]; then
        cd $APP_DIR && git pull
    else
        git clone $REPO $APP_DIR
    fi
    cd $APP_DIR
    cp .env.production .env
"

# --- 7. Configure Nginx ---
echo "[7/7] Configuring Nginx..."
cp $APP_DIR/nginx/pyrawood.conf /etc/nginx/sites-available/pyrawood
ln -sf /etc/nginx/sites-available/pyrawood /etc/nginx/sites-enabled/pyrawood
nginx -t && systemctl reload nginx

# --- Build & Start ---
echo ""
echo "Building and starting Docker containers (this takes a few minutes)..."
su - deploy -c "
    cd $APP_DIR
    docker compose up -d --build
"

# --- Wait for services ---
echo ""
echo "Waiting for services to start..."
sleep 20

# --- Health check ---
echo ""
echo "Checking health..."
if curl -sf http://127.0.0.1:3001/health > /dev/null 2>&1; then
    echo "  Backend:  OK"
else
    echo "  Backend:  STARTING... (check: docker compose -f $APP_DIR/docker-compose.yml logs backend)"
fi

if curl -sf http://127.0.0.1:3000 > /dev/null 2>&1; then
    echo "  Frontend: OK"
else
    echo "  Frontend: STARTING... (check: docker compose -f $APP_DIR/docker-compose.yml logs frontend)"
fi

echo ""
echo "========================================="
echo "  DEPLOY COMPLETE!"
echo "========================================="
echo ""
echo "  Site:     http://$SERVER_IP:$PORT"
echo "  API:      http://$SERVER_IP:$PORT/api/health"
echo "  Admin:    admin@pyrawood.com / admin123"
echo "  Customer: customer@example.com / customer123"
echo ""
echo "  Commands (ssh as deploy user, then cd $APP_DIR):"
echo "    docker compose logs -f        # View logs"
echo "    docker compose restart         # Restart"
echo "    docker compose up -d --build   # Rebuild"
echo ""
