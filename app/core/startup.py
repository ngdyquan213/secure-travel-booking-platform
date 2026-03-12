from __future__ import annotations

import logging
from pathlib import Path

from sqlalchemy import text

from app.core.config import settings
from app.core.database import SessionLocal
from app.core.redis import redis_client

logger = logging.getLogger("app.startup")


def ensure_local_directories() -> None:
    Path(settings.LOCAL_UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
    logger.info(
        "startup_directory_ready | path=%s",
        settings.LOCAL_UPLOAD_DIR,
    )


def check_database_connection() -> None:
    db = None
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        logger.info("startup_database_check_ok")
    except Exception as exc:
        logger.exception("startup_database_check_failed")
        raise RuntimeError("Database connection check failed") from exc
    finally:
        if db is not None:
            db.close()


def check_redis_connection() -> None:
    try:
        pong = redis_client.ping()
        if pong is not True:
            raise RuntimeError("Redis ping did not return True")
        logger.info("startup_redis_check_ok")
    except Exception as exc:
        logger.exception("startup_redis_check_failed")
        raise RuntimeError("Redis connection check failed") from exc


def log_startup_summary() -> None:
    logger.info(
        "startup_summary | app_name=%s environment=%s debug=%s database_url=%s redis_url=%s upload_dir=%s",
        settings.APP_NAME,
        settings.ENVIRONMENT,
        settings.DEBUG,
        settings.DATABASE_URL,
        settings.REDIS_URL,
        settings.LOCAL_UPLOAD_DIR,
    )


def run_startup_checks() -> None:
    log_startup_summary()
    ensure_local_directories()
    check_database_connection()
    check_redis_connection()