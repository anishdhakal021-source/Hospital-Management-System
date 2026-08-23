from django.urls import path

from .views import (
    MedicineBatchDetailView,
    MedicineBatchListCreateView,
    MedicineDetailView,
    MedicineListCreateView,
)


urlpatterns = [
    path(
        "",
        MedicineListCreateView.as_view(),
        name="medicine-list-create",
    ),
    path(
        "<int:pk>/",
        MedicineDetailView.as_view(),
        name="medicine-detail",
    ),
    # Medicine Batch
    path(
        "batches/",
        MedicineBatchListCreateView.as_view(),
        name="medicine-batch-list-create",
    ),
    path(
        "batches/<int:pk>/",
        MedicineBatchDetailView.as_view(),
        name="medicine-batch-detail",
    ),
]