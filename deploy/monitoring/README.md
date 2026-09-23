# Monitoring (Uptime Kuma)

Lightweight uptime monitoring for portfolio services.

## Install

Upload this directory to the server and run:

```sh
cd /opt/stacks
mkdir -p monitoring/data
sudo docker compose -f docker-compose.monitoring.yml up -d
```

Uptime Kuma will be available on port 3001 through the Caddy proxy network.

## Configure

1. Open `http://<server-ip>:3001` (or add a Caddy entry for `status.barzakhiserv.ir`)
2. Create admin account
3. Add monitors:
   - **Portfolio Health**: `https://rezabarzakhi.ir/api/health` — HTTP 200 check, every 60s
   - **Portfolio HTTPS**: `https://rezabarzakhi.ir` — HTTP 200 check, every 5 minutes
4. Configure notification channels (Telegram, email, etc.)

## Caddy entry (optional)

To expose via `status.barzakhiserv.ir`, add to the main Caddyfile:

```
status.barzakhiserv.ir {
    tls internal
    encode zstd gzip
    reverse_proxy uptime-kuma:3001
}
```

Then reload Caddy:

```sh
sudo docker compose -f /opt/stacks/proxy/compose.yaml exec -T caddy caddy reload --config /etc/caddy/Caddyfile
```