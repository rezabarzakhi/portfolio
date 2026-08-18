#!/usr/bin/env sh
set -eu

if [ "$#" -ne 2 ]; then
  echo "Usage: deploy/restore.sh DATABASE_DUMP UPLOADS_ARCHIVE"
  exit 1
fi

docker compose exec -T database pg_restore -U portfolio -d portfolio --clean --if-exists < "$1"
tar -xzf "$2"
docker compose restart app nginx
