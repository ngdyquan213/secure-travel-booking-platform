def test_register_and_login(client):
    register_payload = {
        "email": "user1@example.com",
        "username": "user1",
        "full_name": "User One",
        "password": "Password123",
    }

    resp = client.post("/api/v1/auth/register", json=register_payload)
    print("REGISTER STATUS:", resp.status_code)
    print("REGISTER BODY:", resp.text)
    assert resp.status_code == 201

    body = resp.json()
    assert body["email"] == "user1@example.com"

    login_payload = {
        "email": "user1@example.com",
        "password": "Password123",
    }
    resp = client.post("/api/v1/auth/login", json=login_payload)
    print("LOGIN STATUS:", resp.status_code)
    print("LOGIN BODY:", resp.text)
    assert resp.status_code == 200

    token_body = resp.json()
    assert "access_token" in token_body