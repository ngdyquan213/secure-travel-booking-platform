import logging


def test_log_startup_summary_redacts_connection_credentials(monkeypatch, caplog):
    from app.core import startup as startup_module

    monkeypatch.setattr(
        startup_module.settings,
        "DATABASE_URL",
        "postgresql+psycopg2://stage_user:super-secret-db-password@postgres:5432/app_db",
    )
    monkeypatch.setattr(
        startup_module.settings,
        "REDIS_URL",
        "redis://:super-secret-redis-password@redis:6379/0",
    )

    with caplog.at_level(logging.INFO, logger="app.startup"):
        startup_module.log_startup_summary()

    log_output = " ".join(record.getMessage() for record in caplog.records)
    assert "super-secret-db-password" not in log_output
    assert "super-secret-redis-password" not in log_output
    assert "postgresql+psycopg2://stage_user:***@postgres:5432/app_db" in log_output
    assert "redis://:***@redis:6379/0" in log_output
