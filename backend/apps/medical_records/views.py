from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import MedicalRecord
from .permissions import CanManageMedicalRecords
from .serializers import MedicalRecordSerializer


class MedicalRecordListCreateView(
    generics.ListCreateAPIView
):
    serializer_class = MedicalRecordSerializer

    def get_queryset(self):
        user = self.request.user

        if user.role == "PATIENT":
            return MedicalRecord.objects.filter(
                patient__user=user
            )

        if user.role == "DOCTOR":
            return MedicalRecord.objects.filter(
                doctor__user=user
            )

        if user.role == "ADMIN":
            return MedicalRecord.objects.all()

        return MedicalRecord.objects.none()

    def get_permissions(self):
        if self.request.method == "POST":
            return [
                IsAuthenticated(),
                CanManageMedicalRecords(),
            ]

        return [
            IsAuthenticated(),
        ]


class MedicalRecordDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = MedicalRecordSerializer

    def get_queryset(self):
        user = self.request.user

        if user.role == "PATIENT":
            return MedicalRecord.objects.filter(
                patient__user=user
            )

        if user.role == "DOCTOR":
            return MedicalRecord.objects.filter(
                doctor__user=user
            )

        if user.role == "ADMIN":
            return MedicalRecord.objects.all()

        return MedicalRecord.objects.none()

    def get_permissions(self):
        if self.request.method in {
            "PUT",
            "PATCH",
            "DELETE",
        }:
            return [
                IsAuthenticated(),
                CanManageMedicalRecords(),
            ]

        return [
            IsAuthenticated(),
        ]