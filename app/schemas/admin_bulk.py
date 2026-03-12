from pydantic import BaseModel, Field


class BulkIdsRequest(BaseModel):
    ids: list[str] = Field(min_length=1, max_length=100)


class BulkRefundUpdateRequest(BaseModel):
    refund_ids: list[str] = Field(min_length=1, max_length=100)
    status: str = Field(pattern="^(processed|failed|cancelled)$")
    reason: str | None = Field(default=None, max_length=500)


class BulkActionItemResult(BaseModel):
    id: str
    success: bool
    message: str


class BulkActionResponse(BaseModel):
    total_requested: int
    success_count: int
    failed_count: int
    results: list[BulkActionItemResult]