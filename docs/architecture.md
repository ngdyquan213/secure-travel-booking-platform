# Architecture - Secure Travel Booking Platform

## 1. Overview

Secure Travel Booking Platform là backend service được xây dựng bằng:

- FastAPI
- SQLAlchemy 2.0
- PostgreSQL
- Alembic
- Nginx
- Docker Compose

Mục tiêu là tạo một travel booking backend có định hướng security-first.

## 2. High-Level Architecture

```text
Client / Browser / API Consumer
            |
            | HTTPS / HTTP
            v
         Nginx Proxy
            |
            v
      FastAPI Application
            |
            +--> Auth / RBAC
            +--> Booking Logic
            +--> Coupon Logic
            +--> Payment Logic
            +--> Upload Logic
            +--> Admin Monitoring
            |
            v
        PostgreSQL
            |
            +--> users
            +--> bookings
            +--> payments
            +--> coupons
            +--> uploaded_documents
            +--> audit_logs
            +--> security_events