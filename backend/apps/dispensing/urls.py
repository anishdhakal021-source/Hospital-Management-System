from django.urls import path

from .views import (
    DispensingDetailView,
    DispensingListCreateView,
)


urlpatterns = [
    path(
        "",
        DispensingListCreateView.as_view(),
        name="dispensing-list-create",
    ),
    path(
        "<int:pk>/",
        DispensingDetailView.as_view(),
        name="dispensing-detail",
    ),
]