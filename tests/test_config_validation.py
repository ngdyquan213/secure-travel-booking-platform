import pytest

from app.core.config import Settings


def test_settings_accept_valid_development_config():
    settings = Settings(
        APP_NAME="Secure Travel Booking Platform",
        ENVIRONMENT="development",
        DEBUG=True,
        SECRET_KEY="this-is-a-very-strong-secret-key-123456",
        JWT_ALGORITHM="HS256",
        ACCESS_TOKEN_EXPIRE_MINUTES=30,
        REFRESH_TOKEN_EXPIRE_DAYS=7,
        DATABASE_URL="postgresql+psycopg2://postgres:postgres@localhost:5432/secure_travel_booking",
        PAYMENT_CALLBACK_SECRET="very-strong-payment-secret",
        REDIS_URL="redis://localhost:6379/0",
        RATE_LIMIT_ENABLED=True,
        LOCAL_UPLOAD_DIR="uploads",
        MAX_UPLOAD_SIZE_BYTES=10485760,
        OUTBOX_LEASE_SECONDS=30,
        RUNTIME_MAINTENANCE_INTERVAL_SECONDS=60,
        CORS_ORIGINS="http://localhost,http://127.0.0.1",
        TRUSTED_HOSTS="localhost,127.0.0.1,testserver",
        FORWARDED_ALLOW_IPS="127.0.0.1,172.16.0.0/12",
        PAYMENT_CALLBACK_SOURCE_ALLOWLIST="127.0.0.1/32",
        ALLOWED_UPLOAD_EXTENSIONS=".pdf,.png,.jpg,.jpeg",
        ALLOWED_UPLOAD_MIME_TYPES="application/pdf,image/png,image/jpeg",
        ALLOW_PAYMENT_SIMULATION=False,
    )

    assert settings.ENVIRONMENT == "development"
    assert settings.DEBUG is True
    assert settings.allowed_upload_extensions_list == [".pdf", ".png", ".jpg", ".jpeg"]


def test_settings_build_database_url_from_postgres_fields_when_database_url_not_provided():
    settings = Settings(
        SECRET_KEY="this-is-a-very-strong-secret-key-123456",
        PAYMENT_CALLBACK_SECRET="very-strong-payment-secret",
        REDIS_URL="redis://localhost:6379/0",
        POSTGRES_SERVER="postgres",
        POSTGRES_PORT=5432,
        POSTGRES_USER="postgres",
        POSTGRES_PASSWORD="postgres",
        POSTGRES_DB="secure_travel_booking",
    )

    assert (
        settings.DATABASE_URL
        == "postgresql+psycopg2://postgres:postgres@postgres:5432/secure_travel_booking"
    )
    assert settings.SQLALCHEMY_DATABASE_URI == settings.DATABASE_URL


def test_settings_reject_short_secret_key():
    with pytest.raises(ValueError, match="SECRET_KEY must be at least 32 characters"):
        Settings(
            SECRET_KEY="short-secret",
            PAYMENT_CALLBACK_SECRET="very-strong-payment-secret",
            DATABASE_URL="sqlite:///./test.db",
            REDIS_URL="redis://localhost:6379/0",
            OUTBOX_LEASE_SECONDS=30,
            RUNTIME_MAINTENANCE_INTERVAL_SECONDS=60,
        )


def test_settings_reject_short_payment_callback_secret():
    with pytest.raises(ValueError, match="PAYMENT_CALLBACK_SECRET must be at least 16 characters"):
        Settings(
            SECRET_KEY="this-is-a-very-strong-secret-key-123456",
            PAYMENT_CALLBACK_SECRET="short-secret",
            DATABASE_URL="sqlite:///./test.db",
            REDIS_URL="redis://localhost:6379/0",
            OUTBOX_LEASE_SECONDS=30,
            RUNTIME_MAINTENANCE_INTERVAL_SECONDS=60,
        )


def test_settings_reject_invalid_database_url():
    with pytest.raises(ValueError, match="DATABASE_URL must be a valid SQLAlchemy database URL"):
        Settings(
            SECRET_KEY="this-is-a-very-strong-secret-key-123456",
            PAYMENT_CALLBACK_SECRET="very-strong-payment-secret",
            DATABASE_URL="mysql://invalid",
            REDIS_URL="redis://localhost:6379/0",
            OUTBOX_LEASE_SECONDS=30,
            RUNTIME_MAINTENANCE_INTERVAL_SECONDS=60,
        )


