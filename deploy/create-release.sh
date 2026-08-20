#!/usr/bin/env sh
set -eu

project_dir="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$project_dir"

release_dir="$project_dir/release/portfolio-server-amd64"
image="rezabarzakhi-portfolio:latest"
source_compose="docker compose -f docker-compose.yml"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required to create the release bundle."
  exit 1
fi

rm -rf "$release_dir"
mkdir -p "$release_dir/deploy" "$release_dir/data/initial" "$release_dir/data/uploads"

docker build --network host --platform linux/amd64 -t "$image" .
docker pull --platform linux/amd64 postgres:17-alpine

docker save "$image" postgres:17-alpine | gzip -1 > "$release_dir/images.tar.gz"

cp docker-compose.production.yml "$release_dir/"
cp deploy/Caddyfile deploy/install-server.sh "$release_dir/deploy/"
cp deploy/SERVER.md "$release_dir/"
cp .env.example "$release_dir/.env.example"
touch "$release_dir/data/uploads/.gitkeep"

if [ "${INCLUDE_RUNTIME_DATA:-0}" = "1" ]; then
  if [ ! -f .env ]; then
    echo "Cannot include runtime data because .env is missing."
    exit 1
  fi

  echo "Including the private environment, database, and uploaded files..."
  cp .env "$release_dir/.env"
  chmod 600 "$release_dir/.env"
  $source_compose exec -T database pg_dump -U portfolio -d portfolio -Fc \
    > "$release_dir/data/initial/database.dump"
  $source_compose cp app:/app/public/uploads/. "$release_dir/data/uploads"
fi

tar -cf "$project_dir/release/portfolio-server-amd64.tar" \
  -C "$project_dir/release" portfolio-server-amd64
sha256sum "$project_dir/release/portfolio-server-amd64.tar" \
  > "$project_dir/release/portfolio-server-amd64.tar.sha256"

echo "Release created at: $project_dir/release/portfolio-server-amd64.tar"
