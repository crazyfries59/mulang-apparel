#!/usr/bin/env bash
# One-shot deploy script for the techpack-translate feature on a fresh
# Linux server. Run this FROM the project directory after cloning/pulling
# the repo (git pull origin main).
#
# Usage:
#   ./deploy.sh
#
# No font setup needed -- assets/fonts/NotoSansSC-Variable.ttf ships in the
# repo (SIL Open Font License, see assets/fonts/OFL.txt) and is used
# automatically. Set TECHPACK_FONT only if you want to override it with a
# different font.

set -euo pipefail

echo "==> Node version: $(node -v)"

if ! node -e "require('canvas')" 2>/dev/null; then
  echo "==> 'canvas' native module needs build tools -- installing (requires sudo)..."
  if command -v apt-get >/dev/null; then
    sudo apt-get update
    sudo apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
  else
    echo "WARNING: not a Debian/Ubuntu system -- install cairo/pango/jpeg/gif/rsvg dev headers manually, then re-run."
  fi
fi

echo "==> Installing dependencies..."
npm install

echo "==> Building..."
npm run build

if ! command -v pm2 >/dev/null; then
  echo "==> Installing pm2..."
  npm install -g pm2
fi

echo "==> Starting/restarting with pm2..."
if pm2 describe mulang-apparel >/dev/null 2>&1; then
  pm2 restart mulang-apparel
else
  pm2 start npm --name mulang-apparel -- start
fi
pm2 save

echo ""
echo "==> Done. App should be running on port 3000 (pm2 status / pm2 logs mulang-apparel to check)."
echo "==> Remaining manual steps (see DEPLOY.md): nginx reverse proxy + HTTPS, and raising client_max_body_size for PDF uploads."
