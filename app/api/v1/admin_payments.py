from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.api.deps import get_pagination_params, require_admin
from app.core.database import get_db
from app.models.enums import LogActorType
from app.repositories.admin_repository import AdminRepository
from app.repositories.audit_repository import AuditRepository
from app.repositories.user_repository import UserRepository
from app.schemas.admin import AdminAuditLogResponse, AdminPaymentResponse
from app.schemas.common import PaginatedResponse
from app.services.admin_service import AdminService
from app.services.audit_service import AuditService
from app.utils.pagination import PaginationParams, build_paginated_response

router = APIRouter(prefix="/admin", tags=["admin-payments"])


@router.get("/payments", response_model=PaginatedResponse)
def list_payments(
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
):
    admin_repo = AdminRepository(db)
    service = AdminService(
        user_repo=UserRepository(db),
        admin_repo=admin_repo,
    )
    audit_service = AuditService(AuditRepository(db))

    payments = service.list_payments(skip=pagination.offset, limit=pagination.limit)
    total = admin_repo.count_payments()

    audit_service.log_action(
        actor_type=LogActorType.admin,
        actor_user_id=current_user.id,
        action="admin_list_payments",
        resource_type="payment",
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata={
            "page": pagination.page,
            "page_size": pagination.page_size,
            "result_count": len(payments),
        },
    )
    db.commit()

    items = [
        AdminPaymentResponse(
            id=str(p.id),
            booking_id=str(p.booking_id),
            payment_method=p.payment_method.value if hasattr(p.payment_method, "value") else str(p.payment_method),
            status=p.status.value if hasattr(p.status, "value") else str(p.status),
            amount=p.amount,
            currency=p.currency,
            gateway_order_ref=p.gateway_order_ref,
            gateway_transaction_ref=p.gateway_transaction_ref,
            created_at=p.created_at,
        ).model_dump()
        for p in payments
    ]

    return build_paginated_response(
        items=items,
        page=pagination.page,
        page_size=pagination.page_size,
        total=total,
    )


@router.get("/audit-logs", response_model=PaginatedResponse)
def list_audit_logs(
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
):
    admin_repo = AdminRepository(db)
    service = AdminService(
        user_repo=UserRepository(db),
        admin_repo=admin_repo,
    )
    audit_service = AuditService(AuditRepository(db))

    logs = service.list_audit_logs(skip=pagination.offset, limit=pagination.limit)
    total = admin_repo.count_audit_logs()

    audit_service.log_action(
        actor_type=LogActorType.admin,
        actor_user_id=current_user.id,
        action="admin_list_audit_logs",
        resource_type="audit_log",
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata={
            "page": pagination.page,
            "page_size": pagination.page_size,
            "result_count": len(logs),
        },
    )
    db.commit()

    items = [
        AdminAuditLogResponse(
            id=str(log.id),
            actor_type=log.actor_type.value if hasattr(log.actor_type, "value") else str(log.actor_type),
            actor_user_id=str(log.actor_user_id) if log.actor_user_id else None,
            action=log.action,
            resource_type=log.resource_type,
            resource_id=str(log.resource_id) if log.resource_id else None,
            ip_address=log.ip_address,
            user_agent=log.user_agent,
            created_at=log.created_at,
        ).model_dump()
        for log in logs
    ]

    return build_paginated_response(
        items=items,
        page=pagination.page,
        page_size=pagination.page_size,
        total=total,
    )