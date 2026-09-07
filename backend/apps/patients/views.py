from django.db import transaction
from rest_framework import generics, status
from rest_framework.response import Response

from apps.users.models import User

from .models import Patient
from .permissions import CanCreatePatient, IsPatientOrStaff
from .serializers import PatientRegistrationSerializer, PatientSerializer


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


# Patient Registration View
class PatientRegistrationView(generics.CreateAPIView):
    serializer_class = PatientRegistrationSerializer
    permission_classes = [CanCreatePatient]

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
            role=User.Role.PATIENT,
        )

        patient = Patient.objects.create(
            user=user,
            date_of_birth=data.get("date_of_birth"),
            gender=data.get("gender", ""),
            phone=data.get("phone", ""),
            address=data.get("address", ""),
            blood_group=data.get("blood_group", ""),
            emergency_contact=data.get("emergency_contact", ""),
        )

        response_serializer = PatientSerializer(patient)

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
        )