from django.conf import settings
from django.db import models

from apps.departments.models import Department


class Doctor(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="doctor_profile",
    )

    department = models.ForeignKey(
        Department,
        on_delete=models.PROTECT,
        related_name="doctors",
    )

    specialization = models.CharField(
        max_length=150,
    )

    license_number = models.CharField(
        max_length=100,
        unique=True,
    )

    phone = models.CharField(
        max_length=20,
    )

    consultation_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    is_available = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return self.user.get_full_name() or self.user.username