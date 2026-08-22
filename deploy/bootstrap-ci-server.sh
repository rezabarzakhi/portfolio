#!/usr/bin/env sh
set -eu

source_dir="${1:-/tmp}"
project_dir=/opt/stacks/portfolio
authorized_keys=/home/deploy/.ssh/authorized_keys

for file in \
  portfolio-ci-deploy \
  portfolio-update \
  portfolio-update.service \
  portfolio-update.timer \
  docker-compose.production.yml; do
  if [ ! -f "$source_dir/$file" ]; then
    echo "Missing bootstrap file: $source_dir/$file"
    exit 1
  fi
done

install -m 750 -o root -g root "$source_dir/portfolio-ci-deploy" /usr/local/sbin/portfolio-ci-deploy
install -m 750 -o root -g root "$source_dir/portfolio-update" /usr/local/sbin/portfolio-update
install -m 644 -o root -g root "$source_dir/portfolio-update.service" /etc/systemd/system/portfolio-update.service
install -m 644 -o root -g root "$source_dir/portfolio-update.timer" /etc/systemd/system/portfolio-update.timer

cp -a "$project_dir/docker-compose.production.yml" \
  "$project_dir/docker-compose.production.yml.before-ci"
install -m 644 -o root -g root "$source_dir/docker-compose.production.yml" \
  "$project_dir/docker-compose.production.yml"

install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
touch "$authorized_keys"
sed -i '/github-actions-portfolio$/d' "$authorized_keys"
chown deploy:deploy "$authorized_keys"
chmod 600 "$authorized_keys"

rm -f \
  /etc/sudoers.d/portfolio-ci \
  /usr/local/bin/portfolio-ci-dispatch \
  /home/deploy/portfolio_known_hosts

docker compose \
  --env-file "$project_dir/.env" \
  -f "$project_dir/docker-compose.production.yml" \
  config --quiet

systemctl daemon-reload
systemctl enable --now portfolio-update.timer

echo "CI server bootstrap completed."
