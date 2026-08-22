# Portfolio CI/CD

Every push to `main` runs linting, type checking, and tests in GitHub Actions.
After validation, GitHub builds an immutable Linux AMD64 image, publishes it to
Docker Hub, and updates the `latest` tag.

The production server checks Docker Hub through its registry mirror every two
minutes. When the digest changes, it deploys that immutable digest, runs Prisma
migrations, waits for the application health check, and restores the previous
application image if the new container does not become healthy. A failed digest
is not retried until a different image is published.

## Required GitHub Actions secrets

```text
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
```

The Docker Hub repository must be public because the production server pulls
Docker Hub images through a registry mirror.

## Server files

Install these repository files as root-owned executables and systemd units:

```text
deploy/portfolio-ci-deploy      -> /usr/local/sbin/portfolio-ci-deploy
deploy/portfolio-update         -> /usr/local/sbin/portfolio-update
deploy/portfolio-update.service -> /etc/systemd/system/portfolio-update.service
deploy/portfolio-update.timer   -> /etc/systemd/system/portfolio-update.timer
```

Enable the timer after installing the files:

```text
systemctl enable --now portfolio-update.timer
```
