from rest_framework import serializers

from apps.medicines.models import MedicineBatch
from apps.prescriptions.models import PrescriptionItem

from .models import Dispensing


class DispensingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dispensing
        fields = [
            "id",
            "prescription_item",
            "medicine_batch",
            "quantity",
            "dispensed_by",
            "dispensed_at",
        ]

        read_only_fields = [
            "id",
            "dispensed_by",
            "dispensed_at",
        ]

    def validate(self, attrs):
        prescription_item = attrs.get("prescription_item")
        medicine_batch = attrs.get("medicine_batch")
        quantity = attrs.get("quantity")

        if prescription_item and medicine_batch:
            if prescription_item.medicine_id != medicine_batch.medicine_id:
                raise serializers.ValidationError(
                    {
                        "medicine_batch": (
                            "The selected batch does not belong "
                            "to the prescribed medicine."
                        )
                    }
                )

        if quantity is not None and medicine_batch:
            if quantity > medicine_batch.quantity:
                raise serializers.ValidationError(
                    {
                        "quantity": (
                            "Dispensing quantity cannot be greater "
                            "than available stock."
                        )
                    }
                )

        return attrs