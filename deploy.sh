#!/bin/bash
set -e

# =============================================================
# Pyra Wood — Deploy (No Nginx, Docker only)
# Frontend :8080, Backend API :8081
# Run from repo directory: bash deploy.sh
# =============================================================

SERVER_IP="129.212.133.64"
APP_DIR="$(pwd)"

echo "========================================="
echo "  Pyra Wood — Docker Deploy"
echo "  Frontend: http://$SERVER_IP:8080"
echo "  API:      http://$SERVER_IP:8081/api"
echo "========================================="

# --- Install Docker if missing ---
if ! command -v docker &>/dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com | sh
fi

# --- Open ports ---
echo "Opening ports 8080, 8081..."
ufw allow 8080/tcp 2>/dev/null || true
ufw allow 8081/tcp 2>/dev/null || true

# --- Setup env ---
if [ ! -f "$APP_DIR/.env" ]; then
    cp "$APP_DIR/.env.production" "$APP_DIR/.env"
    echo "Created .env from .env.production"
else
    echo ".env already exists, skipping."
fi

# --- Build & Start ---
echo ""
echo "Building and starting containers (this takes a few minutes)..."
cd "$APP_DIR"
docker compose down 2>/dev/null || true
docker compose up -d --build

# --- Wait ---
echo ""
echo "Waiting for services..."
sleep 20

# --- Health check ---
echo ""
if curl -sf http://127.0.0.1:8081/health > /dev/null 2>&1; then
    echo "Backend:  OK"
else
    echo "Backend:  STARTING... (run: docker compose logs -f backend)"
fi

if curl -sf http://127.0.0.1:8080 > /dev/null 2>&1; then
    echo "Frontend: OK"
else
    echo "Frontend: STARTING... (run: docker compose logs -f frontend)"
fi

echo ""
echo "========================================="
echo "  DONE!"
echo "========================================="
echo "  Site:     http://$SERVER_IP:8080"
echo "  API:      http://$SERVER_IP:8081/api/health"
echo "  Admin:    admin@pyrawood.com / admin123"
echo ""
echo "  docker compose logs -f    # logs"
echo "  docker compose restart    # restart"
echo "========================================="
