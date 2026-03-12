from fastapi import APIRouter, Depends, Header, Request, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.repositories.audit_repository import AuditRepository
from app.repositories.booking_repository import BookingRepository
from app.repositories.payment_repository import PaymentRepository
from app.schemas.payment import (
    PaymentCallbackRequest,
    PaymentInitiateRequest,
    PaymentResponse,
)
from app.services.audit_service import AuditService
from app.services.payment_callback_service import PaymentCallbackService
from app.services.payment_service import PaymentService
from app.utils.response_mappers import payment_to_dict

router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("/initiate", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
def initiate_payment(
    payload: PaymentInitiateRequest,
    request: Request,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
) -> PaymentResponse:
    audit_service = AuditService(AuditRepository(db))
    service = PaymentService(
        db=db,
        booking_repo=BookingRepository(db),
        payment_repo=PaymentRepository(db),
        audit_service=audit_service,
    )

    payment = service.initiate_payment(
        booking_id=payload.booking_id,
        user_id=str(current_user.id),
        payment_method=payload.payment_method,
        idempotency_key=idempotency_key,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )

    return PaymentResponse(**payment_to_dict(payment))


@router.post("/callback", response_model=PaymentResponse)
def payment_callback(
    payload: PaymentCallbackRequest,
    request: Request,
    db: Session = Depends(get_db),
) -> PaymentResponse:
    audit_service = AuditService(AuditRepository(db))
    service = PaymentCallbackService(
        db=db,
        booking_repo=BookingRepository(db),
        payment_repo=PaymentRepository(db),
        audit_service=audit_service,
    )

    payment, _booking = service.process_callback(
        gateway_name=payload.gateway_name,
        gateway_order_ref=payload.gateway_order_ref,
        gateway_transaction_ref=payload.gateway_transaction_ref,
        amount=str(payload.amount),
        currency=payload.currency,
        status=payload.status,
        signature=payload.signature,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )

    return PaymentResponse(**payment_to_dict(payment))