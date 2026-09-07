from django.core.validators import MinValueValidator
from django.db import models

from apps.doctors.models import Doctor
from apps.medical_records.models import MedicalRecord
from apps.patients.models import Patient


class Prescription(models.Model):
    STATUS_CHOICES = [
        ("ACTIVE", "Active"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
    ]

    medical_record = models.ForeignKey(
        MedicalRecord,
        on_delete=models.PROTECT,
        related_name="prescriptions",
    )

    patient = models.ForeignKey(
        Patient,
        on_delete=models.PROTECT,
        related_name="prescriptions",
    )

    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.PROTECT,
        related_name="prescriptions",
    )

    prescribed_date = models.DateField(
        auto_now_add=True,
    )

    instructions = models.TextField(
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="ACTIVE",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return (
            f"Prescription #{self.id} - "
            f"{self.patient} - "
            f"{self.prescribed_date}"
        )


# Prescription Items

class PrescriptionItem(models.Model):
    prescription = models.ForeignKey(
        Prescription,
        on_delete=models.CASCADE,
        related_name="items",
    )

    medicine = models.ForeignKey(
        "medicines.Medicine",
        on_delete=models.PROTECT,
        related_name="prescription_items",
    )

    quantity = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1),
        ],
    )

    dosage = models.CharField(
        max_length=100,
    )

    frequency = models.CharField(
        max_length=100,
    )

    duration = models.CharField(
        max_length=100,
    )

    instructions = models.TextField(
        blank=True,
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
                fields=["prescription", "medicine"],
                name="unique_prescription_medicine",
            ),
        ]
        ordering = ["id"]

    def __str__(self):
        return (
            f"{self.prescription} - "
            f"{self.medicine.name}"
        )