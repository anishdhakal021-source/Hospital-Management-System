from rest_framework import serializers

from apps.doctors.models import Doctor
from apps.medical_records.models import MedicalRecord
from apps.patients.models import Patient
from apps.medicines.models import Medicine

from .models import Prescription,PrescriptionItem


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
        prescription = attrs.get("prescription")
        medicine = attrs.get("medicine")

        request = self.context.get("request")

        if request and request.user.is_authenticated:
            if request.user.role == "DOCTOR" and prescription:
                if prescription.doctor.user != request.user:
                    raise serializers.ValidationError(
                        {
                            "prescription": (
                                "You can only manage items for "
                                "your own prescriptions."
                            )
                        }
                    )

        if prescription and medicine:
            queryset = PrescriptionItem.objects.filter(
                prescription=prescription,
                medicine=medicine,
            )

            if self.instance:
                queryset = queryset.exclude(
                    pk=self.instance.pk
                )

            if queryset.exists():
                raise serializers.ValidationError(
                    {
                        "medicine": (
                            "This medicine is already included "
                            "in this prescription."
                        )
                    }
                )

        return attrs

    def validate_instructions(self, value):
        return value.strip()



# Prescription Item 

class PrescriptionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescriptionItem
        fields = [
            "id",
            "prescription",
            "medicine",
            "quantity",
            "dosage",
            "frequency",
            "duration",
            "instructions",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Quantity must be greater than zero."
            )

        return value

    def validate_dosage(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Dosage cannot be empty."
            )

        return value

    def validate_frequency(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Frequency cannot be empty."
            )

        return value

    def validate_duration(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Duration cannot be empty."
            )

        return value

    def validate(self, attrs):
        prescription = attrs.get("prescription")
        medicine = attrs.get("medicine")

        if prescription and medicine:
            queryset = PrescriptionItem.objects.filter(
                prescription=prescription,
                medicine=medicine,
            )

            # Exclude the current item when updating an existing item.
            if self.instance:
                queryset = queryset.exclude(
                    pk=self.instance.pk
                )

            if queryset.exists():
                raise serializers.ValidationError(
                    {
                        "medicine": (
                            "This medicine is already "
                            "included in this prescription."
                        )
                    }
                )

        return attrs