from django.core.exceptions import ValidationError
from django.db import transaction
from rest_framework import generics
from rest_framework.exceptions import ValidationError as DRFValidationError

from apps.medicines.models import MedicineBatch

from .models import Dispensing
from .permissions import CanManageDispensing
from .serializers import DispensingSerializer


class DispensingListCreateView(generics.ListCreateAPIView):
    serializer_class = DispensingSerializer
    permission_classes = [CanManageDispensing]

    def get_queryset(self):
        return Dispensing.objects.select_related(
            "prescription_item",
            "prescription_item__prescription",
            "prescription_item__medicine",
            "medicine_batch",
            "medicine_batch__medicine",
            "dispensed_by",
        ).all()
        

    def perform_create(self, serializer):
        with transaction.atomic():
            batch = MedicineBatch.objects.select_for_update().select_related(
                "medicine"
            ).get(
                pk=serializer.validated_data["medicine_batch"].pk
            )

            quantity = serializer.validated_data["quantity"]

            if batch.is_expired():
                raise DRFValidationError(
                    {
                        "medicine_batch": (
                            "Expired medicine batches cannot be dispensed."
                        )
                    }
                )

            if quantity > batch.quantity:
                raise DRFValidationError(
                    {
                        "quantity": (
                            "Dispensing quantity cannot be greater "
                            "than available stock."
                        )
                    }
                )

            batch.quantity -= quantity
            batch.save(update_fields=["quantity", "updated_at"])

            serializer.save(
                dispensed_by=self.request.user,
            )


class DispensingDetailView(generics.RetrieveAPIView):
    serializer_class = DispensingSerializer
    permission_classes = [CanManageDispensing]

    def get_queryset(self):
        return Dispensing.objects.select_related(
            "prescription_item",
            "prescription_item__prescription",
            "prescription_item__medicine",
            "medicine_batch",
            "medicine_batch__medicine",
            "dispensed_by",
        ).all()