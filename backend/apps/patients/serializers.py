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
            "updated_at",
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