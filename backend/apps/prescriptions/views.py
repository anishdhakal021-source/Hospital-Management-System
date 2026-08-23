from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Prescription
from .permissions import CanManagePrescriptions
from .serializers import PrescriptionSerializer


class PrescriptionListCreateView(
    generics.ListCreateAPIView
):
    serializer_class = PrescriptionSerializer

    def get_queryset(self):
        user = self.request.user

        if user.role == "PATIENT":
            return Prescription.objects.filter(
                patient__user=user
            )

        if user.role == "DOCTOR":
            return Prescription.objects.filter(
                doctor__user=user
            )

        if user.role == "ADMIN":
            return Prescription.objects.all()

        return Prescription.objects.none()

    def get_permissions(self):
        if self.request.method == "POST":
            return [
                IsAuthenticated(),
                CanManagePrescriptions(),
            ]

        return [
            IsAuthenticated(),
        ]

    def perform_create(self, serializer):
        doctor = serializer.validated_data["doctor"]

        if (
            self.request.user.role == "DOCTOR"
            and doctor.user_id != self.request.user.id
        ):
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied(
                "You can only create prescriptions for yourself."
            )

        serializer.save()


class PrescriptionDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = PrescriptionSerializer

    def get_queryset(self):
        user = self.request.user

        if user.role == "PATIENT":
            return Prescription.objects.filter(
                patient__user=user
            )

        if user.role == "DOCTOR":
            return Prescription.objects.filter(
                doctor__user=user
            )

        if user.role == "ADMIN":
            return Prescription.objects.all()

        return Prescription.objects.none()

    def get_permissions(self):
        if self.request.method in {
            "PUT",
            "PATCH",
            "DELETE",
        }:
            return [
                IsAuthenticated(),
                CanManagePrescriptions(),
            ]

        return [
            IsAuthenticated(),
        ]