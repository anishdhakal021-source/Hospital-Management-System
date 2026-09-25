from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import Department
from .permissions import CanReadDepartments, IsDepartmentManager
from .serializers import DepartmentSerializer


class PublicDepartmentListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = DepartmentSerializer
    queryset = Department.objects.filter(is_active=True)


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