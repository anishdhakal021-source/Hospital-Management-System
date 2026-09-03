from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from apps.users.models import User

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
class PatientRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )
    email = serializers.EmailField(required=False, allow_blank=True)
    first_name = serializers.CharField(
        max_length=150,
        required=False,
        allow_blank=True,
    )
    last_name = serializers.CharField(
        max_length=150,
        required=False,
        allow_blank=True,
    )

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

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "A user with this username already exists."
            )

        return value

    def validate_password(self, value):
        validate_password(value)
        return value