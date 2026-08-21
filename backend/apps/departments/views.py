# from django.shortcuts import render
from rest_framework import generics

from .models import Department
from .permissions import IsAdminOrReadOnly
from .serializers import DepartmentSerializer
# Create your views here.

class DepartmentListCreateView(generics.ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAdminOrReadOnly]