from sqlalchemy.orm import Session

from app.repositories.admin_dashboard_repository import AdminDashboardRepository
from app.repositories.admin_repository import AdminRepository
from app.repositories.audit_repository import AuditRepository
from app.repositories.booking_repository import BookingRepository
from app.repositories.coupon_repository import CouponRepository
from app.repositories.document_repository import DocumentRepository
from app.repositories.flight_repository import FlightRepository
from app.repositories.hotel_repository import HotelRepository
from app.repositories.payment_repository import PaymentRepository
from app.repositories.tour_repository import TourRepository
from app.repositories.user_repository import UserRepository
from app.services.admin_bulk_service import AdminBulkService
from app.services.admin_coupon_service import AdminCouponService
from app.services.admin_dashboard_service import AdminDashboardService
from app.services.admin_export_service import AdminExportService
from app.services.admin_service import AdminService
from app.services.admin_tour_service import AdminTourService
from app.services.audit_service import AuditService
from app.services.auth_service import AuthService
from app.services.auth_token_service import AuthTokenService
from app.services.booking_cancellation_service import BookingCancellationService
from app.services.booking_service import BookingService
from app.services.coupon_service import CouponService
from app.services.flight_service import FlightService
from app.services.hotel_booking_service import HotelBookingService
from app.services.hotel_service import HotelService
from app.services.payment_callback_service import PaymentCallbackService
from app.services.payment_service import PaymentService
from app.services.pdf_voucher_service import PDFVoucherService
from app.services.tour_booking_service import TourBookingService
from app.services.tour_service import TourService
from app.services.traveler_service import TravelerService
from app.services.upload_service import UploadService
from app.services.user_service import UserService
from app.services.voucher_document_service import VoucherDocumentService
from app.services.voucher_render_service import VoucherRenderService
from app.services.voucher_service import VoucherService
from app.workers.email_worker import EmailWorker
from app.workers.notification_worker import NotificationWorker


def build_audit_service(db: Session) -> AuditService:
    return AuditService(AuditRepository(db))


def build_admin_dashboard_service(db: Session) -> AdminDashboardService:
    return AdminDashboardService(
        AdminDashboardRepository(db),
        db=db,
        audit_service=build_audit_service(db),
    )


def build_admin_service(
    db: Session,
    *,
    include_payment_repo: bool = False,
    include_audit_service: bool = False,
) -> AdminService:
    return AdminService(
        db=db,
        user_repo=UserRepository(db),
        admin_repo=AdminRepository(db),
        payment_repo=PaymentRepository(db) if include_payment_repo else None,
        audit_service=build_audit_service(db) if include_audit_service else None,
    )


def build_admin_bulk_service(db: Session) -> AdminBulkService:
    return AdminBulkService(
        coupon_repo=CouponRepository(db),
        tour_repo=TourRepository(db),
        payment_repo=PaymentRepository(db),
        admin_service=build_admin_service(
            db,
            include_payment_repo=True,
            include_audit_service=True,
        ),
        db=db,
        audit_service=build_audit_service(db),
    )


def build_admin_tour_service(db: Session) -> AdminTourService:
    return AdminTourService(
        db=db,
        tour_repo=TourRepository(db),
        audit_service=build_audit_service(db),
        admin_bulk_service=build_admin_bulk_service(db),
    )


def build_admin_coupon_service(db: Session) -> AdminCouponService:
    return AdminCouponService(
        db=db,
        coupon_repo=CouponRepository(db),
        audit_service=build_audit_service(db),
        admin_bulk_service=build_admin_bulk_service(db),
    )


def build_auth_service(db: Session) -> AuthService:
    user_repo = UserRepository(db)
    return AuthService(
        db=db,
        user_repo=user_repo,
        audit_service=build_audit_service(db),
        email_worker=EmailWorker(),
        auth_token_service=AuthTokenService(user_repo),
    )


