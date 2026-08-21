from rest_framework import serializers

from apps.users.models import User
from .models import Doctor


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = [
            "id",
            "user",
            "specialization",
            "license_number",
            "phone",
            "experience_years",
            "qualification",
            "department",
            "consultation_fee",
            "available",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def validate_user(self, user):
        if user.role != User.Role.DOCTOR:
            raise serializers.ValidationError(
                "Selected user must have the DOCTOR role."
            )

        if Doctor.objects.filter(user=user).exists():
            raise serializers.ValidationError(
                "This user already has a doctor profile."
            )

        return user