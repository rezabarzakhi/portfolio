# Portfolio CI/CD

Every push to `main` runs linting, type checking, and tests in GitHub Actions.
After validation, GitHub builds an immutable Linux AMD64 image, publishes it to
Docker Hub, and connects to the production server with a restricted SSH key.

The server deploys the commit-specific image, runs Prisma migrations, waits for
the application health check, and restores the previous application image if
the new container does not become healthy.

## Required GitHub Actions secrets

```text
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
DEPLOY_HOST
DEPLOY_PORT
DEPLOY_USER
DEPLOY_SSH_KEY
DEPLOY_KNOWN_HOSTS
```

The Docker Hub repository must be public because the production server pulls
Docker Hub images through a registry mirror.

## Server files

Install these repository files as root-owned executables:

```text
deploy/portfolio-ci-dispatch -> /usr/local/bin/portfolio-ci-dispatch
deploy/portfolio-ci-deploy   -> /usr/local/sbin/portfolio-ci-deploy
```

The dedicated public key must be appended to the deploy user's
`authorized_keys` with this forced command:

```text
restrict,command="/usr/local/bin/portfolio-ci-dispatch" ssh-ed25519 PUBLIC_KEY github-actions-portfolio
```

Allow only the validated root deployment script without a password:

```text
deploy ALL=(root) NOPASSWD: /usr/local/sbin/portfolio-ci-deploy *
```
