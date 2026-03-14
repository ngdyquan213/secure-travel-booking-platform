# Deployment Runbook

This repository now supports two deployment-style flows:

- `local production-like`: for end-to-end local validation with host-exposed ports
- `staging-ready`: for a safer, more deployment-like stack with its own env file, persistent uploads, and CI smoke coverage

## Local Production-Like

Use this when you want fast local verification through Nginx on your workstation.

### Bring Up

```powershell
docker compose -f infra/docker/docker-compose.yml up -d --build
```

If your host already uses `80`, `5432`, or `6379`, override them temporarily:

```powershell
$env:HOST_HTTP_PORT="8080"
$env:HOST_POSTGRES_PORT="5434"
$env:HOST_REDIS_PORT="6380"
docker compose -f infra/docker/docker-compose.yml up -d --build
```

### Verify

```powershell
docker compose -f infra/docker/docker-compose.yml ps
python scripts/smoke_local_stack.py --expected-environment development
```

If you overrode the HTTP port:

```powershell
python scripts/smoke_local_stack.py --base-url http://localhost:8080 --expected-environment development
```

Expected result:

- `postgres`, `redis`, `app`, and `nginx` are healthy
- `/health/live` returns `200`
- `/health/ready` returns `200`
- readiness reports both database and Redis as `true`
- Nginx includes the expected security headers

## Staging-Ready

Use this when you want a dedicated deployment profile that behaves closer to a shared environment.

### Prepare Env

1. Create a staging env file from the tracked example:

```powershell
Copy-Item .env.staging.example .env.staging
```

2. Replace the sample values before sharing the environment:

- `SECRET_KEY`
- `PAYMENT_CALLBACK_SECRET`
- `POSTGRES_PASSWORD`
- `CORS_ORIGINS`
- `TRUSTED_HOSTS`

Notes:

- `ENVIRONMENT=staging` enforces stricter validation than development.
- `DEBUG=true`, localhost-backed database URLs, localhost-backed Redis URLs, and payment simulation are rejected in staging.

### Bring Up

```powershell
docker compose --env-file .env.staging -f infra/docker/docker-compose.staging.yml up -d --build
```

The staging compose file differs from local compose in a few important ways:

- it uses `.env.staging`
- it does not publish Postgres or Redis to the host by default
- it persists uploads in a Docker volume
- it defaults HTTP to port `8080`

### Verify

```powershell
docker compose --env-file .env.staging -f infra/docker/docker-compose.staging.yml ps
python scripts/smoke_local_stack.py --base-url http://localhost:8080 --expected-environment staging
```

Expected result:

- `nginx`, `app`, `postgres`, and `redis` are healthy
- `/health/live` reports `environment=staging`
- `/health/ready` returns `200`
- readiness reports both database and Redis as `true`

### Tear Down

```powershell
docker compose --env-file .env.staging -f infra/docker/docker-compose.staging.yml down
```

To also remove volumes:

```powershell
docker compose --env-file .env.staging -f infra/docker/docker-compose.staging.yml down -v
```

## Useful Commands

```powershell
make up
make smoke-local
make up-staging
make smoke-staging
make logs-staging
make down-staging
```

If `make` is unavailable on Windows, run the underlying Docker and Python commands directly.
