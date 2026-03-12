.PHONY: install dev migrate makemigrations seed seed-coupons create-admin test lint security up down logs

install:
	pip install --upgrade pip
	pip install -e .
	pip install pytest ruff bandit pip-audit

dev:
	uvicorn app.main:app --reload

migrate:
	alembic upgrade head

makemigrations:
	alembic revision --autogenerate -m "$(m)"

seed:
	python scripts/seed_data.py

seed-coupons:
	python scripts/seed_coupons.py

create-admin:
	python scripts/create_admin.py

test:
	pytest -q

lint:
	ruff check app tests scripts

security:
	bandit -r app -x tests
	pip-audit

up:
	docker compose -f infra/docker/docker-compose.yml up --build

down:
	docker compose -f infra/docker/docker-compose.yml down

logs:
	docker compose -f infra/docker/docker-compose.yml logs -f


up-test-db:
	docker compose -f infra/docker/docker-compose.test.yml up -d

down-test-db:
	docker compose -f infra/docker/docker-compose.test.yml down

test-postgres:
	TEST_DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5433/secure_travel_booking_test pytest -q -m postgres tests/test_postgres_smoke.py tests/test_postgres_coupon_json.py

.PHONY: install dev up down logs restart migrate makemigrations seed test lint security up-test-db down-test-db test-postgres

install:
	pip install -e .

dev:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

up:
	docker compose -f infra/docker/docker-compose.yml up -d --build

down:
	docker compose -f infra/docker/docker-compose.yml down

logs:
	docker compose -f infra/docker/docker-compose.yml logs -f

restart:
	docker compose -f infra/docker/docker-compose.yml restart

migrate:
	alembic upgrade head

makemigrations:
	alembic revision --autogenerate -m "update"

seed:
	python scripts/seed_data.py

test:
	pytest -q

lint:
	ruff check app tests scripts

security:
	bandit -r app -x tests

up-test-db:
	docker compose -f infra/docker/docker-compose.test.yml up -d

down-test-db:
	docker compose -f infra/docker/docker-compose.test.yml down

test-postgres:
	TEST_DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5433/secure_travel_booking_test pytest -q -m postgres tests/test_postgres_smoke.py tests/test_postgres_coupon_json.py

runtime-check:
	python -c "from app.core.startup import run_startup_checks; run_startup_checks()"