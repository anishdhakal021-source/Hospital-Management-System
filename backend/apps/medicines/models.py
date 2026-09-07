from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone


class Medicine(models.Model):
    name = models.CharField(
        max_length=200,
    )

    generic_name = models.CharField(
        max_length=200,
        blank=True,
    )

    category = models.CharField(
        max_length=100,
        blank=True,
    )

    manufacturer = models.CharField(
        max_length=200,
        blank=True,
    )

    description = models.TextField(
        blank=True,
    )

    is_active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return self.name


# Medicine Batch

class MedicineBatch(models.Model):
    medicine = models.ForeignKey(
        Medicine,
        on_delete=models.PROTECT,
        related_name="batches",
    )

    batch_number = models.CharField(
        max_length=100,
    )

    expiry_date = models.DateField()

    quantity = models.PositiveIntegerField(
        default=0,
    )

    purchase_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[
            MinValueValidator(0),
        ],
    )

    selling_price = models.DecimalField(
        max_digits=10,
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
        constraints = [
            models.UniqueConstraint(
                fields=["medicine", "batch_number"],
                name="unique_medicine_batch_number",
            ),
        ]
        ordering = ["expiry_date", "id"]

    def is_expired(self):
        return self.expiry_date <= timezone.localdate()

    def __str__(self):
        return f"{self.medicine.name} - {self.batch_number}"