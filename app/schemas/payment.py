from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class PaymentInitiateRequest(BaseModel):
    booking_id: str
    payment_method: str


class PaymentResponse(BaseModel):
    id: str
    booking_id: str
    payment_method: str
    status: str
    amount: Decimal
    currency: str
    gateway_order_ref: str | None = None
    gateway_transaction_ref: str | None = None
    paid_at: datetime | None = None


class PaymentStatusResponse(BaseModel):
    booking_id: str
    booking_payment_status: str
    payment: PaymentResponse | None = None


class PaymentCallbackRequest(BaseModel):
    gateway_name: str
    gateway_order_ref: str
    gateway_transaction_ref: str
    amount: Decimal
    currency: str
    status: str
    signature: str


class PaymentCallbackResponse(BaseModel):
    success: bool
    message: str

class PaymentInitiateRequest(BaseModel):
    booking_id: str
    payment_method: str


class PaymentResponse(BaseModel):
    id: str
    booking_id: str
    payment_method: str
    status: str
    amount: Decimal
    currency: str
    gateway_order_ref: str | None = None
    gateway_transaction_ref: str | None = None
    paid_at: datetime | None = None


class PaymentStatusResponse(BaseModel):
    booking_id: str
    booking_payment_status: str
    payment: PaymentResponse | None = None


class PaymentCallbackRequest(BaseModel):
    gateway_name: str
    gateway_order_ref: str
    gateway_transaction_ref: str
    amount: Decimal
    currency: str
    status: str
    signature: str


class PaymentCallbackResponse(BaseModel):
    success: bool
    message: str