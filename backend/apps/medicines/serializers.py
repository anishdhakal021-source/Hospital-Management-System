from rest_framework import serializers
from django.utils import timezone


from .models import Medicine, MedicineBatch

class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = [
            "id",
            "name",
            "generic_name",
            "category",
            "manufacturer",
            "description",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def validate_name(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Medicine name cannot be empty."
            )

        return value


# Medicine Batch Serializer

class MedicineBatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicineBatch
        fields = [
            "id",
            "medicine",
            "batch_number",
            "expiry_date",
            "quantity",
            "purchase_price",
            "selling_price",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def validate_batch_number(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Batch number cannot be empty."
            )

        return value

    def validate(self, attrs):
        purchase_price = attrs.get("purchase_price")
        selling_price = attrs.get("selling_price")
        expiry_date = attrs.get("expiry_date")

        if (
            purchase_price is not None
            and selling_price is not None
            and selling_price < purchase_price
        ):
            raise serializers.ValidationError(
                {
                    "selling_price": (
                        "Selling price cannot be lower "
                        "than purchase price."
                    )
                }
            )

        if expiry_date is not None and expiry_date <= timezone.localdate():
            raise serializers.ValidationError(
                {
                    "expiry_date": (
                        "Expiry date must be a future date."
                    )
                }
            )

        return attrs

    def validate_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Quantity cannot be negative."
            )

        return value