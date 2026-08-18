#!/usr/bin/env sh
set -eu

mkdir -p data/backups
timestamp="$(date +%Y%m%d-%H%M%S)"
docker compose exec -T database pg_dump -U portfolio -d portfolio -Fc > "data/backups/database-${timestamp}.dump"
tar -czf "data/backups/uploads-${timestamp}.tar.gz" data/uploads
echo "Backup created: ${timestamp}"
