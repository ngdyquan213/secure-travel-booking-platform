API_V1_PREFIX = "/api/v1"

DEFAULT_PAGE = 1
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100

SUPPORTED_PAYMENT_METHODS = {"vnpay", "momo", "stripe", "manual"}
SUPPORTED_DOCUMENT_TYPES = {"passport", "visa", "national_id", "invoice", "other"}

BOOKABLE_FLIGHT_STATUSES = {"scheduled"}
ALLOWED_PAYMENT_CALLBACK_STATUSES = {"paid", "failed"}

REQUEST_ID_HEADER = "X-Request-ID"
IDEMPOTENCY_KEY_HEADER = "Idempotency-Key"