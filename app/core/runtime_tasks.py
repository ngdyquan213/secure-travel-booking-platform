from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone

from app.core.database import SessionLocal
from app.repositories.user_repository import UserRepository

logger = logging.getLogger("app.runtime")


def cleanup_refresh_tokens() -> None:
    db = None
    try:
        db = SessionLocal()
        repo = UserRepository(db)

        now = datetime.now(timezone.utc)
        expired_deleted = repo.delete_expired_refresh_tokens(now)
        revoked_deleted = repo.delete_old_revoked_refresh_tokens(older_than=now - timedelta(days=7))

        db.commit()

        logger.info(
            "runtime_cleanup_refresh_tokens | expired_deleted=%s revoked_deleted=%s",
            expired_deleted,
            revoked_deleted,
        )
    except Exception:
        if db is not None:
            db.rollback()
        logger.exception("runtime_cleanup_refresh_tokens_failed")
        raise
    finally:
        if db is not None:
            db.close()
