# Threat Model - Secure Travel Booking Platform

## 1. Overview

Secure Travel Booking Platform là backend API phục vụ:

- user registration / login
- flight booking
- hotel booking
- coupon apply
- payment initiate
- payment callback processing
- document upload / download
- admin monitoring and coupon management

## 2. Main Assets

Các tài sản cần bảo vệ:

- user accounts
- JWT access tokens
- booking data
- payment state and transaction references
- uploaded documents
- audit logs
- security events
- coupon rules and usage limits
- admin-only APIs

## 3. Trust Boundaries

### Boundary A - External Client to API
Người dùng internet gọi API qua HTTP(S).

Rủi ro:
- brute force
- token theft
- broken authentication
- injection
- IDOR
- abusive requests

### Boundary B - API to Database
FastAPI backend truy cập PostgreSQL.

Rủi ro:
- unsafe query logic
- privilege abuse
- inconsistent transaction handling
- broken authorization leading to sensitive reads/writes

### Boundary C - API to File Storage
Document upload/download lưu file local path `uploads/`.

Rủi ro:
- path traversal
- unsafe file types
- insecure direct file access
- unauthorized file download

### Boundary D - Payment Gateway Callback to API
Payment gateway mock callback gọi `/api/v1/payments/callback`.

Rủi ro:
- forged callback
- replay callback
- amount mismatch
- fake paid status
- duplicate transaction reference

### Boundary E - Admin to Admin APIs
Admin thực hiện read/update coupon lifecycle và giám sát.

Rủi ro:
- privilege escalation
- missing role checks
- admin token misuse
- lack of auditability

## 4. Main Threat Scenarios

## 4.1 Authentication Threats

### Threat: Brute-force login
Impact:
- account takeover

Current mitigations:
- login attempt logging
- security event generation
- password hashing
- JWT-based auth

Gaps:
- hard account lockout policy chưa hoàn chỉnh
- distributed brute-force detection chưa có

### Threat: Stolen JWT token
Impact:
- account misuse
- access to booking/documents/admin APIs

Current mitigations:
- bearer token validation
- protected endpoints with `get_current_user`
- admin endpoints require `require_admin`

Gaps:
- refresh token lifecycle chưa fully exposed
- token revocation strategy chưa hoàn chỉnh

## 4.2 Authorization Threats

### Threat: IDOR on document download
Impact:
- sensitive document disclosure

Current mitigations:
- `get_by_id_and_user_id`
- ownership check before download
- audit log on download

Status:
- mitigated in current implementation

### Threat: User accesses another user's booking/payment
Impact:
- privacy/data leakage
- unauthorized actions

Current mitigations:
- booking lookup by `(booking_id, user_id)`
- payment lookup through owned booking checks

Status:
- partially mitigated

## 4.3 Booking / Inventory Threats

### Threat: Overbooking race condition
Impact:
- negative inventory
- inconsistent booking state

Current mitigations:
- `SELECT ... FOR UPDATE` style row locking on flight/hotel room
- transaction around booking creation
- decrement inventory in same transaction

Status:
- mitigated for current single-row inventory model

### Threat: Booking manipulation
Impact:
- wrong total amount
- coupon abuse
- invalid state transitions

Current mitigations:
- total amount calculated server-side
- coupon validation rules
- payment status updated server-side

## 4.4 Coupon Threats

### Threat: Coupon abuse / repeated use
Impact:
- financial loss

Current mitigations:
- `usage_limit_total`
- `usage_limit_per_user`
- booking ownership check
- one coupon per booking
- coupon usage record

Gaps:
- abuse analytics not implemented
- admin anomaly dashboard not implemented

## 4.5 Payment Threats

### Threat: Forged callback
Impact:
- payment marked as paid without real payment

Current mitigations:
- HMAC mock signature verification
- callback persistence
- security event on invalid signature

Status:
- mitigated at mock gateway level

### Threat: Replay callback
Impact:
- duplicate processing
- inconsistent payment state

Current mitigations:
- check duplicate transaction reference
- persist callback data
- security event on replay

Status:
- partially mitigated

### Threat: Amount mismatch
Impact:
- underpayment accepted

Current mitigations:
- compare callback amount/currency with payment record
- reject mismatched callback
- log security event

Status:
- mitigated

## 4.6 File Upload Threats

### Threat: Malicious file upload
Impact:
- storage abuse
- potential malware hosting
- parser exploitation

Current mitigations:
- extension allowlist
- MIME allowlist
- ownership-based retrieval

Gaps:
- antivirus scanning chưa có
- content sniffing chưa có
- file size thresholds chưa centralized

## 4.7 Admin Threats

### Threat: Missing admin enforcement
Impact:
- regular users access monitoring and coupon management

Current mitigations:
- `require_admin`
- role-based check
- audit log for admin actions

Gaps:
- no fine-grained permission matrix yet

## 5. STRIDE Mapping

### Spoofing
- forged JWT
- fake payment callback
- admin impersonation

### Tampering
- coupon rule manipulation
- payment state tampering
- booking price tampering
- file replacement

### Repudiation
- deny admin action
- deny payment processing
- deny document access

Mitigation:
- audit logs
- security events
- request logging with request id

### Information Disclosure
- document leakage
- user/booking data leakage
- admin audit exposure

### Denial of Service
- brute-force login
- upload abuse
- callback spam
- API flooding

Mitigation:
- basic rate limiting middleware

### Elevation of Privilege
- user to admin escalation
- IDOR leading to cross-user access

## 6. Highest-Risk Areas

1. payment callback handling
2. document upload/download
3. admin APIs
4. booking inventory race conditions
5. coupon abuse logic

## 7. Security Priorities

### Near-term
- stronger rate limiting
- callback replay persistence hardening
- file size enforcement
- admin action tests
- callback negative tests

### Mid-term
- Redis-based rate limit
- AV scanning for uploads
- refresh token rotation
- centralized authorization policy
- callback idempotency store

### Longer-term
- object storage presigned URL model
- SIEM integration
- anomaly detection for coupon/payment abuse