def test_settings_reject_invalid_redis_url():
    with pytest.raises(ValueError, match="REDIS_URL must start with redis:// or rediss://"):
        Settings(
            SECRET_KEY="this-is-a-very-strong-secret-key-123456",
            PAYMENT_CALLBACK_SECRET="very-strong-payment-secret",
            DATABASE_URL="sqlite:///./test.db",
            REDIS_URL="http://localhost:6379/0",
            OUTBOX_LEASE_SECONDS=30,
            RUNTIME_MAINTENANCE_INTERVAL_SECONDS=60,
        )


def test_settings_reject_production_with_debug_true():
    with pytest.raises(ValueError, match="DEBUG must be false in staging/production"):
        Settings(
            ENVIRONMENT="production",
            DEBUG=True,
            SECRET_KEY="this-is-a-very-strong-secret-key-123456",
            PAYMENT_CALLBACK_SECRET="very-strong-payment-secret",
            DATABASE_URL="postgresql+psycopg2://db-user:db-pass@db:5432/secure_travel_booking",
            REDIS_URL="redis://redis:6379/0",
            OUTBOX_LEASE_SECONDS=30,
            RUNTIME_MAINTENANCE_INTERVAL_SECONDS=60,
        )


def test_settings_reject_production_with_weak_secret():
    with pytest.raises(
        ValueError,
        match="SECRET_KEY must not use a default/weak value in staging/production",
    ):
        Settings(
            ENVIRONMENT="production",
            DEBUG=False,
            SECRET_KEY="change-me-super-secret-key",
            PAYMENT_CALLBACK_SECRET="very-strong-payment-secret",
            DATABASE_URL="postgresql+psycopg2://db-user:db-pass@db:5432/secure_travel_booking",
            REDIS_URL="redis://redis:6379/0",
            OUTBOX_LEASE_SECONDS=30,
            RUNTIME_MAINTENANCE_INTERVAL_SECONDS=60,
        )


def test_settings_reject_production_localhost_database():
    with pytest.raises(
        ValueError,
        match="DATABASE_URL should not point to localhost in staging/production",
    ):
        Settings(
            ENVIRONMENT="production",
            DEBUG=False,
            SECRET_KEY="this-is-a-very-strong-secret-key-123456",
            PAYMENT_CALLBACK_SECRET="very-strong-payment-secret",
            DATABASE_URL="postgresql+psycopg2://postgres:postgres@localhost:5432/secure_travel_booking",
            REDIS_URL="redis://redis:6379/0",
            OUTBOX_LEASE_SECONDS=30,
            RUNTIME_MAINTENANCE_INTERVAL_SECONDS=60,
        )


def test_settings_reject_production_payment_simulation():
    with pytest.raises(
        ValueError,
        match="ALLOW_PAYMENT_SIMULATION must be false in staging/production",
    ):
        Settings(
            ENVIRONMENT="production",
            DEBUG=False,
            SECRET_KEY="this-is-a-very-strong-secret-key-123456",
            PAYMENT_CALLBACK_SECRET="very-strong-payment-secret",
            DATABASE_URL="postgresql+psycopg2://db-user:db-pass@db:5432/secure_travel_booking",
            REDIS_URL="redis://redis:6379/0",
            OUTBOX_LEASE_SECONDS=30,
            RUNTIME_MAINTENANCE_INTERVAL_SECONDS=60,
            ALLOW_PAYMENT_SIMULATION=True,
        )


