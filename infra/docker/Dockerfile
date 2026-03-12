FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml /app/
COPY README.md /app/
COPY app /app/app
COPY alembic /app/alembic
COPY alembic.ini /app/
COPY scripts /app/scripts
COPY tests /app/tests
COPY infra /app/infra
COPY docs /app/docs
COPY security /app/security
COPY Makefile /app/

RUN pip install --upgrade pip && pip install -e .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]