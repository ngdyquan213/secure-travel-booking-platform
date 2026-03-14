from __future__ import annotations

from datetime import datetime, timezone
from ipaddress import ip_address as parse_ip

from sqlalchemy.orm import Session

from app.core.exceptions import (
    AuthenticationAppException,
    ConflictAppException,
    NotFoundAppException,
)
from app.core.security import get_password_hash, verify_password
from app.models.enums import LogActorType, SecurityEventType, UserStatus
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginRequest, RegisterRequest
from app.services.audit_service import AuditService
from app.services.auth_token_service import AuthTokenService
from app.workers.email_worker import EmailWorker


class AuthService:
    def __init__(
        self,
        db: Session,
        user_repo: UserRepository,
        audit_service: AuditService,
        email_worker: EmailWorker | None = None,
        auth_token_service: AuthTokenService | None = None,
    ) -> None:
        self.db = db
        self.user_repo = user_repo
        self.audit_service = audit_service
        self.email_worker = email_worker or EmailWorker()
        self.auth_token_service = auth_token_service or AuthTokenService(user_repo)

    @staticmethod
    def _normalize_ip(ip_value: str | None) -> str | None:
        if not ip_value:
            return None
        try:
            return str(parse_ip(ip_value))
        except ValueError:
            return None

    def register(
        self,
        *,
        payload: RegisterRequest,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> User:
        normalized_ip = self._normalize_ip(ip_address)

        existing_email = self.user_repo.get_by_email(payload.email)
        if existing_email:
            raise ConflictAppException("Email already registered")

        existing_username = self.user_repo.get_by_username(payload.username)
        if existing_username:
            raise ConflictAppException("Username already taken")

        try:
            user = User(
                email=payload.email,
                username=payload.username,
                full_name=payload.full_name,
                password_hash=get_password_hash(payload.password),
                status=UserStatus.active,
                email_verified=True,
                phone_verified=False,
                failed_login_count=0,
            )
            self.user_repo.create_user(user)

            self.db.flush()

            self.audit_service.log_action(
                actor_type=LogActorType.user,
                actor_user_id=user.id,
                action="user_registered",
                resource_type="user",
                resource_id=user.id,
                ip_address=normalized_ip,
                user_agent=user_agent,
                metadata={"email": user.email},
            )

            self.db.commit()
            self.db.refresh(user)

        except Exception:
            self.db.rollback()
            raise

        self.email_worker.send_welcome_email(
            to_email=user.email,
            full_name=user.full_name,
        )
        return user

    def login(
        self,
        *,
        payload: LoginRequest,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> tuple[User, str, str]:
        normalized_ip = self._normalize_ip(ip_address)
        user = self.user_repo.get_by_email(payload.email)

        if not user or not verify_password(payload.password, user.password_hash):
            try:
                self.audit_service.log_security_event(
                    event_type=SecurityEventType.auth,
                    severity="warning",
                    title="Login failed",
                    description="Invalid email or password",
                    ip_address=normalized_ip,
                    event_data={"email": payload.email},
                )
                self.db.commit()
            except Exception:
                self.db.rollback()
                raise

            raise AuthenticationAppException("Invalid email or password")

        if user.status != UserStatus.active:
            raise AuthenticationAppException("User is not active")

        try:
            user.last_login_at = datetime.now(timezone.utc)
            user.last_login_ip = normalized_ip
            user.failed_login_count = 0
            self.user_repo.save_user(user)

            access_token, refresh_token = self.auth_token_service.issue_session_tokens(
                user_id=str(user.id)
            )

            self.audit_service.log_action(
                actor_type=LogActorType.user,
                actor_user_id=user.id,
                action="user_logged_in",
                resource_type="user",
                resource_id=user.id,
                ip_address=normalized_ip,
                user_agent=user_agent,
                metadata={"email": user.email},
            )

            self.db.commit()
            return user, access_token, refresh_token

        except Exception:
            self.db.rollback()
            raise

    def refresh_access_token(
        self,
        *,
        refresh_token: str,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> tuple[User, str, str]:
        normalized_ip = self._normalize_ip(ip_address)

        try:
            stored = self.auth_token_service.validate_refresh_token(refresh_token=refresh_token)
        except ValueError as exc:
            raise AuthenticationAppException(str(exc)) from exc

        user = self.user_repo.get_by_id(str(stored.user_id))
        if not user:
            raise NotFoundAppException("User not found")

        if user.status != UserStatus.active:
            raise AuthenticationAppException("User is not active")

        try:
            old_token, access_token, new_refresh_token = self.auth_token_service.rotate_refresh_token(
                refresh_token=refresh_token,
                user_id=str(user.id),
            )

            self.audit_service.log_action(
                actor_type=LogActorType.user,
                actor_user_id=user.id,
                action="access_token_refreshed",
                resource_type="refresh_token",
                resource_id=old_token.id,
                ip_address=normalized_ip,
                user_agent=user_agent,
                metadata={"user_id": str(user.id), "rotation": True},
            )

            self.db.commit()
            return user, access_token, new_refresh_token

        except Exception:
            self.db.rollback()
            raise

    def logout(
        self,
        *,
        refresh_token: str,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> None:
        normalized_ip = self._normalize_ip(ip_address)

        try:
            stored = self.auth_token_service.validate_refresh_token(refresh_token=refresh_token)
        except ValueError as exc:
            raise AuthenticationAppException(str(exc)) from exc

        try:
            self.user_repo.revoke_refresh_token(
                stored,
                revoked_at=datetime.now(timezone.utc),
            )

            self.audit_service.log_action(
                actor_type=LogActorType.user,
                actor_user_id=stored.user_id,
                action="user_logged_out",
                resource_type="refresh_token",
                resource_id=stored.id,
                ip_address=normalized_ip,
                user_agent=user_agent,
                metadata={"user_id": str(stored.user_id)},
            )

            self.db.commit()

        except Exception:
            self.db.rollback()
            raise

    def logout_all(
        self,
        *,
        user_id: str,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> int:
        normalized_ip = self._normalize_ip(ip_address)

        try:
            count = self.user_repo.revoke_all_refresh_tokens_for_user(
                user_id=user_id,
                revoked_at=datetime.now(timezone.utc),
            )

            self.audit_service.log_action(
                actor_type=LogActorType.user,
                actor_user_id=user_id,
                action="user_logged_out_all_sessions",
                resource_type="refresh_token",
                ip_address=normalized_ip,
                user_agent=user_agent,
                metadata={"revoked_count": count},
            )

            self.db.commit()
            return count

        except Exception:
            self.db.rollback()
            raise