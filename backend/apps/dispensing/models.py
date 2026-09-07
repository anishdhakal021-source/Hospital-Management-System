from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models

from apps.medicines.models import MedicineBatch
from apps.prescriptions.models import PrescriptionItem


class Dispensing(models.Model):
    prescription_item = models.ForeignKey(
        PrescriptionItem,
        on_delete=models.PROTECT,
        related_name="dispensings",
    )

    medicine_batch = models.ForeignKey(
        MedicineBatch,
        on_delete=models.PROTECT,
        related_name="dispensings",
    )

    quantity = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1),
        ],
    )

    dispensed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="medicine_dispensings",
    )

    dispensed_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["-dispensed_at"]

    def __str__(self):
        return (
            f"{self.prescription_item.medicine.name} - "
            f"{self.quantity} - "
            f"{self.dispensed_by.username}"
        )