def build_booking_service(db: Session) -> BookingService:
    return BookingService(
        db=db,
        booking_repo=BookingRepository(db),
        flight_repo=FlightRepository(db),
        user_repo=UserRepository(db),
        audit_service=build_audit_service(db),
        email_worker=EmailWorker(),
        notification_worker=NotificationWorker(),
    )


def build_hotel_booking_service(db: Session) -> HotelBookingService:
    return HotelBookingService(
        db=db,
        booking_repo=BookingRepository(db),
        hotel_repo=HotelRepository(db),
        audit_service=build_audit_service(db),
    )


def build_tour_booking_service(db: Session) -> TourBookingService:
    return TourBookingService(
        db=db,
        booking_repo=BookingRepository(db),
        tour_repo=TourRepository(db),
        audit_service=build_audit_service(db),
        email_worker=EmailWorker(),
        notification_worker=NotificationWorker(),
    )


def build_coupon_service(db: Session) -> CouponService:
    return CouponService(
        db=db,
        booking_repo=BookingRepository(db),
        coupon_repo=CouponRepository(db),
        audit_service=build_audit_service(db),
    )


def build_payment_service(db: Session) -> PaymentService:
    return PaymentService(
        db=db,
        booking_repo=BookingRepository(db),
        payment_repo=PaymentRepository(db),
        audit_service=build_audit_service(db),
        email_worker=EmailWorker(),
    )


def build_payment_callback_service(db: Session) -> PaymentCallbackService:
    return PaymentCallbackService(
        db=db,
        booking_repo=BookingRepository(db),
        payment_repo=PaymentRepository(db),
        audit_service=build_audit_service(db),
        email_worker=EmailWorker(),
    )


def build_voucher_service(db: Session) -> VoucherService:
    audit_service = build_audit_service(db)
    document_repo = DocumentRepository(db)
    pdf_voucher_service = PDFVoucherService()
    email_worker = EmailWorker()
    voucher_document_service = VoucherDocumentService(
        document_repo=document_repo,
        audit_service=audit_service,
        pdf_voucher_service=pdf_voucher_service,
        email_worker=email_worker,
    )

    return VoucherService(
        db=db,
        booking_repo=BookingRepository(db),
        audit_service=audit_service,
        document_repo=document_repo,
        pdf_voucher_service=pdf_voucher_service,
        email_worker=email_worker,
        voucher_render_service=VoucherRenderService(),
        voucher_document_service=voucher_document_service,
    )


def build_admin_export_service(db: Session) -> AdminExportService:
    return AdminExportService(
        AdminRepository(db),
        db=db,
        audit_service=build_audit_service(db),
    )


def build_flight_service(db: Session) -> FlightService:
    return FlightService(
        db=db,
        flight_repo=FlightRepository(db),
        audit_service=build_audit_service(db),
    )


def build_hotel_service(db: Session) -> HotelService:
    return HotelService(
        db=db,
        hotel_repo=HotelRepository(db),
        audit_service=build_audit_service(db),
    )


def build_tour_service(db: Session) -> TourService:
    return TourService(
        db=db,
        tour_repo=TourRepository(db),
        audit_service=build_audit_service(db),
    )


def build_upload_service(db: Session) -> UploadService:
    return UploadService(
        db=db,
        document_repo=DocumentRepository(db),
        audit_service=build_audit_service(db),
        booking_repo=BookingRepository(db),
    )


def build_traveler_service(db: Session) -> TravelerService:
    return TravelerService(
        db=db,
        booking_repo=BookingRepository(db),
        audit_service=build_audit_service(db),
    )


def build_booking_cancellation_service(db: Session) -> BookingCancellationService:
    return BookingCancellationService(
        db=db,
        booking_repo=BookingRepository(db),
        payment_repo=PaymentRepository(db),
        flight_repo=FlightRepository(db),
        hotel_repo=HotelRepository(db),
        tour_repo=TourRepository(db),
        audit_service=build_audit_service(db),
        email_worker=EmailWorker(),
    )


def build_user_service(db: Session) -> UserService:
    return UserService(
        db=db,
        audit_service=build_audit_service(db),
    )
