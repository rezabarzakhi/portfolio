#!/usr/bin/env sh
set -eu

project_dir="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$project_dir"

compose="docker compose -f docker-compose.production.yml"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required. Install Docker Engine and the Compose plugin first."
  exit 1
fi

proxy_network="${PROXY_NETWORK:-proxy}"
if ! docker network inspect "$proxy_network" >/dev/null 2>&1; then
  echo "The external Docker network '$proxy_network' does not exist."
  exit 1
fi

if [ ! -f .env ]; then
  echo ".env is missing. Configure production values before installation."
  exit 1
fi

chmod 600 .env
mkdir -p data/uploads data/initial

if [ -f images.tar.gz ]; then
  echo "Loading bundled container images..."
  gzip -dc images.tar.gz | docker load
fi

$compose config --quiet
$compose up -d database

echo "Waiting for PostgreSQL..."
attempt=0
until $compose exec -T database pg_isready -U portfolio -d portfolio >/dev/null 2>&1; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 60 ]; then
    echo "PostgreSQL did not become ready within 120 seconds."
    $compose logs database
    exit 1
  fi
  sleep 2
done

$compose run --rm initialize

if [ ! -f data/.initialized ]; then
  if [ -f data/initial/database.dump ]; then
    echo "Restoring the bundled database..."
    $compose exec -T database pg_restore \
      -U portfolio \
      -d portfolio \
      --clean \
      --if-exists \
      --no-owner \
      < data/initial/database.dump
    $compose run --rm initialize
  else
    echo "Creating the initial website content and administrator..."
    $compose run --rm initialize npm run db:seed
  fi
  touch data/.initialized
fi

$compose up -d app
$compose ps --all

echo "Installation completed. The app is available as portfolio-nextjs:3000 on '$proxy_network'."
