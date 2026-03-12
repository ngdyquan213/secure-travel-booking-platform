from __future__ import annotations

import time
from typing import Callable

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse, Response

from app.core.config import settings
from app.core.error_handlers import build_error_payload
from app.core.redis import redis_client


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)

    def _resolve_limit(self, path: str) -> int:
        if path == "/api/v1/auth/login":
            return settings.RATE_LIMIT_LOGIN_PER_MINUTE
        if path == "/api/v1/auth/register":
            return settings.RATE_LIMIT_REGISTER_PER_MINUTE
        if path == "/api/v1/auth/refresh":
            return settings.RATE_LIMIT_REFRESH_PER_MINUTE
        if path.startswith("/api/v1/uploads"):
            return settings.RATE_LIMIT_UPLOAD_PER_MINUTE
        if path == "/api/v1/payments/callback":
            return settings.RATE_LIMIT_PAYMENT_CALLBACK_PER_MINUTE
        return settings.RATE_LIMIT_DEFAULT_PER_MINUTE

    def _build_key(self, request: Request) -> str:
        client_ip = request.client.host if request.client else "unknown"
        method = request.method.upper()
        path = request.url.path
        user_agent = request.headers.get("user-agent", "unknown")

        return f"rl:{method}:{path}:{client_ip}:{hash(user_agent)}"

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        if not settings.RATE_LIMIT_ENABLED:
            return await call_next(request)

        key = self._build_key(request)
        limit = self._resolve_limit(request.url.path)
        window_seconds = 60

        try:
            current = redis_client.incr(key)
            if current == 1:
                redis_client.expire(key, window_seconds)

            ttl = redis_client.ttl(key)
        except Exception:
            return await call_next(request)

        if current > limit:
            payload = build_error_payload(
                request=request,
                error_code="RATE_LIMIT_EXCEEDED",
                message="Rate limit exceeded",
                detail={
                    "limit": limit,
                    "window_seconds": window_seconds,
                    "retry_after_seconds": max(ttl, 0),
                },
            )
            return JSONResponse(
                status_code=429,
                content=payload,
                headers={
                    "Retry-After": str(max(ttl, 0)),
                    "X-RateLimit-Limit": str(limit),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(int(time.time()) + max(ttl, 0)),
                },
            )

        response = await call_next(request)
        remaining = max(limit - current, 0)

        response.headers["X-RateLimit-Limit"] = str(limit)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        response.headers["X-RateLimit-Reset"] = str(int(time.time()) + max(ttl, 0))
        return response