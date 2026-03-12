import logging
from dataclasses import dataclass
from typing import Any

logger = logging.getLogger("app.worker.email")


@dataclass
class EmailMessage:
    to_email: str
    subject: str
    template_name: str
    context: dict[str, Any]


class EmailWorker:
    def send(self, message: EmailMessage) -> None:
        logger.info(
            "email_send | to=%s subject=%s template=%s context=%s",
            message.to_email,
            message.subject,
            message.template_name,
            message.context,
        )

    def send_welcome_email(self, *, to_email: str, full_name: str) -> None:
        self.send(
            EmailMessage(
                to_email=to_email,
                subject="Welcome to Secure Travel Booking Platform",
                template_name="welcome_email",
                context={
                    "full_name": full_name,
                },
            )
        )

    def send_booking_created_email(
        self,
        *,
        to_email: str,
        full_name: str,
        booking_code: str,
        total_amount: str,
        currency: str,
    ) -> None:
        self.send(
            EmailMessage(
                to_email=to_email,
                subject="Your booking has been created",
                template_name="booking_created",
                context={
                    "full_name": full_name,
                    "booking_code": booking_code,
                    "total_amount": total_amount,
                    "currency": currency,
                },
            )
        )

    def send_payment_success_email(
        self,
        *,
        to_email: str,
        full_name: str,
        booking_code: str,
        gateway_transaction_ref: str | None,
    ) -> None:
        self.send(
            EmailMessage(
                to_email=to_email,
                subject="Payment successful",
                template_name="payment_success",
                context={
                    "full_name": full_name,
                    "booking_code": booking_code,
                    "gateway_transaction_ref": gateway_transaction_ref,
                },
            )
        )

    def send_voucher_generated_email(
        self,
        *,
        to_email: str,
        full_name: str,
        booking_code: str,
        voucher_filename: str,
    ) -> None:
        self.send(
            EmailMessage(
                to_email=to_email,
                subject="Your booking voucher is ready",
                template_name="voucher_generated",
                context={
                    "full_name": full_name,
                    "booking_code": booking_code,
                    "voucher_filename": voucher_filename,
                },
            )
        )

    def send_booking_cancelled_email(
        self,
        *,
        to_email: str,
        full_name: str,
        booking_code: str,
        cancellation_reason: str | None,
    ) -> None:
        self.send(
            EmailMessage(
                to_email=to_email,
                subject="Your booking has been cancelled",
                template_name="booking_cancelled",
                context={
                    "full_name": full_name,
                    "booking_code": booking_code,
                    "cancellation_reason": cancellation_reason,
                },
            )
        )

    def send_refund_processed_email(
        self,
        *,
        to_email: str,
        full_name: str,
        booking_code: str,
        refund_amount: str,
        currency: str,
    ) -> None:
        self.send(
            EmailMessage(
                to_email=to_email,
                subject="Your refund has been processed",
                template_name="refund_processed",
                context={
                    "full_name": full_name,
                    "booking_code": booking_code,
                    "refund_amount": refund_amount,
                    "currency": currency,
                },
            )
        )