from decimal import Decimal

from rest_framework import serializers

from apps.billing.models import Invoice

from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    invoice_id = serializers.PrimaryKeyRelatedField(
        source="invoice",
        queryset=Invoice.objects.all(),
    )

    class Meta:
        model = Payment
        fields = [
            "id",
            "invoice_id",
            "amount",
            "payment_method",
            "transaction_reference",
            "paid_at",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "paid_at",
            "created_at",
            "updated_at",
        ]

    def validate_amount(self, value):
        if value <= Decimal("0.00"):
            raise serializers.ValidationError(
                "Payment amount must be greater than zero."
            )

        return value

    def validate_transaction_reference(self, value):
        return value.strip()

    def validate(self, attrs):
        invoice = attrs.get("invoice")
        amount = attrs.get("amount")

        if not invoice or amount is None:
            return attrs

        # Calculate the amount already paid for this invoice.
        already_paid = sum(
            payment.amount
            for payment in Payment.objects.filter(
                invoice=invoice,
            )
        )

        remaining_balance = invoice.total_amount - already_paid

        # When updating a payment, exclude the current payment
        # from the already-paid calculation.
        if self.instance:
            already_paid -= self.instance.amount
            remaining_balance = invoice.total_amount - already_paid

        if amount > remaining_balance:
            raise serializers.ValidationError(
                {
                    "amount": (
                        "Payment amount cannot exceed the "
                        "remaining invoice balance."
                    )
                }
            )

        return attrs