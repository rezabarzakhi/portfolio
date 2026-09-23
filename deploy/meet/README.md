# Group video meetings

This deployment installs Jitsi Meet for up to four participants at
`https://meet.barzakhiserv.ir`. A registered host must create each room, while
guests can join using the room link.

The web container joins the existing external `proxy` network and is reachable
by Caddy as `meet-web:80`. Only the media bridge publishes a public port:
`10000/udp`.

## Install

Upload this directory to the server and run:

```sh
sudo sh deploy/meet/install.sh
```

The installer uses the pinned official Jitsi Docker release compatible with
the server's Docker Hub mirror, generates service secrets, starts the stack,
updates and reloads Caddy, opens the media port when UFW is active, and creates
the initial host account. Its generated credentials are root-readable at:

```text
/opt/stacks/meet/admin-credentials
```

## Operations

```sh
cd /opt/stacks/meet
sudo docker compose -f docker-compose.yml -f compose.proxy.yml ps
sudo docker compose -f docker-compose.yml -f compose.proxy.yml logs -f
sudo docker compose -f docker-compose.yml -f compose.proxy.yml restart
```
