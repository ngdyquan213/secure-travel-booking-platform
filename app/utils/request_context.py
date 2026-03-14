from __future__ import annotations

from fastapi import Request


def get_client_ip(request: Request, *, default: str | None = None) -> str | None:
    if request.client and request.client.host:
        return request.client.host
    return default


def get_user_agent(request: Request) -> str | None:
    return request.headers.get("user-agent")
