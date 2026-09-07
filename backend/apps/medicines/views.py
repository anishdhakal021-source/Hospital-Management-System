from rest_framework import generics

from .models import Medicine, MedicineBatch
from .permissions import (
    CanManageMedicineBatches,
    CanManageMedicines,
)
from .serializers import (
    MedicineBatchSerializer,
    MedicineSerializer,
)


class MedicineListCreateView(generics.ListCreateAPIView):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    permission_classes = [CanManageMedicines]


class MedicineDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    permission_classes = [CanManageMedicines]



# Medicine Batch

class MedicineBatchListCreateView(generics.ListCreateAPIView):
    queryset = MedicineBatch.objects.select_related("medicine").all()
    serializer_class = MedicineBatchSerializer
    permission_classes = [CanManageMedicineBatches]


class MedicineBatchDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MedicineBatch.objects.select_related("medicine").all()
    serializer_class = MedicineBatchSerializer
    permission_classes = [CanManageMedicineBatches]