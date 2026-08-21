from rest_framework import generics

from .models import Doctor
from .permissions import CanReadDoctors, IsDoctorManager
from .serializers import DoctorSerializer


class DoctorListCreateView(generics.ListCreateAPIView):
    serializer_class = DoctorSerializer

    def get_queryset(self):
        queryset = Doctor.objects.select_related(
            "user",
            "department",
        )

        if self.request.user.role in {"ADMIN", "RECEPTIONIST"}:
            return queryset

        return queryset.filter(
            is_available=True,
            department__is_active=True,
        )

    def get_permissions(self):
        if self.request.method == "GET":
            return [CanReadDoctors()]

        return [IsDoctorManager()]


class DoctorDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DoctorSerializer

    def get_queryset(self):
        queryset = Doctor.objects.select_related(
            "user",
            "department",
        )

        if self.request.user.role in {"ADMIN", "RECEPTIONIST"}:
            return queryset

        return queryset.filter(
            is_available=True,
            department__is_active=True,
        )

    def get_permissions(self):
        if self.request.method == "GET":
            return [CanReadDoctors()]

        return [IsDoctorManager()]