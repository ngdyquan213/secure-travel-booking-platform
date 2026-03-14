from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request

REQUIRED_HEADERS = {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Smoke-test an HTTP deployment stack.")
    parser.add_argument(
        "--base-url",
        default=os.getenv("SMOKE_BASE_URL", "http://localhost"),
        help="Base URL to probe. Defaults to SMOKE_BASE_URL or http://localhost.",
    )
    parser.add_argument(
        "--expected-environment",
        default=os.getenv("SMOKE_EXPECT_ENVIRONMENT", "development"),
        help="Expected environment value returned by /health/live and /health/ready.",
    )
    return parser.parse_args()


def fetch(base_url: str, path: str) -> tuple[int, dict[str, str], bytes]:
    request = urllib.request.Request(f"{base_url}{path}")
    with urllib.request.urlopen(request, timeout=10) as response:
        status = response.getcode()
        headers = dict(response.headers.items())
        body = response.read()
    return status, headers, body


def assert_equal(actual, expected, message: str) -> None:
    if actual != expected:
        raise AssertionError(f"{message}: expected={expected!r} actual={actual!r}")


def main() -> int:
    args = parse_args()
    base_url = args.base_url.rstrip("/")

    try:
        live_status, live_headers, live_body = fetch(base_url, "/health/live")
        ready_status, _, ready_body = fetch(base_url, "/health/ready")
    except urllib.error.URLError as exc:
        print(f"smoke_local_stack: unable to reach {base_url}: {exc}", file=sys.stderr)
        return 1

    assert_equal(live_status, 200, "live endpoint status")
    assert_equal(ready_status, 200, "ready endpoint status")

    live_payload = json.loads(live_body.decode("utf-8"))
    ready_payload = json.loads(ready_body.decode("utf-8"))

    assert_equal(live_payload["status"], "alive", "live endpoint payload")
    assert_equal(ready_payload["status"], "ready", "ready endpoint payload")
    assert_equal(
        live_payload["environment"], args.expected_environment, "live endpoint environment"
    )
    assert_equal(
        ready_payload["environment"], args.expected_environment, "ready endpoint environment"
    )
    assert_equal(ready_payload["checks"]["database"], True, "database readiness")
    assert_equal(ready_payload["checks"]["redis"], True, "redis readiness")

    for header_name, expected_value in REQUIRED_HEADERS.items():
        assert_equal(live_headers.get(header_name), expected_value, f"{header_name} header")

    print("smoke_local_stack: PASS")
    print(json.dumps({"live": live_payload, "ready": ready_payload}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
