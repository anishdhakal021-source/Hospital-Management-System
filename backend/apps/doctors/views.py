from django.db import transaction
from rest_framework import generics, status
from rest_framework.response import Response

from apps.users.models import User

from .models import Doctor
from .permissions import CanReadDoctors, IsDoctorManager
from .serializers import DoctorRegistrationSerializer, DoctorSerializer


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

    @transaction.atomic
    def perform_destroy(self, instance):
        user = instance.user

        instance.delete()
        user.delete()


class DoctorRegistrationView(generics.CreateAPIView):
    serializer_class = DoctorRegistrationSerializer
    permission_classes = [IsDoctorManager]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        user = User.objects.create_user(
            username=data["username"],
            password=data["password"],
            email=data.get("email", ""),
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""),
            role=User.Role.DOCTOR,
        )

        doctor = Doctor.objects.create(
            user=user,
            department=data["department"],
            specialization=data["specialization"],
            license_number=data["license_number"],
            phone=data["phone"],
            consultation_fee=data["consultation_fee"],
            is_available=data.get("is_available", True),
        )

        response_serializer = DoctorSerializer(doctor)

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
        )