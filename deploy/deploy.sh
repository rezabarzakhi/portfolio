#!/usr/bin/env sh
set -eu

if [ ! -f .env ]; then
  echo ".env is missing. Copy .env.example and configure production values first."
  exit 1
fi

mkdir -p data/uploads data/backups
docker compose config --quiet
docker compose build app
docker compose up -d
docker compose ps --all
