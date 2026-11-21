#!/bin/bash
set -euo pipefail

REPO_DIR=/home/ssm-user/collaborative-whiteboard
APP_DIR=$REPO_DIR/server
APP_USER=ssm-user
export HOME=/home/$APP_USER

: "${SHA:?SHA is required}"

runuser -u "$APP_USER" -- git -C "$REPO_DIR" fetch origin
runuser -u "$APP_USER" -- git -C "$REPO_DIR" reset --hard "$SHA"

runuser -u "$APP_USER" -- bash -lc "
  cd '$APP_DIR' &&
  npm ci &&
  npm run build
"

runuser -u "$APP_USER" -- bash -lc "
  cd '$APP_DIR' &&
  npx prisma migrate deploy --config prisma7.config.ts
"

systemctl restart hocuspocus
sleep 3
if ! systemctl is-active --quiet hocuspocus; then
  journalctl -u hocuspocus -n 50 --no-pager
  exit 1
fi
ss -ltn | grep -q ':1234 ' || { echo "Порт 1234 не слушается"; journalctl -u hocuspocus -n 50 --no-pager; exit 1; }
echo "Deploy $SHA OK"