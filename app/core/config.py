from __future__ import annotations

from typing import Literal

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Secure Travel Booking Platform"
    ENVIRONMENT: Literal["development", "test", "production"] = "development"
    DEBUG: bool = True

    SECRET_KEY: str = "change-me-super-secret-key"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/secure_travel_booking"
    PAYMENT_CALLBACK_SECRET: str = "change-me-payment-secret"

    REDIS_URL: str = "redis://localhost:6379/0"

    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_LOGIN_PER_MINUTE: int = 10
    RATE_LIMIT_REGISTER_PER_MINUTE: int = 5
    RATE_LIMIT_REFRESH_PER_MINUTE: int = 20
    RATE_LIMIT_UPLOAD_PER_MINUTE: int = 20
    RATE_LIMIT_PAYMENT_CALLBACK_PER_MINUTE: int = 50
    RATE_LIMIT_DEFAULT_PER_MINUTE: int = 120

    CORS_ORIGINS: str = "http://localhost,http://127.0.0.1"
    TRUSTED_HOSTS: str = "localhost,127.0.0.1,testserver"

    STORAGE_BACKEND: Literal["local"] = "local"

    LOCAL_UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_BYTES: int = 10 * 1024 * 1024

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )

    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "secure_travel_booking"

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        return (
            f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    # DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/secure_travel_booking"

    ALLOWED_UPLOAD_EXTENSIONS: str = ".pdf,.png,.jpg,.jpeg"
    ALLOWED_UPLOAD_MIME_TYPES: str = "application/pdf,image/png,image/jpeg"
    
    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, value: str) -> str:
        if len(value.strip()) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters")
        return value

    @field_validator("PAYMENT_CALLBACK_SECRET")
    @classmethod
    def validate_payment_callback_secret(cls, value: str) -> str:
        if len(value.strip()) < 16:
            raise ValueError("PAYMENT_CALLBACK_SECRET must be at least 16 characters")
        return value

    @field_validator("DATABASE_URL")
    @classmethod
    def validate_database_url(cls, value: str) -> str:
        allowed_prefixes = (
            "postgresql://",
            "postgresql+psycopg2://",
            "sqlite:///",
        )
        if not value.startswith(allowed_prefixes):
            raise ValueError("DATABASE_URL must be a valid SQLAlchemy database URL")
        return value

    @field_validator("REDIS_URL")
    @classmethod
    def validate_redis_url(cls, value: str) -> str:
        if not value.startswith(("redis://", "rediss://")):
            raise ValueError("REDIS_URL must start with redis:// or rediss://")
        return value

    @field_validator("ACCESS_TOKEN_EXPIRE_MINUTES")
    @classmethod
    def validate_access_token_expire_minutes(cls, value: int) -> int:
        if value <= 0:
            raise ValueError("ACCESS_TOKEN_EXPIRE_MINUTES must be > 0")
        return value

    @field_validator("REFRESH_TOKEN_EXPIRE_DAYS")
    @classmethod
    def validate_refresh_token_expire_days(cls, value: int) -> int:
        if value <= 0:
            raise ValueError("REFRESH_TOKEN_EXPIRE_DAYS must be > 0")
        return value

    @field_validator("MAX_UPLOAD_SIZE_BYTES")
    @classmethod
    def validate_upload_size(cls, value: int) -> int:
        if value <= 0:
            raise ValueError("MAX_UPLOAD_SIZE_BYTES must be > 0")
        return value

    @model_validator(mode="after")
    def validate_environment_rules(self):
        if self.ENVIRONMENT == "production":
            weak_secret_values = {
                "change-me-super-secret-key",
                "change-me-payment-secret",
                "secret",
                "changeme",
            }

            if self.DEBUG:
                raise ValueError("DEBUG must be false in production")

            if self.SECRET_KEY in weak_secret_values:
                raise ValueError("SECRET_KEY must not use a default/weak value in production")

            if self.PAYMENT_CALLBACK_SECRET in weak_secret_values:
                raise ValueError("PAYMENT_CALLBACK_SECRET must not use a default/weak value in production")

            if "localhost" in self.DATABASE_URL or "127.0.0.1" in self.DATABASE_URL:
                raise ValueError("DATABASE_URL should not point to localhost in production")

        if self.ENVIRONMENT == "test":
            if self.DEBUG is False:
                # test có thể để false hoặc true đều được, nhưng giữ mềm để không chặn CI
                pass

        return self

    @property
    def cors_origins_list(self) -> list[str]:
        return [item.strip() for item in self.CORS_ORIGINS.split(",") if item.strip()]

    @property
    def trusted_hosts_list(self) -> list[str]:
        return [item.strip() for item in self.TRUSTED_HOSTS.split(",") if item.strip()]

    @property
    def allowed_upload_extensions_list(self) -> list[str]:
        return [item.strip().lower() for item in self.ALLOWED_UPLOAD_EXTENSIONS.split(",") if item.strip()]

    @property
    def allowed_upload_mime_types_list(self) -> list[str]:
        return [item.strip().lower() for item in self.ALLOWED_UPLOAD_MIME_TYPES.split(",") if item.strip()]

settings = Settings()