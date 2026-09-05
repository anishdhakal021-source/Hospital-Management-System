from rest_framework import generics

from .models import Department
from .permissions import CanReadDepartments, IsDepartmentManager
from .serializers import DepartmentSerializer


class DepartmentListCreateView(generics.ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [CanReadDepartments()]

        return [IsDepartmentManager()]


class DepartmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [CanReadDepartments()]

        return [IsDepartmentManager()]