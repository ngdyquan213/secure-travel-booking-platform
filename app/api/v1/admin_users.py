from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.api.deps import get_pagination_params, require_admin
from app.core.database import get_db
from app.models.enums import LogActorType
from app.repositories.admin_repository import AdminRepository
from app.repositories.audit_repository import AuditRepository
from app.repositories.user_repository import UserRepository
from app.schemas.admin import AdminUserResponse
from app.schemas.common import PaginatedResponse
from app.services.admin_service import AdminService
from app.services.audit_service import AuditService
from app.utils.pagination import PaginationParams, build_paginated_response

router = APIRouter(prefix="/admin", tags=["admin-users"])


@router.get("/users", response_model=PaginatedResponse)
def list_users(
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
):
    user_repo = UserRepository(db)
    service = AdminService(
        user_repo=user_repo,
        admin_repo=AdminRepository(db),
    )
    audit_service = AuditService(AuditRepository(db))

    users = service.list_users(skip=pagination.offset, limit=pagination.limit)
    total = user_repo.count_users()

    audit_service.log_action(
        actor_type=LogActorType.admin,
        actor_user_id=current_user.id,
        action="admin_list_users",
        resource_type="user",
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata={
            "page": pagination.page,
            "page_size": pagination.page_size,
            "result_count": len(users),
        },
    )
    db.commit()

    items = [
        AdminUserResponse(
            id=str(u.id),
            email=u.email,
            username=u.username,
            full_name=u.full_name,
            status=u.status.value if hasattr(u.status, "value") else str(u.status),
        ).model_dump()
        for u in users
    ]

    return build_paginated_response(
        items=items,
        page=pagination.page,
        page_size=pagination.page_size,
        total=total,
    )