def test_settings_accept_valid_staging_config():
    settings = Settings(
        ENVIRONMENT="staging",
        DEBUG=False,
        SECRET_KEY="staging-secret-key-12345678901234567890",
        PAYMENT_CALLBACK_SECRET="staging-payment-secret-123456",
        DATABASE_URL="postgresql+psycopg2://db-user:db-pass@postgres:5432/secure_travel_booking",
        REDIS_URL="redis://redis:6379/0",
        OUTBOX_LEASE_SECONDS=30,
        EMAIL_WORKER_BACKEND="smtp",
        SMTP_HOST="smtp.internal",
        SMTP_FROM_EMAIL="no-reply@example.com",
        NOTIFICATION_WORKER_BACKEND="redis",
        FORWARDED_ALLOW_IPS="127.0.0.1,172.16.0.0/12",
        PAYMENT_CALLBACK_SOURCE_ALLOWLIST="10.10.0.0/16,203.0.113.10/32",
        RUNTIME_MAINTENANCE_INTERVAL_SECONDS=60,
        ALLOW_PAYMENT_SIMULATION=False,
        CORS_ORIGINS="https://staging.example.com",
        TRUSTED_HOSTS="staging.example.com",
    )

    assert settings.ENVIRONMENT == "staging"
    assert settings.DEBUG is False


def test_settings_reject_staging_localhost_redis():
    with pytest.raises(
        ValueError, match="REDIS_URL should not point to localhost in staging/production"
    ):
        Settings(
            ENVIRONMENT="staging",
            DEBUG=False,
            SECRET_KEY="staging-secret-key-12345678901234567890",
            PAYMENT_CALLBACK_SECRET="staging-payment-secret-123456",
            DATABASE_URL="postgresql+psycopg2://db-user:db-pass@postgres:5432/secure_travel_booking",
            REDIS_URL="redis://localhost:6379/0",
            OUTBOX_LEASE_SECONDS=30,
            RUNTIME_MAINTENANCE_INTERVAL_SECONDS=60,
            ALLOW_PAYMENT_SIMULATION=False,
            PAYMENT_CALLBACK_SOURCE_ALLOWLIST="10.10.0.0/16",
        )


def test_settings_reject_smtp_worker_without_required_fields():
    with pytest.raises(
        ValueError,
        match="Missing required SMTP settings for EMAIL_WORKER_BACKEND=smtp",
    ):
        Settings(
            SECRET_KEY="this-is-a-very-strong-secret-key-123456",
            PAYMENT_CALLBACK_SECRET="very-strong-payment-secret",
            DATABASE_URL="sqlite:///./test.db",
            REDIS_URL="redis://localhost:6379/0",
            EMAIL_WORKER_BACKEND="smtp",
            OUTBOX_LEASE_SECONDS=30,
            RUNTIME_MAINTENANCE_INTERVAL_SECONDS=60,
        )


def test_settings_reject_non_positive_runtime_maintenance_interval():
    with pytest.raises(
        ValueError, match="RUNTIME_MAINTENANCE_INTERVAL_SECONDS must be > 0"
    ):
        Settings(
            SECRET_KEY="this-is-a-very-strong-secret-key-123456",
            PAYMENT_CALLBACK_SECRET="very-strong-payment-secret",
            DATABASE_URL="sqlite:///./test.db",
            REDIS_URL="redis://localhost:6379/0",
            OUTBOX_LEASE_SECONDS=30,
            RUNTIME_MAINTENANCE_INTERVAL_SECONDS=0,
        )


def test_settings_reject_non_positive_outbox_lease_seconds():
    with pytest.raises(ValueError, match="OUTBOX_LEASE_SECONDS must be > 0"):
        Settings(
            SECRET_KEY="this-is-a-very-strong-secret-key-123456",
            PAYMENT_CALLBACK_SECRET="very-strong-payment-secret",
            DATABASE_URL="sqlite:///./test.db",
            REDIS_URL="redis://localhost:6379/0",
            OUTBOX_LEASE_SECONDS=0,
            RUNTIME_MAINTENANCE_INTERVAL_SECONDS=60,
        )


def test_settings_reject_staging_forwarded_allow_ips_wildcard():
    with pytest.raises(
        ValueError, match="FORWARDED_ALLOW_IPS must not contain '\\*' in staging/production"
    ):
        Settings(
            ENVIRONMENT="staging",
            DEBUG=False,
            SECRET_KEY="staging-secret-key-12345678901234567890",
            PAYMENT_CALLBACK_SECRET="staging-payment-secret-123456",
            DATABASE_URL="postgresql+psycopg2://db-user:db-pass@postgres:5432/secure_travel_booking",
            REDIS_URL="redis://redis:6379/0",
            FORWARDED_ALLOW_IPS="*",
            OUTBOX_LEASE_SECONDS=30,
            RUNTIME_MAINTENANCE_INTERVAL_SECONDS=60,
            ALLOW_PAYMENT_SIMULATION=False,
            EMAIL_WORKER_BACKEND="smtp",
            SMTP_HOST="smtp.internal",
            SMTP_FROM_EMAIL="no-reply@example.com",
            NOTIFICATION_WORKER_BACKEND="redis",
            PAYMENT_CALLBACK_SOURCE_ALLOWLIST="10.10.0.0/16",
        )


