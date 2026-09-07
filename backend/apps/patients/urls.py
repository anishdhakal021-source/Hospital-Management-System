from django.urls import path

from .views import (
    PatientDetailView,
    PatientListView,
    PatientRegistrationView,
)


urlpatterns = [
    path("", PatientListView.as_view(), name="patient-list"),
    path(
        "register/",
        PatientRegistrationView.as_view(),
        name="patient-register",
    ),
    path(
        "<int:pk>/",
        PatientDetailView.as_view(),
        name="patient-detail",
    ),
]