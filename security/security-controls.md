# Security Controls - Secure Travel Booking Platform

## 1. Authentication Controls

### Implemented
- password hashing with bcrypt/passlib
- JWT access token validation
- protected endpoints with dependency-based auth
- admin route protection via role check
- login attempt logging

### Relevant Components
- `app/core/security.py`
- `app/api/deps.py`
- `app/services/auth_service.py`
- `app/models/user.py`

## 2. Authorization Controls

### Implemented
- `get_current_user` for authenticated identity
- `require_admin` for admin-only endpoints
- ownership checks for:
  - bookings
  - payments
  - uploaded documents

### Relevant Components
- `app/api/deps.py`
- `app/repositories/booking_repository.py`
- `app/repositories/document_repository.py`
- `app/repositories/payment_repository.py`

## 3. Payment Security Controls

### Implemented
- idempotency key for payment initiation
- callback signature verification mock
- replay callback detection
- amount/currency mismatch validation
- payment callback persistence
- payment transaction history
- security event creation on invalid callback behavior

### Relevant Components
- `app/services/payment_service.py`
- `app/services/payment_callback_service.py`
- `app/core/security.py`
- `app/models/payment.py`

## 4. Booking Integrity Controls

### Implemented
- inventory locking with row-level lock pattern
- server-side price calculation
- server-side payment state update
- transaction-based booking creation
- room/seat decrement in same transaction

### Relevant Components
- `app/services/booking_service.py`
- `app/services/hotel_booking_service.py`
- `app/repositories/flight_repository.py`
- `app/repositories/hotel_repository.py`

## 5. Coupon Abuse Controls

### Implemented
- coupon active flag validation
- coupon start/end time validation
- minimum booking amount validation
- per-user usage limit
- total usage limit
- one-coupon-per-booking logic
- coupon usage tracking

### Relevant Components
- `app/services/coupon_service.py`
- `app/models/coupon.py`
- `app/repositories/coupon_repository.py`

## 6. File Security Controls

### Implemented
- allowed extension validation
- allowed MIME type validation
- ownership check on document download
- audit logging for upload/download
- private storage flag

### Relevant Components
- `app/utils/file_utils.py`
- `app/services/upload_service.py`
- `app/repositories/document_repository.py`
- `app/models/document.py`

## 7. Monitoring and Audit Controls

### Implemented
- audit logs for:
  - registration
  - login
  - booking creation
  - payment initiation
  - payment callback processing
  - coupon apply
  - admin actions
  - document download
- security events for:
  - invalid payment callback signature
  - replay callback
  - amount mismatch
  - login failures
- request logging with request id

### Relevant Components
- `app/models/audit.py`
- `app/services/audit_service.py`
- `app/middleware/logging_middleware.py`

## 8. Availability Controls

### Implemented
- basic in-memory rate limiting middleware
- health endpoint
- request logging

### Relevant Components
- `app/middleware/rate_limit_middleware.py`
- `app/main.py`

## 9. Secure SDLC Controls

### Implemented
- pytest test suite
- ruff linting
- bandit scan
- pip-audit dependency scan
- GitHub Actions CI

### Relevant Components
- `tests/`
- `.github/workflows/ci.yml`
- `ci-cd/github-actions.yml`

## 10. Control Gaps / Planned Enhancements

### Not Yet Implemented
- refresh token rotation / revocation API
- Redis-backed distributed rate limiting
- file antivirus scanning
- object storage with presigned URLs
- stronger admin permission granularity
- secret manager integration
- callback source allowlisting
- WAF / reverse proxy security headers hardening