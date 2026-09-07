from django.db import models

from apps.doctors.models import Doctor
from apps.patients.models import Patient


class MedicalRecord(models.Model):
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="medical_records",
    )

    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.PROTECT,
        related_name="medical_records",
    )

    diagnosis = models.TextField()

    symptoms =models.TextField(
        blank=True,
    )

    notes = models.TextField(
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
            f"{self.patient} - "
            f"{self.doctor} - "
            f"{self.created_at:%Y-%m-%d}"
        )
    