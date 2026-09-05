from rest_framework import serializers

from apps.users.models import User
from apps.users.serializers import UserAccountSerializer

from .models import Patient


class PatientSerializer(serializers.ModelSerializer):
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

    user_id = serializers.PrimaryKeyRelatedField(
        source="user",
        queryset=User.objects.filter(role=User.Role.PATIENT),
        write_only=True,
    )

    class Meta:
        model = Patient
        fields = [
            "id",
            "user_id",
            "username",
            "email",
            "first_name",
            "last_name",
            "date_of_birth",
            "gender",
            "phone",
            "address",
            "blood_group",
            "emergency_contact",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "created_at",
        ]

    def validate(self, attrs):
        if self.instance and "user" in attrs:
            raise serializers.ValidationError(
                {"user_id": "The patient profile owner cannot be changed."}
            )

        return attrs

    def validate_user_id(self, user):
        if hasattr(user, "patient_profile"):
            raise serializers.ValidationError(
                "This user already has a patient profile."
            )

        return user



# patient Register
class PatientRegistrationSerializer(UserAccountSerializer):
    date_of_birth = serializers.DateField(
        required=False,
        allow_null=True,
    )
    gender = serializers.CharField(
        max_length=20,
        required=False,
        allow_blank=True,
    )
    phone = serializers.CharField(
        max_length=20,
        required=False,
        allow_blank=True,
    )
    address = serializers.CharField(
        required=False,
        allow_blank=True,
    )
    blood_group = serializers.CharField(
        max_length=5,
        required=False,
        allow_blank=True,
    )
    emergency_contact = serializers.CharField(
        max_length=20,
        required=False,
        allow_blank=True,
    )