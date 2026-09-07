from datetime import timedelta

from apps.appointments.models import Appointment
from apps.departments.models import Department
from apps.doctors.models import Doctor
from apps.patients.models import Patient
from apps.users.models import User
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase


class AppointmentAPITestCase(APITestCase):

    def setUp(self):
        self.admin = User.objects.create_user(
            username="testadmin",
            password="TestAdmin123",
            role=User.Role.ADMIN,
        )

        self.patient_user = User.objects.create_user(
            username="testpatient",
            password="TestPatient123",
            role=User.Role.PATIENT,
        )

        self.other_patient_user = User.objects.create_user(
            username="otherpatient",
            password="OtherPatient123",
            role=User.Role.PATIENT,
        )

        self.doctor_user = User.objects.create_user(
            username="testdoctor",
            password="TestDoctor123",
            role=User.Role.DOCTOR,
        )

        self.other_doctor_user = User.objects.create_user(
            username="otherdoctor",
            password="OtherDoctor123",
            role=User.Role.DOCTOR,
        )

        self.department = Department.objects.create(
            name="Cardiology",
            description="Heart department",
            is_active=True,
        )

        self.patient = Patient.objects.create(
            user=self.patient_user,
        )

        self.other_patient = Patient.objects.create(
            user=self.other_patient_user,
        )

        self.doctor = Doctor.objects.create(
            user=self.doctor_user,
            department=self.department,
            specialization="Cardiology",
            license_number="LIC-TEST-001",
            phone="9800000001",
            consultation_fee=1000,
            is_available=True,
        )

        self.other_doctor = Doctor.objects.create(
            user=self.other_doctor_user,
            department=self.department,
            specialization="Cardiology",
            license_number="LIC-TEST-002",
            phone="9800000002",
            consultation_fee=1000,
            is_available=True,
        )

        self.receptionist = User.objects.create_user(
            username="testreceptionist",
            password="TestReceptionist123",
            role=User.Role.RECEPTIONIST,
        )

        self.url = reverse("appointment-list-create")

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def future_time(self, hours=24):
        return timezone.now() + timedelta(hours=hours)

    def test_patient_can_create_own_appointment(self):
        self.authenticate(self.patient_user)

        response = self.client.post(
            self.url,
            {
                "patient_id": self.patient.id,
                "doctor_id": self.doctor.id,
                "appointment_date": self.future_time().isoformat(),
                "reason": "General consultation",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.assertEqual(
            Appointment.objects.count(),
            1,
        )

    def test_patient_cannot_create_appointment_for_other_patient(self):
        self.authenticate(self.patient_user)

        response = self.client.post(
            self.url,
            {
                "patient_id": self.other_patient.id,
                "doctor_id": self.doctor.id,
                "appointment_date": self.future_time().isoformat(),
                "reason": "Unauthorized appointment",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_patient_cannot_book_past_appointment(self):
        self.authenticate(self.patient_user)

        past_time = timezone.now() - timedelta(hours=1)

        response = self.client.post(
            self.url,
            {
                "patient_id": self.patient.id,
                "doctor_id": self.doctor.id,
                "appointment_date": past_time.isoformat(),
                "reason": "Past appointment",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_unavailable_doctor_cannot_be_booked(self):
        self.doctor.is_available = False
        self.doctor.save()

        self.authenticate(self.patient_user)

        response = self.client.post(
            self.url,
            {
                "patient_id": self.patient.id,
                "doctor_id": self.doctor.id,
                "appointment_date": self.future_time().isoformat(),
                "reason": "Unavailable doctor",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_patient_only_sees_own_appointments(self):
        appointment = Appointment.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            appointment_date=self.future_time(),
            reason="Own appointment",
        )

        Appointment.objects.create(
            patient=self.other_patient,
            doctor=self.doctor,
            appointment_date=self.future_time(hours=48),
            reason="Other appointment",
        )

        self.authenticate(self.patient_user)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            len(response.data),
            1,
        )

        self.assertEqual(
            response.data[0]["id"],
            appointment.id,
        )

    def test_patient_can_cancel_own_appointment(self):
        appointment = Appointment.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            appointment_date=self.future_time(),
        )

        self.authenticate(self.patient_user)

        response = self.client.patch(
            reverse(
                "appointment-detail",
                kwargs={"pk": appointment.id},
            ),
            {
                "status": Appointment.Status.CANCELLED,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        appointment.refresh_from_db()

        self.assertEqual(
            appointment.status,
            Appointment.Status.CANCELLED,
        )

    def test_patient_cannot_complete_appointment(self):
        appointment = Appointment.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            appointment_date=self.future_time(),
        )

        self.authenticate(self.patient_user)

        response = self.client.patch(
            reverse(
                "appointment-detail",
                kwargs={"pk": appointment.id},
            ),
            {
                "status": Appointment.Status.COMPLETED,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_doctor_can_complete_appointment(self):
        appointment = Appointment.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            appointment_date=self.future_time(),
        )

        self.authenticate(self.doctor_user)

        response = self.client.patch(
            reverse(
                "appointment-detail",
                kwargs={"pk": appointment.id},
            ),
            {
                "status": Appointment.Status.COMPLETED,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        appointment.refresh_from_db()

        self.assertEqual(
            appointment.status,
            Appointment.Status.COMPLETED,
        )

    def test_completed_appointment_cannot_be_reopened(self):
        appointment = Appointment.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            appointment_date=self.future_time(),
            status=Appointment.Status.COMPLETED,
        )

        self.authenticate(self.doctor_user)

        response = self.client.patch(
            reverse(
                "appointment-detail",
                kwargs={"pk": appointment.id},
            ),
            {
                "status": Appointment.Status.SCHEDULED,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_patient_cannot_access_other_patient_appointment(self):
        appointment = Appointment.objects.create(
            patient=self.other_patient,
            doctor=self.doctor,
            appointment_date=self.future_time(),
        )

        self.authenticate(self.patient_user)

        response = self.client.get(
            reverse(
                "appointment-detail",
                kwargs={"pk": appointment.id},
            )
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_doctor_cannot_be_double_booked(self):
        appointment_time = self.future_time()

        Appointment.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            appointment_date=appointment_time,
        )

        self.authenticate(self.patient_user)

        response = self.client.post(
            self.url,
            {
                "patient_id": self.patient.id,
                "doctor_id": self.doctor.id,
                "appointment_date": appointment_time.isoformat(),
                "reason": "Second appointment",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_doctor_cannot_access_other_doctors_appointment(self):
        appointment = Appointment.objects.create(
            patient=self.patient,
            doctor=self.other_doctor,
            appointment_date=self.future_time(),
        )

        self.authenticate(self.doctor_user)

        response = self.client.patch(
            reverse(
                "appointment-detail",
                kwargs={"pk": appointment.id},
            ),
            {
                "status": Appointment.Status.COMPLETED,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

        appointment.refresh_from_db()

        self.assertEqual(
            appointment.status,
            Appointment.Status.SCHEDULED,
        )

    def test_patient_cannot_delete_own_appointment(self):
        appointment = Appointment.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            appointment_date=self.future_time(),
        )

        self.authenticate(self.patient_user)

        response = self.client.delete(
            reverse(
                "appointment-detail",
                kwargs={"pk": appointment.id},
            )
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

        self.assertTrue(
            Appointment.objects.filter(id=appointment.id).exists()
        )

    def test_admin_can_delete_appointment(self):
        appointment = Appointment.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            appointment_date=self.future_time(),
        )

        self.authenticate(self.admin)

        response = self.client.delete(
            reverse(
                "appointment-detail",
                kwargs={"pk": appointment.id},
            )
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        self.assertFalse(
            Appointment.objects.filter(id=appointment.id).exists()
        )

    def test_receptionist_can_delete_appointment(self):
        appointment = Appointment.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            appointment_date=self.future_time(),
        )

        self.authenticate(self.receptionist)

        response = self.client.delete(
            reverse(
                "appointment-detail",
                kwargs={"pk": appointment.id},
            )
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        self.assertFalse(
            Appointment.objects.filter(id=appointment.id).exists()
        )

    def test_doctor_cannot_cancel_appointment(self):
        appointment = Appointment.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            appointment_date=self.future_time(),
        )

        self.authenticate(self.doctor_user)

        response = self.client.patch(
            reverse(
                "appointment-detail",
                kwargs={"pk": appointment.id},
            ),
            {
                "status": Appointment.Status.CANCELLED,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        appointment.refresh_from_db()

        self.assertEqual(
            appointment.status,
            Appointment.Status.SCHEDULED,
        )

    def test_doctor_can_mark_appointment_no_show(self):
        appointment = Appointment.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            appointment_date=self.future_time(),
        )

        self.authenticate(self.doctor_user)

        response = self.client.patch(
            reverse(
                "appointment-detail",
                kwargs={"pk": appointment.id},
            ),
            {
                "status": Appointment.Status.NO_SHOW,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        appointment.refresh_from_db()

        self.assertEqual(
            appointment.status,
            Appointment.Status.NO_SHOW,
        )

    def test_doctor_can_complete_past_scheduled_appointment(self):
        appointment = Appointment.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            appointment_date=timezone.now() - timedelta(minutes=30),
            status=Appointment.Status.SCHEDULED,
        )

        self.authenticate(self.doctor_user)

        response = self.client.patch(
            reverse(
                "appointment-detail",
                kwargs={"pk": appointment.id},
            ),
            {
                "status": Appointment.Status.COMPLETED,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        appointment.refresh_from_db()

        self.assertEqual(
            appointment.status,
            Appointment.Status.COMPLETED,
        )

    def test_doctor_can_mark_past_scheduled_appointment_no_show(self):
        appointment = Appointment.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            appointment_date=timezone.now() - timedelta(minutes=30),
            status=Appointment.Status.SCHEDULED,
        )

        self.authenticate(self.doctor_user)

        response = self.client.patch(
            reverse(
                "appointment-detail",
                kwargs={"pk": appointment.id},
            ),
            {
                "status": Appointment.Status.NO_SHOW,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        appointment.refresh_from_db()

        self.assertEqual(
            appointment.status,
            Appointment.Status.NO_SHOW,
        )

    def test_cancelled_appointment_does_not_block_doctor_time_slot(self):
        appointment_time = self.future_time()

        Appointment.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            appointment_date=appointment_time,
            status=Appointment.Status.CANCELLED,
        )

        self.authenticate(self.other_patient_user)

        response = self.client.post(
            self.url,
            {
                "patient_id": self.other_patient.id,
                "doctor_id": self.doctor.id,
                "appointment_date": appointment_time.isoformat(),
                "reason": "New appointment after cancellation",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.assertEqual(
            Appointment.objects.filter(
                doctor=self.doctor,
                appointment_date=appointment_time,
            ).count(),
            2,
        )