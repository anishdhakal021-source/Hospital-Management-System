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
    )

    class Meta:
        model = MedicalRecord
        fields = [
            "id",
            "patient_id",
            "doctor_id",
            "diagnosis",
            "symptoms",
            "notes",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def validate_patient_id(self, patient):
        """
        Ensure the selected user actually has the patient role.
        """

        if patient.user.role != "PATIENT":
            raise serializers.ValidationError(
                "The selected user is not a patient."
            )

        return patient

    def validate_doctor_id(self, doctor):
        """
        Ensure the doctor profile belongs to a doctor user
        and, when a doctor is making the request, that it is
        their own doctor profile.
        """

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