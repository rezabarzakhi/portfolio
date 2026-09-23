#!/usr/bin/env sh
set -eu

release="stable-11031"
domain="meet.barzakhiserv.ir"
public_ip="87.107.105.67"
stack_dir="/opt/stacks/meet"
proxy_dir="/opt/stacks/proxy"
config_dir="$stack_dir/config"
source_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
release_archive="$source_dir/docker-jitsi-meet-$release.tar.gz"
compose="docker compose -f $stack_dir/docker-compose.yml -f $stack_dir/compose.proxy.yml"

if [ "$(id -u)" -ne 0 ]; then
  echo "Run this installer as root."
  exit 1
fi

for command in docker curl tar openssl awk; do
  if ! command -v "$command" >/dev/null 2>&1; then
    echo "Required command is missing: $command"
    exit 1
  fi
done

if ! docker compose version >/dev/null 2>&1; then
  echo "The Docker Compose plugin is required."
  exit 1
fi

if ! docker network inspect proxy >/dev/null 2>&1; then
  echo "The external Docker network 'proxy' does not exist."
  exit 1
fi

if [ ! -f "$proxy_dir/Caddyfile" ] || [ ! -f "$proxy_dir/compose.yaml" ]; then
  echo "The existing Caddy stack was not found in $proxy_dir."
  exit 1
fi

if [ -f "$stack_dir/docker-compose.yml" ]; then
  installed_release="$(cat "$stack_dir/.installed-release" 2>/dev/null || true)"
  if [ "$installed_release" != "$release" ]; then
    if [ -f "$stack_dir/admin-credentials" ]; then
      echo "Refusing to replace an installed Jitsi stack automatically."
      exit 1
    fi
    echo "Removing the incomplete Jitsi stack from a different release..."
    rm -rf "$stack_dir"
  fi
fi

mkdir -p "$stack_dir"

if [ ! -f "$stack_dir/docker-compose.yml" ]; then
  if [ -f "$release_archive" ]; then
    echo "Extracting bundled Jitsi Meet $release..."
    tar -xzf "$release_archive" --strip-components=1 -C "$stack_dir"
  else
    echo "Downloading Jitsi Meet $release..."
    curl -fsSL "https://github.com/jitsi/docker-jitsi-meet/archive/refs/tags/$release.tar.gz" \
      | tar -xz --strip-components=1 -C "$stack_dir"
  fi
  echo "$release" > "$stack_dir/.installed-release"
fi

cp "$source_dir/compose.proxy.yml" "$stack_dir/compose.proxy.yml"

set_env() {
  key="$1"
  value="$2"
  input="$stack_dir/.env"
  output="$stack_dir/.env.new"

  awk -v key="$key" -v value="$value" '
    BEGIN { found = 0 }
    $0 ~ "^#?" key "=" { print key "=" value; found = 1; next }
    { print }
    END { if (!found) print key "=" value }
  ' "$input" > "$output"
  mv "$output" "$input"
}

if [ ! -f "$stack_dir/.env" ]; then
  cp "$stack_dir/env.example" "$stack_dir/.env"
  (cd "$stack_dir" && ./gen-passwords.sh)
fi

set_env CONFIG "$config_dir"
set_env HTTP_PORT "127.0.0.1:8000"
set_env HTTPS_PORT "127.0.0.1:8443"
set_env TZ "Asia/Tehran"
set_env PUBLIC_URL "https://$domain"
set_env JVB_ADVERTISE_IPS "$public_ip"
set_env JITSI_IMAGE_REPO "jitsi"
set_env JITSI_IMAGE_VERSION "$release"
set_env DISABLE_HTTPS "1"
set_env ENABLE_HTTP_REDIRECT "0"
set_env ENABLE_LETSENCRYPT "0"
set_env ENABLE_AUTH "1"
set_env ENABLE_GUESTS "1"
set_env AUTH_TYPE "internal"
set_env ENABLE_LOBBY "1"
set_env ENABLE_PREJOIN_PAGE "1"
set_env ENABLE_WELCOME_PAGE "1"
set_env ENABLE_REQUIRE_DISPLAY_NAME "1"
set_env MAX_PARTICIPANTS "4"
set_env ENABLE_IPV6 "0"
chmod 600 "$stack_dir/.env"

mkdir -p \
  "$config_dir/web" \
  "$config_dir/prosody/config" \
  "$config_dir/prosody/prosody-plugins-custom" \
  "$config_dir/jicofo" \
  "$config_dir/jvb" \
  "$config_dir/jigasi" \
  "$config_dir/jibri" \
  "$config_dir/transcriber" \
  "$config_dir/transcripts" \
  "$config_dir/storage/jibri" \
  "$config_dir/storage/prosody" \
  "$config_dir/storage/transcripts" \
  "$config_dir/storage/web" \
  "$config_dir/tmp/web-crontabs" \
  "$config_dir/tmp/web-load-test"
chmod 777 \
  "$config_dir/storage/jibri" \
  "$config_dir/storage/prosody" \
  "$config_dir/storage/transcripts" \
  "$config_dir/storage/web" \
  "$config_dir/tmp/web-crontabs" \
  "$config_dir/tmp/web-load-test"

if command -v ufw >/dev/null 2>&1 && ufw status | grep -q '^Status: active'; then
  ufw allow 10000/udp comment 'Jitsi media'
fi

if [ ! -f "$proxy_dir/Caddyfile.before-meet" ]; then
  cp -p "$proxy_dir/Caddyfile" "$proxy_dir/Caddyfile.before-meet"
fi

awk '
  BEGIN { skipping = 0; depth = 0 }
  !skipping && /^meet\.barzakhiserv\.ir \{/ { skipping = 1; depth = 1; next }
  skipping {
    opens = gsub(/\{/, "{")
    closes = gsub(/\}/, "}")
    depth += opens - closes
    if (depth == 0) skipping = 0
    next
  }
  { print }
' "$proxy_dir/Caddyfile" > "$proxy_dir/Caddyfile.new"
printf '\n' >> "$proxy_dir/Caddyfile.new"
cat "$source_dir/Caddyfile" >> "$proxy_dir/Caddyfile.new"
mv "$proxy_dir/Caddyfile.new" "$proxy_dir/Caddyfile"

echo "Pulling and starting Jitsi Meet..."
$compose pull
$compose up -d

docker compose -f "$proxy_dir/compose.yaml" exec -T caddy \
  caddy validate --config /etc/caddy/Caddyfile
docker compose -f "$proxy_dir/compose.yaml" exec -T caddy \
  caddy reload --config /etc/caddy/Caddyfile

credentials="$stack_dir/admin-credentials"
if [ ! -f "$credentials" ]; then
  admin_user="admin"
  admin_password="$(openssl rand -base64 24 | tr -d '\n')"
  attempt=0
  until $compose exec -T prosody prosodyctl \
    --config /config/prosody.cfg.lua \
    register "$admin_user" meet.jitsi "$admin_password"; do
    attempt=$((attempt + 1))
    if [ "$attempt" -ge 30 ]; then
      echo "Prosody did not become ready for administrator creation."
      exit 1
    fi
    sleep 2
  done

  umask 077
  {
    echo "URL=https://$domain"
    echo "USERNAME=$admin_user"
    echo "PASSWORD=$admin_password"
  } > "$credentials"
fi

attempt=0
until curl -fsS "http://127.0.0.1:8000" >/dev/null; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 60 ]; then
    echo "The web service did not become ready within 120 seconds."
    $compose ps
    exit 1
  fi
  sleep 2
done

$compose ps
echo
echo "Installation completed. Administrator credentials:"
cat "$credentials"
