from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.enums import LogActorType
from app.repositories.audit_repository import AuditRepository
from app.schemas.user import UserResponse
from app.services.audit_service import AuditService

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
def get_me(
    request: Request,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserResponse:
    audit_service = AuditService(AuditRepository(db))
    audit_service.log_action(
        actor_type=LogActorType.user,
        actor_user_id=current_user.id,
        action="user_profile_viewed",
        resource_type="user",
        resource_id=current_user.id,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata={"endpoint": "/users/me"},
    )
    db.commit()

    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        username=current_user.username,
        full_name=current_user.full_name,
        status=current_user.status.value if hasattr(current_user.status, "value") else str(current_user.status),
    )