from django.urls import path

from .views import (
    DoctorDetailView,
    DoctorListCreateView,
    DoctorRegistrationView,
)


urlpatterns = [
    path(
        "",
        DoctorListCreateView.as_view(),
        name="doctor-list-create",
    ),
    path(
        "register/",
        DoctorRegistrationView.as_view(),
        name="doctor-register",
    ),
    path(
        "<int:pk>/",
        DoctorDetailView.as_view(),
        name="doctor-detail",
    ),
]