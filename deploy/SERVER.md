# Production server bundle

This bundle targets a Linux AMD64 server and contains all required container
images. The server only needs Docker Engine and the Docker Compose plugin.

## Before installation

1. Ensure the existing external Docker network named `proxy` is available.
2. Configure the existing reverse proxy using the bundled `deploy/Caddyfile`
   snippet after the application is installed.
3. Keep `.env` private. It contains the database, authentication, and admin
   credentials.

## Install

Upload and extract `portfolio-server-amd64.tar`, then run:

```bash
cd portfolio-server-amd64
chmod +x deploy/install-server.sh
sudo ./deploy/install-server.sh
```

The installer does not publish host ports or start another reverse proxy. The
application joins the existing `proxy` network with this address:

```text
portfolio-nextjs:3000
```

Merge `deploy/Caddyfile` into the existing Caddy configuration, validate it,
and reload the existing proxy. The included snippet uses Caddy's internal TLS
issuer for an ArvanCloud HTTPS origin.

## Operations

```bash
# Status
sudo docker compose -f docker-compose.production.yml ps

# Logs
sudo docker compose -f docker-compose.production.yml logs -f app database

# Restart
sudo docker compose -f docker-compose.production.yml restart

# Stop
sudo docker compose -f docker-compose.production.yml down
```

Do not add `--volumes` to the stop command. PostgreSQL data is stored in a
named volume.
