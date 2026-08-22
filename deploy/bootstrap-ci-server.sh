#!/usr/bin/env sh
set -eu

source_dir="${1:-/tmp}"
public_key="${2:-$source_dir/portfolio_ci.pub}"
project_dir=/opt/stacks/portfolio
authorized_keys=/home/deploy/.ssh/authorized_keys

for file in portfolio-ci-deploy portfolio-ci-dispatch docker-compose.production.yml; do
  if [ ! -f "$source_dir/$file" ]; then
    echo "Missing bootstrap file: $source_dir/$file"
    exit 1
  fi
done

if [ ! -f "$public_key" ] || ! ssh-keygen -l -f "$public_key" >/dev/null 2>&1; then
  echo "The CI public key is missing or invalid."
  exit 1
fi

install -m 750 -o root -g root "$source_dir/portfolio-ci-deploy" /usr/local/sbin/portfolio-ci-deploy
install -m 755 -o root -g root "$source_dir/portfolio-ci-dispatch" /usr/local/bin/portfolio-ci-dispatch

cp -a "$project_dir/docker-compose.production.yml" \
  "$project_dir/docker-compose.production.yml.before-ci"
install -m 644 -o root -g root "$source_dir/docker-compose.production.yml" \
  "$project_dir/docker-compose.production.yml"

printf '%s\n' \
  'deploy ALL=(root) NOPASSWD: /usr/local/sbin/portfolio-ci-deploy *' \
  > /etc/sudoers.d/portfolio-ci
chmod 440 /etc/sudoers.d/portfolio-ci
visudo -cf /etc/sudoers.d/portfolio-ci

install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
touch "$authorized_keys"

if ! grep -q 'github-actions-portfolio$' "$authorized_keys"; then
  {
    printf 'restrict,command="/usr/local/bin/portfolio-ci-dispatch" '
    tr -d '\r\n' < "$public_key"
    printf '\n'
  } >> "$authorized_keys"
fi

chown deploy:deploy "$authorized_keys"
chmod 600 "$authorized_keys"

{
  printf '[87.107.105.67]:9011 '
  cat /etc/ssh/ssh_host_ed25519_key.pub
} > /home/deploy/portfolio_known_hosts
chown deploy:deploy /home/deploy/portfolio_known_hosts
chmod 600 /home/deploy/portfolio_known_hosts

docker compose \
  --env-file "$project_dir/.env" \
  -f "$project_dir/docker-compose.production.yml" \
  config --quiet

echo "CI server bootstrap completed."
