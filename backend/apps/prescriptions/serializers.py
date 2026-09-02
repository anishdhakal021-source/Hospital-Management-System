from rest_framework import serializers

from apps.doctors.models import Doctor
from apps.medical_records.models import MedicalRecord
from apps.patients.models import Patient
from apps.medicines.models import Medicine

from .models import Prescription, PrescriptionItem


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
        medical_record = attrs.get("medical_record")
        patient = attrs.get("patient")
        doctor = attrs.get("doctor")

        request = self.context.get("request")

        # During PATCH/PUT, use the existing values when a field
        # is not included in the request.
        if self.instance:
            medical_record = medical_record or self.instance.medical_record
            patient = patient or self.instance.patient
            doctor = doctor or self.instance.doctor

        # Medical record, patient, and doctor must refer to the
        # same clinical relationship.
        if medical_record and patient:
            if medical_record.patient_id != patient.id:
                raise serializers.ValidationError(
                    {
                        "patient_id": (
                            "The selected patient does not belong " "to the medical record."
                        )
                    }
                )

        if medical_record and doctor:
            if medical_record.doctor_id != doctor.id:
                raise serializers.ValidationError(
                    {
                        "doctor_id": (
                            "The selected doctor does not belong " "to the medical record."
                        )
                    }
                )

        # A doctor may only create/manage prescriptions under
        # their own doctor profile.
        if (
            request
            and request.user.is_authenticated
            and request.user.role == "DOCTOR"
            and doctor.user_id != request.user.id
        ):
            raise serializers.ValidationError(
                {
                    "doctor_id": (
                        "Doctors can only manage prescriptions " "under their own profile."
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

    def validate(self, attrs):
        prescription = attrs.get("prescription")
        request = self.context.get("request")

        if self.instance:
            prescription = (
                prescription or self.instance.prescription
            )

        if (
            request
            and request.user.is_authenticated
            and request.user.role == "DOCTOR"
            and prescription.doctor.user_id != request.user.id
        ):
            raise serializers.ValidationError(
                {
                    "prescription": (
                        "Doctors can only manage items "
                        "for their own prescriptions."
                    )
                }
            )

        return attrs

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than zero.")

        return value

    def validate_dosage(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError("Dosage cannot be empty.")

        return value

    def validate_frequency(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError("Frequency cannot be empty.")

        return value

    def validate_duration(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError("Duration cannot be empty.")

        return value

