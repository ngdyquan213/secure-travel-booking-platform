from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.middleware.rate_limit_middleware import RateLimitMiddleware


def create_test_app(max_requests: int = 2, window_seconds: int = 60) -> FastAPI:
    app = FastAPI()
    app.add_middleware(
        RateLimitMiddleware,
        max_requests=max_requests,
        window_seconds=window_seconds,
    )

    @app.get("/ping")
    def ping():
        return {"status": "ok"}

    return app


def test_rate_limit_allows_requests_within_limit():
    app = create_test_app(max_requests=2, window_seconds=60)

    with TestClient(app) as client:
        resp1 = client.get("/ping")
        resp2 = client.get("/ping")

        assert resp1.status_code == 200
        assert resp2.status_code == 200


def test_rate_limit_blocks_requests_exceeding_limit():
    app = create_test_app(max_requests=2, window_seconds=60)

    with TestClient(app) as client:
        resp1 = client.get("/ping")
        resp2 = client.get("/ping")
        resp3 = client.get("/ping")

        assert resp1.status_code == 200
        assert resp2.status_code == 200
        assert resp3.status_code == 429
        assert resp3.json()["detail"] == "Rate limit exceeded"