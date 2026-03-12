def test_refresh_token_rotation_returns_new_refresh_token(client, db_session):
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "rotation1@example.com",
            "username": "rotation1",
            "full_name": "Rotation User 1",
            "password": "Password123",
        },
    )

    login_resp = client.post(
        "/api/v1/auth/login",
        json={
            "email": "rotation1@example.com",
            "password": "Password123",
        },
    )
    assert login_resp.status_code == 200
    old_refresh_token = login_resp.json()["refresh_token"]

    refresh_resp = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": old_refresh_token},
    )
    assert refresh_resp.status_code == 200

    body = refresh_resp.json()
    new_refresh_token = body["refresh_token"]

    assert new_refresh_token != old_refresh_token
    assert "access_token" in body


def test_old_refresh_token_cannot_be_reused_after_rotation(client, db_session):
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "rotation2@example.com",
            "username": "rotation2",
            "full_name": "Rotation User 2",
            "password": "Password123",
        },
    )

    login_resp = client.post(
        "/api/v1/auth/login",
        json={
            "email": "rotation2@example.com",
            "password": "Password123",
        },
    )
    assert login_resp.status_code == 200
    old_refresh_token = login_resp.json()["refresh_token"]

    first_refresh = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": old_refresh_token},
    )
    assert first_refresh.status_code == 200

    reuse_old = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": old_refresh_token},
    )
    assert reuse_old.status_code == 401


def test_new_refresh_token_can_continue_session_after_rotation(client, db_session):
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "rotation3@example.com",
            "username": "rotation3",
            "full_name": "Rotation User 3",
            "password": "Password123",
        },
    )

    login_resp = client.post(
        "/api/v1/auth/login",
        json={
            "email": "rotation3@example.com",
            "password": "Password123",
        },
    )
    assert login_resp.status_code == 200
    refresh_token_1 = login_resp.json()["refresh_token"]

    refresh_resp_1 = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh_token_1},
    )
    assert refresh_resp_1.status_code == 200
    refresh_token_2 = refresh_resp_1.json()["refresh_token"]

    refresh_resp_2 = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh_token_2},
    )
    assert refresh_resp_2.status_code == 200
    refresh_token_3 = refresh_resp_2.json()["refresh_token"]

    assert refresh_token_3 != refresh_token_2