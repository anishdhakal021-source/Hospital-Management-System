from decimal import Decimal

from django.db.models import Sum
from rest_framework import generics

from .models import Invoice, InvoiceItem
from .permissions import CanManageInvoices
from .serializers import InvoiceSerializer, InvoiceItemSerializer


class InvoiceListCreateView(generics.ListCreateAPIView):
    queryset = Invoice.objects.select_related("patient").all()
    serializer_class = InvoiceSerializer
    permission_classes = [CanManageInvoices]


class InvoiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Invoice.objects.select_related("patient").all()
    serializer_class = InvoiceSerializer
    permission_classes = [CanManageInvoices]


class InvoiceItemListCreateView(generics.ListCreateAPIView):
    queryset = InvoiceItem.objects.select_related("invoice").all()
    serializer_class = InvoiceItemSerializer
    permission_classes = [CanManageInvoices]


class InvoiceItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = InvoiceItem.objects.select_related("invoice").all()
    serializer_class = InvoiceItemSerializer
    permission_classes = [CanManageInvoices]

    def perform_destroy(self, instance):
        invoice = instance.invoice

        instance.delete()

        total = invoice.items.aggregate(
            total=Sum("subtotal")
        )["total"]

        invoice.total_amount = total or Decimal("0.00")

        invoice.save(
            update_fields=["total_amount", "updated_at"]
        )