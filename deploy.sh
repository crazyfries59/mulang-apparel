#!/usr/bin/env bash
# One-shot deploy script for the techpack-translate feature on a fresh
# Linux server. Run this FROM the project directory after cloning/pulling
# the repo (git pull origin main).
#
# Usage:
#   TECHPACK_FONT=/opt/fonts/NotoSansSC-Regular.otf ./deploy.sh
#
# TECHPACK_FONT must point at a properly-licensed CJK font file you've
# placed on this server yourself (e.g. Google Noto Sans SC, SIL OFL
# license, free to self-host) -- see DEPLOY.md section 3 for why this
# repo doesn't ship one.

set -euo pipefail

if [ -z "${TECHPACK_FONT:-}" ]; then
  echo "ERROR: set TECHPACK_FONT to a CJK font file path first, e.g.:"
  echo "  TECHPACK_FONT=/opt/fonts/NotoSansSC-Regular.otf ./deploy.sh"
  exit 1
fi
if [ ! -f "$TECHPACK_FONT" ]; then
  echo "ERROR: TECHPACK_FONT points at a file that doesn't exist: $TECHPACK_FONT"
  exit 1
fi

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

echo "==> Writing TECHPACK_FONT into .env.production..."
grep -v '^TECHPACK_FONT=' .env.production 2>/dev/null > .env.production.tmp || true
echo "TECHPACK_FONT=$TECHPACK_FONT" >> .env.production.tmp
mv .env.production.tmp .env.production

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
