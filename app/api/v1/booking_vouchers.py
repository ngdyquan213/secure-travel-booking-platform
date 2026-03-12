from fastapi import APIRouter, Depends, Request, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.repositories.audit_repository import AuditRepository
from app.repositories.booking_repository import BookingRepository
from app.repositories.document_repository import DocumentRepository
from app.schemas.document import DocumentResponse
from app.schemas.voucher import BookingVoucherResponse, VoucherItemResponse, VoucherTravelerResponse
from app.services.audit_service import AuditService
from app.services.voucher_service import VoucherService
from app.utils.response_mappers import (
    booking_voucher_to_dict,
    document_to_dict,
    voucher_item_to_dict,
    voucher_traveler_to_dict,
)

router = APIRouter(prefix="/bookings", tags=["booking-vouchers"])


@router.get("/{booking_id}/voucher", response_model=BookingVoucherResponse)
def get_booking_voucher(
    booking_id: str,
    request: Request,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
) -> BookingVoucherResponse:
    audit_service = AuditService(AuditRepository(db))
    service = VoucherService(
        booking_repo=BookingRepository(db),
        audit_service=audit_service,
        document_repo=DocumentRepository(db),
    )

    booking = service.get_my_booking_voucher(
        booking_id=booking_id,
        user_id=str(current_user.id),
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )

    voucher_type = service._resolve_voucher_type(booking)

    items = []
    for item in booking.items:
        reference_id, title, description = service._build_item_title_and_description(item)
        items.append(
            voucher_item_to_dict(
                item,
                reference_id=reference_id,
                title=title,
                description=description,
            )
        )

    travelers = [voucher_traveler_to_dict(t) for t in booking.travelers]

    return BookingVoucherResponse(
        **booking_voucher_to_dict(
            booking,
            voucher_type=voucher_type,
            items=items,
            travelers=travelers,
        )
    )


@router.get("/{booking_id}/voucher.pdf")
def export_booking_voucher_pdf(
    booking_id: str,
    request: Request,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    audit_service = AuditService(AuditRepository(db))
    service = VoucherService(
        booking_repo=BookingRepository(db),
        audit_service=audit_service,
        document_repo=DocumentRepository(db),
    )

    pdf_bytes, filename = service.export_my_booking_voucher_pdf(
        booking_id=booking_id,
        user_id=str(current_user.id),
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )
    db.commit()

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.post("/{booking_id}/voucher/generate", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
def generate_booking_voucher_document(
    booking_id: str,
    request: Request,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DocumentResponse:
    audit_service = AuditService(AuditRepository(db))
    service = VoucherService(
        booking_repo=BookingRepository(db),
        audit_service=audit_service,
        document_repo=DocumentRepository(db),
    )

    document = service.generate_and_store_my_booking_voucher(
        booking_id=booking_id,
        user_id=str(current_user.id),
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )
    db.commit()
    db.refresh(document)

    return DocumentResponse(**document_to_dict(document))