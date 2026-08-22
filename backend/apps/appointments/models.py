from django.db import models

# Create your models here.
from django.core.exceptions import ValidationError
from django.db import models

from apps.doctors.models import Doctor
from apps.patients.models import Patient


class Appointment(models.Model):
    class Status(models.TextChoices):
        SCHEDULED = "SCHEDULED", "Scheduled"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"
        NO_SHOW = "NO_SHOW", "No Show"

    patient = models.ForeignKey(
        Patient,
        on_delete=models.PROTECT,
        related_name="appointments",
    )

    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.PROTECT,
        related_name="appointments",
    )

    appointment_date = models.DateTimeField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.SCHEDULED,
    )

    reason = models.TextField(
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

    class Meta:
        ordering = ["appointment_date"]

        constraints = [
            models.UniqueConstraint(
                fields=["doctor", "appointment_date"],
                condition=models.Q(status="SCHEDULED"),
                name="unique_scheduled_doctor_appointment",
            ),
        ]

    def clean(self):
        if self.patient.user.role != "PATIENT":
            raise ValidationError(
                "The selected user must have the PATIENT role."
            )

        if self.doctor.user.role != "DOCTOR":
            raise ValidationError(
                "The selected user must have the DOCTOR role."
            )

    def __str__(self):
        return (
            f"{self.doctor} - "
            f"{self.patient} - "
            f"{self.appointment_date}"
        )