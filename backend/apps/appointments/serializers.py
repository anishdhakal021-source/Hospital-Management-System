from django.utils import timezone
from rest_framework import serializers

from apps.doctors.models import Doctor
from apps.patients.models import Patient

from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    patient_id = serializers.PrimaryKeyRelatedField(
        source="patient",
        queryset=Patient.objects.select_related("user"),
        write_only=True,
    )

    doctor_id = serializers.PrimaryKeyRelatedField(
        source="doctor",
        queryset=Doctor.objects.select_related(
            "user",
            "department",
        ),
        write_only=True,
    )

    patient_name = serializers.CharField(
        source="patient.user.get_full_name",
        read_only=True,
    )

    doctor_name = serializers.CharField(
        source="doctor.user.get_full_name",
        read_only=True,
    )

    department_name = serializers.CharField(
        source="doctor.department.name",
        read_only=True,
    )

    class Meta:
        model = Appointment

        fields = [
            "id",
            "patient_id",
            "patient_name",
            "doctor_id",
            "doctor_name",
            "department_name",
            "appointment_date",
            "status",
            "reason",
            "notes",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "patient_name",
            "doctor_name",
            "department_name",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        patient = attrs.get(
            "patient",
            self.instance.patient if self.instance else None,
        )

        doctor = attrs.get(
            "doctor",
            self.instance.doctor if self.instance else None,
        )

        appointment_date = attrs.get(
            "appointment_date",
            self.instance.appointment_date if self.instance else None,
        )

        request = self.context["request"]

        
        # Patient ownership validation
        if request.user.role == "PATIENT":
            if patient.user != request.user:
                raise serializers.ValidationError(
                    {
                        "patient_id":(
                            "Patients can only create appointments"
                            "for themselves."
                        )
                    }
                )

        # Future appointment validation
        if appointment_date <= timezone.now():
            raise serializers.ValidationError(
                {
                    "appointment_date": (
                        "Appointment must be scheduled for a future date and time."
                    )
                }
            )

        # Doctor availability
        if not doctor.is_available:
            raise serializers.ValidationError(
                {
                    "doctor_id": (
                        "This doctor is currently unavailable."
                    )
                }
            )

        # Department availability
        if not doctor.department.is_active:
            raise serializers.ValidationError(
                {
                    "doctor_id": (
                        "This doctor's department is inactive."
                    )
                }
            )
        
        # Role validation
        if patient.user.role != "PATIENT":
            raise serializers.ValidationError(
                {
                    "patient_id": (
                        "The selected user is not a patient."
                    )
                }
            )

        if doctor.user.role != "DOCTOR":
            raise serializers.ValidationError(
                {
                    "doctor_id": (
                        "The selected user is not a doctor."
                    )
                }
            )
        
        # Status/role validation
        new_status = attrs.get(
            "status",
            self.instance.status if self.instance else Appointment.Status.SCHEDULED,
        )

        if self.instance and new_status != self.instance.status:

            if request.user.role == "PATIENT":
                if new_status != Appointment.Status.CANCELLED:
                    raise serializers.ValidationError(
                        {
                            "status": (
                                "Patients can only cancel their appointments."
                            )
                        }
                    )

            elif request.user.role == "DOCTOR":
                if new_status not in {
                    Appointment.Status.COMPLETED,
                    Appointment.Status.NO_SHOW,
                }:
                    raise serializers.ValidationError(
                        {
                            "status": (
                                "Doctors can only mark appointments "
                                "as completed or no-show."
                            )
                        }
                    )

        return attrs

    def validate_status(self, value):
        """
        Prevent invalid appointment status transitions.
        """

        if not self.instance:
            if value != Appointment.Status.SCHEDULED:
                raise serializers.ValidationError(
                    "New appointments must start as SCHEDULED."
                )

            return value

        current_status = self.instance.status

        if current_status != Appointment.Status.SCHEDULED:
            if value != current_status:
                raise serializers.ValidationError(
                    f"An appointment with status "
                    f"{current_status} cannot be changed."
                )

        allowed_transitions = {
            Appointment.Status.SCHEDULED: {
                Appointment.Status.SCHEDULED,
                Appointment.Status.COMPLETED,
                Appointment.Status.CANCELLED,
                Appointment.Status.NO_SHOW,
            },
            Appointment.Status.COMPLETED: {
                Appointment.Status.COMPLETED,
            },
            Appointment.Status.CANCELLED: {
                Appointment.Status.CANCELLED,
            },
            Appointment.Status.NO_SHOW: {
                Appointment.Status.NO_SHOW,
            },
        }

        if value not in allowed_transitions[current_status]:
            raise serializers.ValidationError(
                f"Invalid status transition: "
                f"{current_status} → {value}."
            )

        return value