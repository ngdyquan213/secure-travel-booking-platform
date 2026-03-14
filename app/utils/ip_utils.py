from __future__ import annotations

from ipaddress import ip_address as parse_ip


def normalize_ip(ip_value: str | None) -> str | None:
    if not ip_value:
        return None

    try:
        return str(parse_ip(ip_value))
    except ValueError:
        return None
