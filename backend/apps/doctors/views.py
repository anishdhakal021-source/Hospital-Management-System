from rest_framework import generics

from .models import Doctor
from .permissions import CanCreateDoctor, IsDoctorOrStaff
from .serializers import DoctorSerializer


class DoctorListView(generics.ListCreateAPIView):
    queryset = Doctor.objects.select_related("user")
    serializer_class = DoctorSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [CanCreateDoctor()]

        return [IsDoctorOrStaff()]


class DoctorDetailView(generics.RetrieveUpdateAPIView):
    queryset = Doctor.objects.select_related("user")
    serializer_class = DoctorSerializer
    permission_classes = [IsDoctorOrStaff]