def test_settings_reject_staging_mock_email_worker():
    with pytest.raises(
        ValueError,
        match="EMAIL_WORKER_BACKEND must not use 'mock' in staging/production",
    ):
        Settings(
            ENVIRONMENT="staging",
            DEBUG=False,
            SECRET_KEY="staging-secret-key-12345678901234567890",
            PAYMENT_CALLBACK_SECRET="staging-payment-secret-123456",
            DATABASE_URL="postgresql+psycopg2://db-user:db-pass@postgres:5432/secure_travel_booking",
            REDIS_URL="redis://redis:6379/0",
            OUTBOX_LEASE_SECONDS=30,
            RUNTIME_MAINTENANCE_INTERVAL_SECONDS=60,
            ALLOW_PAYMENT_SIMULATION=False,
            NOTIFICATION_WORKER_BACKEND="redis",
            PAYMENT_CALLBACK_SOURCE_ALLOWLIST="10.10.0.0/16",
        )


def test_settings_reject_staging_mock_notification_worker():
    with pytest.raises(
        ValueError,
        match="NOTIFICATION_WORKER_BACKEND must not use 'mock' in staging/production",
    ):
        Settings(
            ENVIRONMENT="staging",
            DEBUG=False,
            SECRET_KEY="staging-secret-key-12345678901234567890",
            PAYMENT_CALLBACK_SECRET="staging-payment-secret-123456",
            DATABASE_URL="postgresql+psycopg2://db-user:db-pass@postgres:5432/secure_travel_booking",
            REDIS_URL="redis://redis:6379/0",
            OUTBOX_LEASE_SECONDS=30,
            RUNTIME_MAINTENANCE_INTERVAL_SECONDS=60,
            ALLOW_PAYMENT_SIMULATION=False,
            EMAIL_WORKER_BACKEND="smtp",
            SMTP_HOST="smtp.internal",
            SMTP_FROM_EMAIL="no-reply@example.com",
            PAYMENT_CALLBACK_SOURCE_ALLOWLIST="10.10.0.0/16",
        )


def test_settings_reject_staging_without_payment_callback_allowlist():
    with pytest.raises(
        ValueError,
        match="PAYMENT_CALLBACK_SOURCE_ALLOWLIST must not be empty in staging/production",
    ):
        Settings(
            ENVIRONMENT="staging",
            DEBUG=False,
            SECRET_KEY="staging-secret-key-12345678901234567890",
            PAYMENT_CALLBACK_SECRET="staging-payment-secret-123456",
            DATABASE_URL="postgresql+psycopg2://db-user:db-pass@postgres:5432/secure_travel_booking",
            REDIS_URL="redis://redis:6379/0",
            OUTBOX_LEASE_SECONDS=30,
            RUNTIME_MAINTENANCE_INTERVAL_SECONDS=60,
            ALLOW_PAYMENT_SIMULATION=False,
            EMAIL_WORKER_BACKEND="smtp",
            SMTP_HOST="smtp.internal",
            SMTP_FROM_EMAIL="no-reply@example.com",
            NOTIFICATION_WORKER_BACKEND="redis",
        )


def test_settings_require_secret_manager_provider_when_enabled():
    with pytest.raises(
        ValueError,
        match="SECRET_MANAGER_PROVIDER is required when SECRET_SOURCE=secret_manager",
    ):
        Settings(
            SECRET_KEY="this-is-a-very-strong-secret-key-123456",
            PAYMENT_CALLBACK_SECRET="very-strong-payment-secret",
            DATABASE_URL="sqlite:///./test.db",
            REDIS_URL="redis://localhost:6379/0",
            OUTBOX_LEASE_SECONDS=30,
            RUNTIME_MAINTENANCE_INTERVAL_SECONDS=60,
            SECRET_SOURCE="secret_manager",
        )
