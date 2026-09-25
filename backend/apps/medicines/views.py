from django.db.models.deletion import ProtectedError
from rest_framework import generics, serializers

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

    def perform_destroy(self, instance):
        try:
            instance.delete()
        except ProtectedError:
            raise serializers.ValidationError(
                {
                    "detail": (
                        "This medicine cannot be deleted because "
                        "it is used in existing prescriptions. "
                        "Deactivate it instead."
                    )
                }
            )


# Medicine Batch

class MedicineBatchListCreateView(generics.ListCreateAPIView):
    queryset = MedicineBatch.objects.select_related("medicine").all()
    serializer_class = MedicineBatchSerializer
    permission_classes = [CanManageMedicineBatches]


class MedicineBatchDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MedicineBatch.objects.select_related("medicine").all()
    serializer_class = MedicineBatchSerializer
    permission_classes = [CanManageMedicineBatches]