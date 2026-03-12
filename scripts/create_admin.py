from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.role import Role, UserRole
from app.models.user import User
from app.models.enums import UserStatus


def main() -> None:
    db: Session = SessionLocal()

    try:
        with db.begin():
            admin_role = db.query(Role).filter(Role.name == "admin").first()
            if not admin_role:
                admin_role = Role(name="admin", description="Administrator")
                db.add(admin_role)
                db.flush()

            user = db.query(User).filter(User.email == "admin@example.com").first()
            if not user:
                user = User(
                    email="admin@example.com",
                    username="admin",
                    full_name="System Admin",
                    password_hash=get_password_hash("Admin12345"),
                    status=UserStatus.active,
                    email_verified=True,
                    phone_verified=False,
                    failed_login_count=0,
                )
                db.add(user)
                db.flush()

            existing_mapping = (
                db.query(UserRole)
                .filter(UserRole.user_id == user.id, UserRole.role_id == admin_role.id)
                .first()
            )
            if not existing_mapping:
                db.add(UserRole(user_id=user.id, role_id=admin_role.id))
                db.flush()

        print("Admin user created/updated successfully.")
        print("email=admin@example.com")
        print("password=Admin12345")
    finally:
        db.close()


if __name__ == "__main__":
    main()