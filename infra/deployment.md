Deployment artifacts live under `infra/docker` and `infra/nginx`.

Primary references:

- `docs/deployment.md` for local and staging bring-up
- `docs/migration-runbook.md` for schema rollout and rollback expectations
- `infra/observability/prometheus.yml` and `infra/observability/alerts.yml` for the staging observability baseline

Current state:

- local production-like stack is supported
- staging-like compose stack is supported, including Prometheus scrape and alert rules
- full cloud deployment automation is not yet implemented in this repository
