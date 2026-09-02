from decimal import Decimal

from django.db.models import Sum
from rest_framework import serializers

from .models import Invoice, InvoiceItem


class InvoiceSerializer(serializers.ModelSerializer):
    patient_id = serializers.PrimaryKeyRelatedField(
        source="patient",
        queryset=Invoice._meta.get_field("patient").remote_field.model.objects.all(),
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
            "total_amount",
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


class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = [
            "id",
            "invoice",
            "description",
            "quantity",
            "unit_price",
            "subtotal",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "subtotal",
            "created_at",
            "updated_at",
        ]

    def _update_invoice_total(self, invoice):
        total = invoice.items.aggregate(
            total=Sum("subtotal")
        )["total"]

        invoice.total_amount = total or Decimal("0.00")
        invoice.save(update_fields=["total_amount", "updated_at"])

    def create(self, validated_data):
        quantity = validated_data["quantity"]
        unit_price = validated_data["unit_price"]

        validated_data["subtotal"] = (
            Decimal(quantity) * unit_price
        )

        item = InvoiceItem.objects.create(**validated_data)

        self._update_invoice_total(item.invoice)

        return item

    def update(self, instance, validated_data):
        validated_data.pop("subtotal", None)

        quantity = validated_data.get(
            "quantity",
            instance.quantity,
        )
        unit_price = validated_data.get(
            "unit_price",
            instance.unit_price,
        )

        validated_data["subtotal"] = (
            Decimal(quantity) * unit_price
        )

        item = super().update(instance, validated_data)

        self._update_invoice_total(item.invoice)

        return item