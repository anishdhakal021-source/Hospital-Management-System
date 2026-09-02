from rest_framework import generics

from .models import Patient
from .permissions import CanCreatePatient, IsPatientOrStaff
from .serializers import PatientSerializer


class PatientListView(generics.ListCreateAPIView):
    queryset = Patient.objects.select_related("user")
    serializer_class = PatientSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        if self.request.user.role == "PATIENT":
            return queryset.filter(user=self.request.user)

        return queryset

    def get_permissions(self):
        if self.request.method == "POST":
            return [CanCreatePatient()]

        return [IsPatientOrStaff()]


class PatientDetailView(generics.RetrieveUpdateAPIView):
    queryset = Patient.objects.select_related("user")
    serializer_class = PatientSerializer
    permission_classes = [IsPatientOrStaff]