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
        CORS_ORIGINS="http://localhost,http://127.0.0.1",
        TRUSTED_HOSTS="localhost,127.0.0.1,testserver",
        ALLOWED_UPLOAD_EXTENSIONS=".pdf,.png,.jpg,.jpeg",
        ALLOWED_UPLOAD_MIME_TYPES="application/pdf,image/png,image/jpeg",
    )

    assert settings.ENVIRONMENT == "development"
    assert settings.DEBUG is True
    assert settings.allowed_upload_extensions_list == [".pdf", ".png", ".jpg", ".jpeg"]


def test_settings_reject_short_secret_key():
    with pytest.raises(ValueError, match="SECRET_KEY must be at least 32 characters"):
        Settings(
            SECRET_KEY="short-secret",
            PAYMENT_CALLBACK_SECRET="very-strong-payment-secret",
            DATABASE_URL="sqlite:///./test.db",
            REDIS_URL="redis://localhost:6379/0",
        )


def test_settings_reject_short_payment_callback_secret():
    with pytest.raises(ValueError, match="PAYMENT_CALLBACK_SECRET must be at least 16 characters"):
        Settings(
            SECRET_KEY="this-is-a-very-strong-secret-key-123456",
            PAYMENT_CALLBACK_SECRET="short-secret",
            DATABASE_URL="sqlite:///./test.db",
            REDIS_URL="redis://localhost:6379/0",
        )


def test_settings_reject_invalid_database_url():
    with pytest.raises(ValueError, match="DATABASE_URL must be a valid SQLAlchemy database URL"):
        Settings(
            SECRET_KEY="this-is-a-very-strong-secret-key-123456",
            PAYMENT_CALLBACK_SECRET="very-strong-payment-secret",
            DATABASE_URL="mysql://invalid",
            REDIS_URL="redis://localhost:6379/0",
        )


def test_settings_reject_invalid_redis_url():
    with pytest.raises(ValueError, match="REDIS_URL must start with redis:// or rediss://"):
        Settings(
            SECRET_KEY="this-is-a-very-strong-secret-key-123456",
            PAYMENT_CALLBACK_SECRET="very-strong-payment-secret",
            DATABASE_URL="sqlite:///./test.db",
            REDIS_URL="http://localhost:6379/0",
        )


def test_settings_reject_production_with_debug_true():
    with pytest.raises(ValueError, match="DEBUG must be false in production"):
        Settings(
            ENVIRONMENT="production",
            DEBUG=True,
            SECRET_KEY="this-is-a-very-strong-secret-key-123456",
            PAYMENT_CALLBACK_SECRET="very-strong-payment-secret",
            DATABASE_URL="postgresql+psycopg2://db-user:db-pass@db:5432/secure_travel_booking",
            REDIS_URL="redis://redis:6379/0",
        )


def test_settings_reject_production_with_weak_secret():
    with pytest.raises(ValueError, match="SECRET_KEY must not use a default/weak value in production"):
        Settings(
            ENVIRONMENT="production",
            DEBUG=False,
            SECRET_KEY="change-me-super-secret-key",
            PAYMENT_CALLBACK_SECRET="very-strong-payment-secret",
            DATABASE_URL="postgresql+psycopg2://db-user:db-pass@db:5432/secure_travel_booking",
            REDIS_URL="redis://redis:6379/0",
        )


def test_settings_reject_production_localhost_database():
    with pytest.raises(ValueError, match="DATABASE_URL should not point to localhost in production"):
        Settings(
            ENVIRONMENT="production",
            DEBUG=False,
            SECRET_KEY="this-is-a-very-strong-secret-key-123456",
            PAYMENT_CALLBACK_SECRET="very-strong-payment-secret",
            DATABASE_URL="postgresql+psycopg2://postgres:postgres@localhost:5432/secure_travel_booking",
            REDIS_URL="redis://redis:6379/0",
        )