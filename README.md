# Secure Travel Booking Platform

Security-focused travel booking backend built with FastAPI, SQLAlchemy, PostgreSQL, Alembic, Redis, and Docker.

This project is positioned as a backend security lab: it implements core booking flows, then hardens them with authentication, authorization, payment callback protection, upload controls, audit trails, and operational safeguards.

## Scope

- User authentication and token-based access control
- Flight, hotel, and tour booking flows
- Coupon application and abuse prevention
- Payment initiation and payment callback handling
- Traveler document upload/download
- Admin monitoring and export surfaces
- Audit logs, security events, rate limiting, and runtime maintenance jobs

## Production Gap

### Implemented

- JWT authentication, RBAC, ownership checks, refresh-token rotation
- Server-side booking amount calculation and transactional inventory updates
- Payment idempotency, callback signature verification, replay detection, amount/currency validation
- Callback source allowlist based on IP/CIDR ranges
- Upload extension, MIME, and file-signature validation
- Optional malware scan hook for uploads with `mock` and `clamav` backends
- Structured logging for HTTP requests, payment flows, outbox processing, and startup checks
- Basic operational metrics at `GET /metrics`:
  - `http_requests_total`
  - `http_error_responses_total`
  - `payment_callback_failures_total`
  - `payment_callback_failures_by_reason`
  - `outbox_backlog`
  - `outbox_dispatch_failures_total`
  - `outbox_dispatch_failures_by_reason`
  - `rate_limit_backend_failures_total`
- Prometheus-compatible metrics at `GET /metrics/prometheus` with staging scrape rules for Redis, outbox, and payment callback alerting
- Outbox processing with lease-based claiming, retry/backoff, backlog visibility, and request-path enqueue only semantics
- Health probes for liveness and readiness
- Test suite, Ruff, Bandit, and pip-audit
- `pip check` in CI to verify a consistent installed dependency graph
- Coverage gate in CI with `pytest-cov`
- Deterministic demo seed for frontend/QA handoff via `make seed-demo`

### Mocked

- Payment gateway integration is simulated; callback signing uses an internal shared secret instead of a live provider SDK
- Email and notification workers support mock backends for development/testing
- Malware scanning can run in `mock` mode for local verification without a real antivirus daemon

### Planned

- Secret manager integration for staging/production instead of environment-file based secret distribution
- WAF / reverse-proxy hardening and additional edge protections
- Production object storage patterns such as presigned URLs and lifecycle policies

## Observability Notes

- `GET /health`, `GET /health/live`, and `GET /health/ready` expose service health.
- `GET /health/ready` now includes readiness policy, outbox health, degraded checks, runtime-task state, and dependency signals for storage, email, notifications, malware scan, and rate limiting.
- `GET /metrics` returns a JSON snapshot of the in-process counters plus the current outbox backlog.
- `GET /metrics/prometheus` exposes Prometheus text format metrics including dependency readiness and runtime-task health.
- `infra/observability/prometheus.yml` scrapes the app in staging, and `infra/observability/alerts.yml` defines baseline alert rules for Redis readiness, outbox health, payment callback failures, and rate-limit backend failures.
- Payment and outbox logs now emit structured fields through logger `extra`, which are preserved by the JSON formatter in non-debug environments.

## Security Notes

- `PAYMENT_CALLBACK_SOURCE_ALLOWLIST` accepts a comma-separated set of IPs/CIDRs and is required in staging/production.
- Upload malware scanning is optional and controlled through:
  - `UPLOAD_MALWARE_SCAN_ENABLED`
  - `UPLOAD_MALWARE_SCAN_BACKEND`
  - `CLAMAV_HOST`
  - `CLAMAV_PORT`
  - `CLAMAV_TIMEOUT_SECONDS`
- Secret sourcing is described through:
  - `SECRET_SOURCE`
  - `SECRET_MANAGER_PROVIDER`
- `OUTBOX_HEALTH_MODE` controls whether outbox health is `best_effort` or `required` for readiness.

## Local Setup

1. Copy `.env.example` to `.env` and adjust values.
2. Start dependencies or the full stack with Docker Compose.
3. Run migrations.
4. Start the API with proxy headers enabled if traffic will arrive through Nginx or another reverse proxy.

Example commands:

```bash
alembic upgrade head
uvicorn app.main:app --reload --proxy-headers --forwarded-allow-ips="127.0.0.1,::1"
```

## Testing

- Copy `.env.test.example` if you want a dedicated local test env file.
- `python -m pytest -q` runs the full suite. Tests that require PostgreSQL now skip with a clear message if the database is unavailable.
- `make test-cov` runs the suite with a coverage report and enforces the configured threshold.
- `make test-fast` runs a portable subset that does not require external services.
- `make up-test-db` starts the PostgreSQL container used by the postgres-marked tests.
- `tests/test_migration_regressions.py` verifies the upgrade path from the pre-outbox schema revision to `head`, including the coupon-column repair migration.
- CI installs Python dependencies from `requirements-dev.lock` and then runs `pip check` so dependency resolution matches local lockfile-based setup more closely.

## Demo Seed

- `make seed-demo` creates a deterministic handoff dataset anchored at `2026-04-01T08:00:00+00:00`.
- The seed is idempotent and creates:
  - admin user `admin@example.com` / `Admin12345`
  - QA customer `qa.customer@example.com` / `Traveler12345`
  - fixed catalog data, coupons, and booking `BK-DEMO-FLIGHT-001`
- `python scripts/seed_data.py --anchor-datetime ...` and `python scripts/seed_coupons.py --anchor-datetime ...` remain available if you only need deterministic catalog or coupon dates.

## Additional Docs

- `docs/api-examples.md` contains curl-based walkthroughs for the main API flows.
- `docs/migration-runbook.md` documents migration rollout and rollback expectations.
- `docs/deployment.md` documents staging bring-up, smoke verification, Prometheus access, and demo seeding.
- `CONTRIBUTING.md` explains the local quality gates expected before changes are merged.

## Repository Layout

```text
app/        API, services, repositories, middleware, core runtime code
alembic/    Database migrations
tests/      Automated tests
docs/       Architecture and deployment notes
security/   Security controls, threat model, and reports
infra/      Docker and deployment assets
```
