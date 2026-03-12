from typing import Annotated

from fastapi import Depends, Query
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.exceptions import AuthenticationAppException, AuthorizationAppException
from app.core.security import decode_access_token
from app.models.user import User
from app.utils.pagination import PaginationParams

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Session = Depends(get_db),
) -> User:
    try:
        payload = decode_access_token(token)
    except ValueError as exc:
        raise AuthenticationAppException("Invalid authentication credentials") from exc

    user_id = payload.get("sub")
    if not user_id:
        raise AuthenticationAppException("Invalid authentication credentials")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise AuthenticationAppException("User not found")

    return user


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    role_names = [user_role.role.name for user_role in current_user.roles]
    if "admin" not in role_names:
        raise AuthorizationAppException("Admin access required")
    return current_user


def get_pagination_params(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
) -> PaginationParams:
    return PaginationParams(page=page, page_size=page_size)