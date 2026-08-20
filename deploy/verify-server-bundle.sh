#!/usr/bin/env sh
set -eu

project_dir="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
archive="${1:-$project_dir/release/portfolio-server-amd64.tar}"
test_dir="${TMPDIR:-/tmp}/portfolio-bundle-test"
compose="docker compose -p portfolio-bundle-test -f docker-compose.production.yml"
network_created=0

cleanup() {
  if [ -d "$test_dir/portfolio-server-amd64" ]; then
    cd "$test_dir/portfolio-server-amd64"
    $compose down --volumes --remove-orphans >/dev/null 2>&1 || true
  fi
  if [ "$network_created" -eq 1 ]; then
    docker network rm proxy >/dev/null 2>&1 || true
  fi
  rm -rf "$test_dir"
}

trap cleanup EXIT
cleanup
mkdir -p "$test_dir"
if ! docker network inspect proxy >/dev/null 2>&1; then
  docker network create proxy >/dev/null
  network_created=1
fi
tar -xf "$archive" -C "$test_dir"
cd "$test_dir/portfolio-server-amd64"

COMPOSE_PROJECT_NAME=portfolio-bundle-test sh deploy/install-server.sh
$compose exec -T app wget -q --spider http://localhost:3000/fa
user_count="$($compose exec -T database psql -U portfolio -d portfolio -Atc 'SELECT COUNT(*) FROM "User";')"

if [ "$user_count" -lt 1 ]; then
  echo "The restored database does not contain an administrator."
  exit 1
fi

echo "Server bundle verification passed."
