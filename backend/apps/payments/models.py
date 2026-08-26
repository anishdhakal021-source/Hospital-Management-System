from django.core.validators import MinValueValidator
from django.db import models

from apps.billing.models import Invoice


class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ("CASH", "Cash"),
        ("CARD", "Card"),
        ("ONLINE", "Online"),
        ("ESEWA", "eSewa"),
        ("BANK_TRANSFER", "Bank Transfer"),
    ]

    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.PROTECT,
        related_name="payments",
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[
            MinValueValidator(0),
        ],
    )

    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
    )

    transaction_reference = models.CharField(
        max_length=100,
        blank=True,
    )

    paid_at = models.DateTimeField(
        auto_now_add=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-paid_at"]

    def __str__(self):
        return (
            f"{self.invoice.invoice_number} - "
            f"{self.amount} - "
            f"{self.payment_method}"
        )