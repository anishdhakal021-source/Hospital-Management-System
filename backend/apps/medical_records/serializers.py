from rest_framework import serializers

from apps.doctors.models import Doctor
from apps.patients.models import Patient

from .models import MedicalRecord


class MedicalRecordSerializer(serializers.ModelSerializer):
    patient_id = serializers.PrimaryKeyRelatedField(
        source="patient",
        queryset=Patient.objects.all(),
    )

    doctor_id = serializers.PrimaryKeyRelatedField(
        source="doctor",
        queryset=Doctor.objects.all(),
        required=False,
    )

    patient_name = serializers.CharField(source="patient.user.get_full_name", read_only=True)
    doctor_name = serializers.CharField(source="doctor.user.get_full_name", read_only=True)

    class Meta:
        model = MedicalRecord
        fields = [
            "id",
            "patient_id",
            "patient_name",
            "doctor_id",
            "doctor_name",
            "diagnosis",
            "symptoms",
            "notes",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "patient_name",
            "doctor_name",
            "created_at",
            "updated_at",
        ]

    def validate_patient_id(self, patient):
        if patient.user.role != "PATIENT":
            raise serializers.ValidationError(
                "The selected user is not a patient."
            )

        return patient

    def validate_doctor_id(self, doctor):
        if doctor.user.role != "DOCTOR":
            raise serializers.ValidationError(
                "The selected user is not a doctor."
            )

        request = self.context.get("request")

        if (
            request
            and request.user.role == "DOCTOR"
            and doctor.user_id != request.user.id
        ):
            raise serializers.ValidationError(
                "Doctors can only create medical records under their own profile."
            )

        return doctor

    def validate(self, attrs):
        request = self.context.get("request")

        if request and request.user.role == "DOCTOR":
            if "doctor" not in attrs:
                doctor = Doctor.objects.get(
                    user=request.user
                )
                attrs["doctor"] = doctor

        elif request and request.user.role == "ADMIN":
            if "doctor" not in attrs:
                raise serializers.ValidationError({
                    "doctor_id": "This field is required."
                })

        return attrs

    def validate_diagnosis(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Diagnosis cannot be empty."
            )

        return value

    def validate_symptoms(self, value):
        return value.strip()

    def validate_notes(self, value):
        return value.strip()