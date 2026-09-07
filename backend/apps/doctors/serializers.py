from rest_framework import serializers

from apps.departments.models import Department
from apps.users.models import User
from apps.users.serializers import UserAccountSerializer

from .models import Doctor


class DoctorSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    email = serializers.EmailField(
        source="user.email",
        read_only=True,
    )

    first_name = serializers.CharField(
        source="user.first_name",
        read_only=True,
    )

    last_name = serializers.CharField(
        source="user.last_name",
        read_only=True,
    )

    department_name = serializers.CharField(
        source="department.name",
        read_only=True,
    )

    user_id = serializers.PrimaryKeyRelatedField(
        source="user",
        queryset=User.objects.filter(role=User.Role.DOCTOR),
        write_only=True,
    )

    department_id = serializers.PrimaryKeyRelatedField(
        source="department",
        queryset=Department.objects.filter(is_active=True),
        write_only=True,
    )

    class Meta:
        model = Doctor
        fields = [
            "id",
            "user_id",
            "username",
            "email",
            "first_name",
            "last_name",
            "department_id",
            "department_name",
            "specialization",
            "license_number",
            "phone",
            "consultation_fee",
            "is_available",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "department_name",
            "created_at",
            "updated_at",
        ]

    def validate_user_id(self, user):
        if hasattr(user, "doctor_profile"):
            raise serializers.ValidationError(
                "This user already has a doctor profile."
            )

        return user


class DoctorRegistrationSerializer(UserAccountSerializer):
    department_id = serializers.PrimaryKeyRelatedField(
        source="department",
        queryset=Department.objects.filter(is_active=True),
    )

    specialization = serializers.CharField(max_length=150)

    license_number = serializers.CharField(max_length=100)

    phone = serializers.CharField(max_length=20)

    consultation_fee = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    is_available = serializers.BooleanField(default=True)

    def validate_license_number(self, value):
        if Doctor.objects.filter(
            license_number=value
        ).exists():
            raise serializers.ValidationError(
                "A doctor with this license number already exists."
            )

        return value