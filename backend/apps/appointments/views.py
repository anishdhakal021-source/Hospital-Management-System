from rest_framework import generics

from .models import Appointment
from .permissions import CanManageAppointments
from .serializers import AppointmentSerializer


class AppointmentListCreateView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [CanManageAppointments]

    def get_queryset(self):
        queryset = Appointment.objects.select_related(
            "patient__user",
            "doctor__user",
            "doctor__department",
        )

        user = self.request.user

        if user.role in {"ADMIN", "RECEPTIONIST"}:
            return queryset

        if user.role == "PATIENT":
            return queryset.filter(
                patient__user=user,
            )

        if user.role == "DOCTOR":
            return queryset.filter(
                doctor__user=user,
            )

        return queryset.none()


class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [CanManageAppointments]

    def get_queryset(self):
        queryset = Appointment.objects.select_related(
            "patient__user",
            "doctor__user",
            "doctor__department",
        )

        user = self.request.user

        if user.role in {"ADMIN", "RECEPTIONIST"}:
            return queryset

        if user.role == "PATIENT":
            return queryset.filter(patient__user=user)

        if user.role == "DOCTOR":
            return queryset.filter(doctor__user=user)

        return queryset.none()

    def perform_destroy(self, instance):
        if self.request.user.role not in {"ADMIN", "RECEPTIONIST"}:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied(
                "Only administrators and receptionists can delete appointments."
            )

        instance.delete()