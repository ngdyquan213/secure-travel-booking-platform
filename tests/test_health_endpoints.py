from fastapi.testclient import TestClient


def test_health_ready_returns_200_when_dependencies_are_ready(monkeypatch):
    from app import main as main_module

    class HealthyDB:
        def execute(self, _query):
            return 1

        def close(self):
            pass

    class HealthyRedis:
        def ping(self):
            return True

    monkeypatch.setattr(main_module, "run_startup_checks", lambda: None)
    monkeypatch.setattr(main_module, "cleanup_refresh_tokens", lambda: None)
    monkeypatch.setattr(main_module, "SessionLocal", lambda: HealthyDB())
    monkeypatch.setattr(main_module, "redis_client", HealthyRedis())

    with TestClient(main_module.app) as client:
        response = client.get("/health/ready")

    assert response.status_code == 200
    assert response.json()["status"] == "ready"


def test_health_ready_returns_503_when_dependencies_are_not_ready(monkeypatch):
    from app import main as main_module

    class BrokenDB:
        def execute(self, _query):
            raise RuntimeError("db down")

        def close(self):
            pass

    class BrokenRedis:
        def ping(self):
            raise RuntimeError("redis down")

    monkeypatch.setattr(main_module, "run_startup_checks", lambda: None)
    monkeypatch.setattr(main_module, "cleanup_refresh_tokens", lambda: None)
    monkeypatch.setattr(main_module, "SessionLocal", lambda: BrokenDB())
    monkeypatch.setattr(main_module, "redis_client", BrokenRedis())

    with TestClient(main_module.app) as client:
        response = client.get("/health/ready")

    assert response.status_code == 503
    assert response.json()["status"] == "not_ready"
    assert response.json()["checks"] == {"database": False, "redis": False}
