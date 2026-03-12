---

# `README.md` — bản polish theo hướng portfolio/security engineer

```md
# Secure Travel Booking Platform

Security-focused travel booking backend built with **FastAPI**, **SQLAlchemy**, **PostgreSQL**, **Alembic**, **Docker**, and **Nginx**.

This project was designed as a **portfolio-grade backend security lab** that demonstrates:

- secure authentication and RBAC
- booking integrity controls
- coupon abuse prevention
- payment callback verification
- file ownership enforcement
- audit logging and security event monitoring
- CI with lint, SAST, dependency audit, and tests

---

## Why this project exists

Most demo booking apps focus only on CRUD.  
This project focuses on **how a security-aware backend should be designed and tested**.

It covers both business logic and security logic for:

- flight booking
- hotel booking
- coupon lifecycle
- payment initiation and callback handling
- document upload/download
- admin monitoring

---

## Key Security Highlights

### Authentication & Access Control
- JWT authentication
- password hashing with bcrypt/passlib
- admin-only route protection
- ownership checks for sensitive resources

### Booking Integrity
- server-side price calculation
- row-locking pattern for inventory reduction
- seat/room decrement inside transaction

### Coupon Abuse Prevention
- usage limit total
- usage limit per user
- one coupon per booking
- minimum booking amount validation
- active / expiry window validation

### Payment Security
- idempotency key support
- payment callback signature verification mock
- replay callback detection
- amount/currency mismatch detection
- payment callback persistence
- security events for suspicious payment behavior

### File Security
- file extension allowlist
- MIME allowlist
- document download with ownership check
- audit logs for upload/download actions

### Monitoring
- audit logs for sensitive actions
- security events for suspicious behavior
- request logging with request id
- basic in-memory rate limiting

---

## Main Features

- user register / login
- flights read API
- hotels read API
- flight booking
- hotel booking
- coupon apply flow
- payment initiate flow
- payment callback verification mock
- upload/download document with ownership check
- admin list users/bookings/payments/audit logs
- admin create/update/deactivate coupons

---

## Tech Stack

- **Backend:** FastAPI
- **ORM:** SQLAlchemy 2.0
- **Database:** PostgreSQL
- **Migration:** Alembic
- **Testing:** Pytest
- **Linting:** Ruff
- **Security Scans:** Bandit, pip-audit
- **Infra:** Docker Compose, Nginx

---

## Project Structure

```text
secure-travel-booking-platform/
├── app/
│   ├── api/
│   ├── core/
│   ├── middleware/
│   ├── models/
│   ├── repositories/
│   ├── schemas/
│   ├── services/
│   ├── utils/
│   └── workers/
├── alembic/
├── tests/
├── infra/
├── ci-cd/
├── security/
├── docs/
├── scripts/
├── pyproject.toml
├── alembic.ini
├── .env
├── .env.example
├── README.md
└── Makefile