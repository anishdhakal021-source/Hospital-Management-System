from rest_framework import serializers

from apps.patients.models import Patient

from .models import Invoice


class InvoiceSerializer(serializers.ModelSerializer):
    patient_id = serializers.PrimaryKeyRelatedField(
        source="patient",
        queryset=Patient.objects.all(),
    )

    class Meta:
        model = Invoice
        fields = [
            "id",
            "patient_id",
            "invoice_number",
            "total_amount",
            "status",
            "issued_at",
            "due_date",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "issued_at",
            "created_at",
            "updated_at",
        ]

    def validate_invoice_number(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Invoice number cannot be empty."
            )

        return value

    def validate_total_amount(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Total amount cannot be negative."
            )

        return value