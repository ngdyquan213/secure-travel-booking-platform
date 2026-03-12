from __future__ import annotations

import logging
import time
from typing import Callable

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

logger = logging.getLogger("app.http")


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start = time.perf_counter()

        client_ip = request.client.host if request.client else "unknown"
        method = request.method
        path = request.url.path

        try:
            response = await call_next(request)
            duration_ms = round((time.perf_counter() - start) * 1000, 2)

            logger.info(
                "request_completed | method=%s path=%s status_code=%s duration_ms=%s client_ip=%s",
                method,
                path,
                response.status_code,
                duration_ms,
                client_ip,
            )
            return response

        except Exception:
            duration_ms = round((time.perf_counter() - start) * 1000, 2)

            logger.exception(
                "request_failed | method=%s path=%s duration_ms=%s client_ip=%s",
                method,
                path,
                duration_ms,
                client_ip,
            )
            raise