from django.urls import path

from .views import (
    InvoiceDetailView,
    InvoiceListCreateView,
)


urlpatterns = [
    path(
        "invoices/",
        InvoiceListCreateView.as_view(),
        name="invoice-list-create",
    ),
    path(
        "invoices/<int:pk>/",
        InvoiceDetailView.as_view(),
        name="invoice-detail",
    ),
]