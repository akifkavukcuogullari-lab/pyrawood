#!/bin/bash
set -e

# =============================================================
# Pyra Wood — Deploy Script for Ubuntu Droplet
# Run as root from the repo directory: bash deploy.sh
# Runs on port 8080 to avoid conflicts with existing apps
# =============================================================

SERVER_IP="129.212.133.64"
PORT="8080"
APP_DIR="$(pwd)"

echo "========================================="
echo "  Pyra Wood — Server Deploy"
echo "  Target: $SERVER_IP:$PORT"
echo "  Directory: $APP_DIR"
echo "========================================="

# --- 1. System update ---
echo "[1/5] Updating system..."
apt update -y

# --- 2. Install Docker ---
echo "[2/5] Installing Docker..."
if ! command -v docker &>/dev/null; then
    curl -fsSL https://get.docker.com | sh
    echo "Docker installed."
else
    echo "Docker already installed."
fi

# --- 3. Install Nginx (if not already) ---
echo "[3/5] Installing Nginx..."
if ! command -v nginx &>/dev/null; then
    apt install -y nginx
    echo "Nginx installed."
else
    echo "Nginx already installed."
fi

# --- 4. Open port in firewall ---
echo "[4/5] Opening port $PORT..."
ufw allow $PORT/tcp 2>/dev/null || true

# --- 5. Configure env ---
echo "[5/5] Setting up environment..."
if [ ! -f "$APP_DIR/.env" ]; then
    cp "$APP_DIR/.env.production" "$APP_DIR/.env"
    echo "Created .env from .env.production"
else
    echo ".env already exists, skipping."
fi

# --- Configure Nginx ---
echo ""
echo "Configuring Nginx..."
cp "$APP_DIR/nginx/pyrawood.conf" /etc/nginx/sites-available/pyrawood
ln -sf /etc/nginx/sites-available/pyrawood /etc/nginx/sites-enabled/pyrawood
nginx -t && systemctl reload nginx
echo "Nginx configured on port $PORT."

# --- Build & Start ---
echo ""
echo "Building and starting Docker containers (this takes a few minutes)..."
cd "$APP_DIR"
docker compose up -d --build

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
    echo "  Backend:  STARTING... (run: docker compose logs backend)"
fi

if curl -sf http://127.0.0.1:3000 > /dev/null 2>&1; then
    echo "  Frontend: OK"
else
    echo "  Frontend: STARTING... (run: docker compose logs frontend)"
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
echo "  Commands (from $APP_DIR):"
echo "    docker compose logs -f        # View logs"
echo "    docker compose restart         # Restart"
echo "    docker compose up -d --build   # Rebuild"
echo ""
