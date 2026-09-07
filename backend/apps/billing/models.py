from django.core.validators import MinValueValidator
from django.db import models

from apps.patients.models import Patient


class Invoice(models.Model):
    STATUS_CHOICES = [
        ("UNPAID", "Unpaid"),
        ("PARTIALLY_PAID", "Partially Paid"),
        ("PAID", "Paid"),
        ("CANCELLED", "Cancelled"),
    ]

    patient = models.ForeignKey(
        Patient,
        on_delete=models.PROTECT,
        related_name="invoices",
    )

    invoice_number = models.CharField(
        max_length=50,
        unique=True,
    )

    total_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        validators=[
            MinValueValidator(0),
        ],
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="UNPAID",
    )

    issued_at = models.DateTimeField(
        auto_now_add=True,
    )

    due_date = models.DateField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return (
            f"{self.invoice_number} - "
            f"{self.patient}"
        )


# InvoiceItem model represents individual items or services associated with an invoice.
class InvoiceItem(models.Model):
    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
        related_name="items",
    )

    description = models.CharField(
        max_length=255,
    )

    quantity = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1),
        ],
    )

    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[
            MinValueValidator(0),
        ],
    )

    subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[
            MinValueValidator(0),
        ],
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return (
            f"{self.invoice.invoice_number} - "
            f"{self.description}"
        )