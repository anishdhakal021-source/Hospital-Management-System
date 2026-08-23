from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Prescription,PrescriptionItem
from .permissions import CanManagePrescriptionItem,CanManagePrescriptions
from .serializers import PrescriptionItemSerializer,PrescriptionSerializer


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


# Prescription Item 

class PrescriptionItemListCreateView(generics.ListCreateAPIView):
    serializer_class = PrescriptionItemSerializer
    permission_classes = [CanManagePrescriptionItem]

    def get_queryset(self):
        queryset = PrescriptionItem.objects.select_related(
            "prescription",
            "medicine",
            "prescription__patient",
            "prescription__doctor",
        )

        if self.request.user.role == "ADMIN":
            return queryset

        return queryset.filter(
            prescription__doctor__user=self.request.user
        )


class PrescriptionItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PrescriptionItem.objects.select_related(
        "prescription",
        "medicine",
        "prescription__patient",
        "prescription__doctor",
    ).all()
    serializer_class = PrescriptionItemSerializer
    permission_classes = [CanManagePrescriptionItem]