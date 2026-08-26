from rest_framework import generics

from .models import Invoice
from .permissions import CanManageInvoices
from .serializers import InvoiceSerializer


class InvoiceListCreateView(generics.ListCreateAPIView):
    queryset = Invoice.objects.select_related("patient").all()
    serializer_class = InvoiceSerializer
    permission_classes = [CanManageInvoices]


class InvoiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Invoice.objects.select_related("patient").all()
    serializer_class = InvoiceSerializer
    permission_classes = [CanManageInvoices]