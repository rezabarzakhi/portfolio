#!/usr/bin/env sh
set -eu

project_dir="$(cd "$(dirname "$0")/.." && pwd)"
cd "$project_dir"

backup_dir="data/backups"
lock_file="/tmp/portfolio-backup.lock"
retain=7

mkdir -p "$backup_dir"

exec 200>"$lock_file"
if ! flock -n 200; then
  echo "Another backup is already running."
  exit 0
fi

timestamp="$(date +%Y%m%d-%H%M%S)"
db_dump="$backup_dir/database-${timestamp}.dump"
uploads_tar="$backup_dir/uploads-${timestamp}.tar.gz"
ok=true

cleanup() {
  if [ "$ok" = false ]; then
    rm -f "$db_dump" "$uploads_tar"
    echo "Backup failed; partial files removed."
  fi
}
trap cleanup EXIT

echo "Backing up database..."
if ! docker compose exec -T database pg_dump -U portfolio -d portfolio -Fc > "$db_dump"; then
  ok=false
  exit 1
fi

echo "Backing up uploads..."
if ! tar -czf "$uploads_tar" data/uploads; then
  ok=false
  exit 1
fi

echo "Pruning old backups (keeping $retain)..."
db_dumps="$(ls -1t "$backup_dir"/database-*.dump 2>/dev/null || true)"
uploads_tars="$(ls -1t "$backup_dir"/uploads-*.tar.gz 2>/dev/null || true)"

i=0
for f in $db_dumps; do
  i=$((i + 1))
  if [ "$i" -gt "$retain" ]; then
    rm -f "$f"
  fi
done

i=0
for f in $uploads_tars; do
  i=$((i + 1))
  if [ "$i" -gt "$retain" ]; then
    rm -f "$f"
  fi
done

echo "Backup completed: $timestamp"
