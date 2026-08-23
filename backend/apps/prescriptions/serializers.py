from rest_framework import serializers

from apps.doctors.models import Doctor
from apps.medical_records.models import MedicalRecord
from apps.patients.models import Patient

from .models import Prescription


class PrescriptionSerializer(serializers.ModelSerializer):
    medical_record_id = serializers.PrimaryKeyRelatedField(
        source="medical_record",
        queryset=MedicalRecord.objects.all(),
    )

    patient_id = serializers.PrimaryKeyRelatedField(
        source="patient",
        queryset=Patient.objects.all(),
    )

    doctor_id = serializers.PrimaryKeyRelatedField(
        source="doctor",
        queryset=Doctor.objects.all(),
    )

    class Meta:
        model = Prescription
        fields = [
            "id",
            "medical_record_id",
            "patient_id",
            "doctor_id",
            "prescribed_date",
            "instructions",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "prescribed_date",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        medical_record = attrs["medical_record"]
        patient = attrs["patient"]
        doctor = attrs["doctor"]

        if medical_record.patient_id != patient.id:
            raise serializers.ValidationError(
                {
                    "patient_id": (
                        "The patient must match the "
                        "medical record patient."
                    )
                }
            )

        if medical_record.doctor_id != doctor.id:
            raise serializers.ValidationError(
                {
                    "doctor_id": (
                        "The doctor must match the "
                        "medical record doctor."
                    )
                }
            )

        return attrs

    def validate_instructions(self, value):
        return value.strip()