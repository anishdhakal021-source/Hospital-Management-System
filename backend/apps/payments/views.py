from django.db import transaction
from rest_framework import generics

from apps.billing.models import Invoice

from .models import Payment
from .permissions import CanManagePayments
from .serializers import PaymentSerializer


class PaymentListCreateView(generics.ListCreateAPIView):
    queryset = Payment.objects.select_related(
        "invoice",
        "invoice__patient",
    ).all()

    serializer_class = PaymentSerializer
    permission_classes = [CanManagePayments]

    def perform_create(self, serializer):
        with transaction.atomic():
            payment = serializer.save()

            self.update_invoice_status(payment.invoice)


    def update_invoice_status(self, invoice):
        paid_amount = sum(
            payment.amount
            for payment in invoice.payments.all()
        )

        if paid_amount == 0:
            new_status = "UNPAID"
        elif paid_amount < invoice.total_amount:
            new_status = "PARTIALLY_PAID"
        else:
            new_status = "PAID"

        if invoice.status != "CANCELLED":
            invoice.status = new_status
            invoice.save(update_fields=["status", "updated_at"])


class PaymentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Payment.objects.select_related(
        "invoice",
        "invoice__patient",
    ).all()

    serializer_class = PaymentSerializer
    permission_classes = [CanManagePayments]

    def perform_update(self, serializer):
        with transaction.atomic():
            payment = serializer.save()

            self.update_invoice_status(payment.invoice)

    def perform_destroy(self, instance):
        invoice = instance.invoice

        with transaction.atomic():
            instance.delete()

            self.update_invoice_status(invoice)

    def update_invoice_status(self, invoice):
        paid_amount = sum(
            payment.amount
            for payment in invoice.payments.all()
        )

        if paid_amount == 0:
            new_status = "UNPAID"
        elif paid_amount < invoice.total_amount:
            new_status = "PARTIALLY_PAID"
        else:
            new_status = "PAID"

        if invoice.status != "CANCELLED":
            invoice.status = new_status
            invoice.save(update_fields=["status", "updated_at"])