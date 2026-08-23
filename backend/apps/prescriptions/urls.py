from django.urls import path

from .views import (
    PrescriptionItemDetailView,
    PrescriptionItemListCreateView,
    PrescriptionDetailView,
    PrescriptionListCreateView,
)


urlpatterns = [
    path(
        "",
        PrescriptionListCreateView.as_view(),
        name="prescription-list-create",
    ),
    path(
        "<int:pk>/",
        PrescriptionDetailView.as_view(),
        name="prescription-detail",
    ),

    # Priscription Item Urls
    
    path(
        "items/",
        PrescriptionItemListCreateView.as_view(),
        name="prescription-item-list-create",
    ),
    path(
        "items/<int:pk>/",
        PrescriptionItemDetailView.as_view(),
        name="prescription-item-detail",
    ),    
]
