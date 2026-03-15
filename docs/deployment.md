# Deployment Runbook

This repository now supports two deployment-style flows:

- `local production-like`: for end-to-end local validation with host-exposed ports
- `staging-ready`: for a safer, more deployment-like stack with its own env file, persistent uploads, Prometheus observability, and CI smoke coverage

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
- `TRUSTED_HOSTS` in the tracked staging example includes `app` and `app:8000` so internal Prometheus scrapes do not fail trusted-host validation.
- Email/notification delivery stays off the request path; pending outbox events are drained by the runtime maintenance loop only.
- The staging compose profile now includes a local SMTP sink at service `mailhog`, so the default staging env can pass worker connectivity checks without pointing at a real mail server.
- Malware scanning is disabled in the tracked staging example by default. If you enable ClamAV-backed scanning, provision a reachable `clamav` service first or `/health/ready` will fail.
- `OUTBOX_HEALTH_MODE=required` makes `/health/ready` fail when outbox dispatch is unhealthy or the outbox schema is missing.

### Bring Up

```powershell
docker compose --env-file .env.staging -f infra/docker/docker-compose.staging.yml up -d --build
```

If you need a temporary staging env variant for smoke validation, override `APP_ENV_FILE`:

```powershell
$env:APP_ENV_FILE="../../.env.staging.codex"
docker compose --env-file .env.staging.codex -f infra/docker/docker-compose.staging.yml up -d --build
```

The staging compose file differs from local compose in a few important ways:

- it uses `.env.staging`
- it does not publish Postgres or Redis to the host by default
- it persists uploads in a Docker volume
- it defaults HTTP to port `8080`

### Verify

```powershell
docker compose --env-file .env.staging -f infra/docker/docker-compose.staging.yml ps
python scripts/smoke_local_stack.py --base-url http://localhost:8080 --prometheus-url http://localhost:9090 --expected-environment staging
```

Expected result:

- `nginx`, `app`, `postgres`, `redis`, `mailhog`, and `prometheus` are up
- `/health/live` reports `environment=staging`
- `/health/ready` returns `200`
- readiness reports database, Redis, email worker, notification backend, malware scan, and outbox as `true`
- Prometheus reports the `secure-travel-app` target as `up`
- baseline alert rules for Redis, outbox, payment callbacks, and rate-limit backend failures are loaded

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

## Demo Seed For Frontend and QA

Use the deterministic seed when frontend, QA, or interview reviewers need a known dataset.

```powershell
python scripts/seed_demo_environment.py
```

Or with `make`:

```powershell
make seed-demo
```

The command is idempotent and creates:

- admin user `admin@example.com` / `Admin12345`
- QA customer `qa.customer@example.com` / `Traveler12345`
- fixed catalog dates anchored at `2026-04-01T08:00:00+00:00`
- booking `BK-DEMO-FLIGHT-001`
- coupons `WELCOME10`, `FLIGHT200K`, `HOTEL15`, and `TOUR300K`

## Prometheus Access

The staging compose profile exposes Prometheus on `http://localhost:9090` by default through `HOST_PROMETHEUS_PORT`.

Useful checks:

```powershell
Invoke-WebRequest http://localhost:9090/-/ready
Invoke-WebRequest http://localhost:9090/api/v1/targets
Invoke-WebRequest http://localhost:9090/api/v1/rules?type=alert
```

The app metrics endpoint scraped by Prometheus is:

```text
http://app:8000/metrics/prometheus
```
