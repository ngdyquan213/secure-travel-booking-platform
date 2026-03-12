from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class AdminRefundResponse(BaseModel):
    id: str
    payment_id: str
    amount: Decimal
    currency: str
    status: str
    reason: str | None = None
    processed_at: datetime | None = None
    created_at: datetime


class AdminRefundUpdateRequest(BaseModel):
    status: str = Field(pattern="^(processed|failed|cancelled)$")
    reason: str | None = Field(default=None, max_length=500)