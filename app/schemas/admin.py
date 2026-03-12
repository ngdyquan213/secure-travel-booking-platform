from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, EmailStr


class AdminUserResponse(BaseModel):
    id: str
    email: EmailStr
    username: str | None = None
    full_name: str
    status: str


class AdminBookingResponse(BaseModel):
    id: str
    booking_code: str
    user_id: str
    status: str
    total_final_amount: Decimal
    currency: str
    payment_status: str
    booked_at: datetime


class AdminPaymentResponse(BaseModel):
    id: str
    booking_id: str
    payment_method: str
    status: str
    amount: Decimal
    currency: str
    gateway_order_ref: str | None = None
    gateway_transaction_ref: str | None = None
    created_at: datetime


class AdminAuditLogResponse(BaseModel):
    id: str
    actor_type: str
    actor_user_id: str | None = None
    action: str
    resource_type: str
    resource_id: str | None = None
    ip_address: str | None = None
    user_agent: str | None = None
    created_at: datetime