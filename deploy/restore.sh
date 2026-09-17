#!/usr/bin/env sh
set -eu

if [ "$#" -ne 2 ]; then
  echo "Usage: deploy/restore.sh DATABASE_DUMP UPLOADS_ARCHIVE"
  exit 1
fi

if [ ! -f "$1" ]; then
  echo "Database dump not found: $1"
  exit 1
fi

if [ ! -f "$2" ]; then
  echo "Uploads archive not found: $2"
  exit 1
fi

echo "Restoring database..."
pg_restore -U portfolio -d portfolio --clean --if-exists < "$1"

echo "Restoring uploads..."
tar -xzf "$2"

echo "Restarting services..."
docker compose restart app

echo "Restore completed."
