from __future__ import annotations


def enum_to_str(value):
    if value is None:
        return None
    return value.value if hasattr(value, "value") else str(value)


def booking_to_dict(booking) -> dict:
    return {
        "id": str(booking.id),
        "booking_code": booking.booking_code,
        "user_id": str(booking.user_id),
        "status": enum_to_str(booking.status),
        "total_base_amount": booking.total_base_amount,
        "total_discount_amount": booking.total_discount_amount,
        "total_final_amount": booking.total_final_amount,
        "currency": booking.currency,
        "payment_status": enum_to_str(booking.payment_status),
        "booked_at": booking.booked_at,
    }


def payment_to_dict(payment) -> dict:
    return {
        "id": str(payment.id),
        "booking_id": str(payment.booking_id) if payment.booking_id else None,
        "payment_method": enum_to_str(payment.payment_method),
        "status": enum_to_str(payment.status),
        "amount": payment.amount,
        "currency": payment.currency,
        "gateway_order_ref": payment.gateway_order_ref,
        "gateway_transaction_ref": payment.gateway_transaction_ref,
        "created_at": payment.created_at,
    }


def refund_to_dict(refund) -> dict:
    return {
        "id": str(refund.id),
        "payment_id": str(refund.payment_id),
        "amount": refund.amount,
        "currency": refund.currency,
        "status": enum_to_str(refund.status),
        "reason": refund.reason,
        "processed_at": refund.processed_at,
        "created_at": refund.created_at,
    }


def document_to_dict(document) -> dict:
    return {
        "id": str(document.id),
        "user_id": str(document.user_id),
        "booking_id": str(document.booking_id) if document.booking_id else None,
        "traveler_id": str(document.traveler_id) if document.traveler_id else None,
        "document_type": enum_to_str(document.document_type),
        "original_filename": document.original_filename,
        "stored_filename": document.stored_filename,
        "mime_type": document.mime_type,
        "file_size": document.file_size,
        "storage_bucket": document.storage_bucket,
        "storage_key": document.storage_key,
        "is_private": document.is_private,
        "uploaded_at": document.uploaded_at,
    }


def traveler_to_dict(traveler) -> dict:
    return {
        "id": str(traveler.id),
        "booking_id": str(traveler.booking_id),
        "full_name": traveler.full_name,
        "traveler_type": enum_to_str(traveler.traveler_type),
        "date_of_birth": traveler.date_of_birth,
        "passport_number": traveler.passport_number,
        "nationality": traveler.nationality,
        "document_type": enum_to_str(traveler.document_type),
    }


def admin_booking_to_dict(booking) -> dict:
    return {
        "id": str(booking.id),
        "booking_code": booking.booking_code,
        "user_id": str(booking.user_id),
        "status": enum_to_str(booking.status),
        "total_final_amount": booking.total_final_amount,
        "currency": booking.currency,
        "payment_status": enum_to_str(booking.payment_status),
        "booked_at": booking.booked_at,
    }


def admin_refund_to_dict(refund) -> dict:
    return refund_to_dict(refund)


def voucher_item_to_dict(item, *, reference_id: str | None, title: str, description: str | None) -> dict:
    return {
        "item_type": enum_to_str(item.item_type),
        "reference_id": reference_id,
        "title": title,
        "description": description,
        "quantity": item.quantity,
        "unit_price": item.unit_price,
        "total_price": item.total_price,
        "check_in_date": item.check_in_date,
        "check_out_date": item.check_out_date,
    }


def voucher_traveler_to_dict(traveler) -> dict:
    return {
        "full_name": traveler.full_name,
        "traveler_type": enum_to_str(traveler.traveler_type),
        "passport_number": traveler.passport_number,
        "nationality": traveler.nationality,
        "document_type": enum_to_str(traveler.document_type),
    }


def booking_voucher_to_dict(
    booking,
    *,
    voucher_type: str,
    items: list[dict],
    travelers: list[dict],
) -> dict:
    return {
        "booking_id": str(booking.id),
        "booking_code": booking.booking_code,
        "booking_status": enum_to_str(booking.status),
        "payment_status": enum_to_str(booking.payment_status),
        "booked_at": booking.booked_at,
        "customer_name": booking.user.full_name if booking.user else "Unknown",
        "customer_email": booking.user.email if booking.user else "unknown@example.com",
        "currency": booking.currency,
        "total_base_amount": booking.total_base_amount,
        "total_discount_amount": booking.total_discount_amount,
        "total_final_amount": booking.total_final_amount,
        "voucher_type": voucher_type,
        "items": items,
        "travelers": travelers,
        "notes": booking.notes,
    }