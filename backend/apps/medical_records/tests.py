from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.departments.models import Department
from apps.doctors.models import Doctor
from apps.medical_records.models import MedicalRecord
from apps.patients.models import Patient


User = get_user_model()


class MedicalRecordAPITestCase(APITestCase):

    def setUp(self):
        self.department = Department.objects.create(
            name="General Medicine",
            description="General medical department",
        )

        self.patient_user = User.objects.create_user(
            username="patient1",
            password="TestPass123!",
            role="PATIENT",
        )

        self.patient2_user = User.objects.create_user(
            username="patient2",
            password="TestPass123!",
            role="PATIENT",
        )

        self.doctor_user = User.objects.create_user(
            username="doctor1",
            password="TestPass123!",
            role="DOCTOR",
        )

        self.doctor2_user = User.objects.create_user(
            username="doctor2",
            password="TestPass123!",
            role="DOCTOR",
        )

        self.admin_user = User.objects.create_user(
            username="admin1",
            password="TestPass123!",
            role="ADMIN",
        )

        self.receptionist_user = User.objects.create_user(
            username="receptionist1",
            password="TestPass123!",
            role="RECEPTIONIST",
        )

        self.patient = Patient.objects.create(
            user=self.patient_user,
            gender="Male",
        )

        self.patient2 = Patient.objects.create(
            user=self.patient2_user,
            gender="Female",
        )

        self.doctor = Doctor.objects.create(
            user=self.doctor_user,
            department=self.department,
            specialization="General Medicine",
            license_number="LIC-001",
            phone="9800000001",
            consultation_fee=500,
        )

        self.doctor2 = Doctor.objects.create(
            user=self.doctor2_user,
            department=self.department,
            specialization="Cardiology",
            license_number="LIC-002",
            phone="9800000002",
            consultation_fee=700,
        )

        self.record = MedicalRecord.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            diagnosis="Common cold",
            symptoms="Fever and cough",
            notes="Patient advised to rest.",
        )

        self.other_doctor_record = MedicalRecord.objects.create(
            patient=self.patient2,
            doctor=self.doctor2,
            diagnosis="Migraine",
            symptoms="Headache",
            notes="Follow-up required.",
        )

        self.list_url = reverse(
            "medical-record-list-create"
        )

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def test_doctor_can_create_medical_record(self):
        self.authenticate(self.doctor_user)

        response = self.client.post(
            self.list_url,
            {
                "patient_id": self.patient.id,
                "doctor_id": self.doctor.id,
                "diagnosis": "Flu",
                "symptoms": "Fever",
                "notes": "Rest recommended.",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

    def test_patient_cannot_create_medical_record(self):
        self.authenticate(self.patient_user)

        response = self.client.post(
            self.list_url,
            {
                "patient_id": self.patient.id,
                "doctor_id": self.doctor.id,
                "diagnosis": "Flu",
                "symptoms": "Fever",
                "notes": "Test",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_patient_can_view_own_records(self):
        self.authenticate(self.patient_user)

        response = self.client.get(self.list_url)

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
            self.record.id,
        )

    def test_patient_cannot_view_another_patients_record(self):
        self.authenticate(self.patient2_user)

        url = reverse(
            "medical-record-detail",
            kwargs={"pk": self.record.id},
        )

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_doctor_can_view_own_records(self):
        self.authenticate(self.doctor_user)

        response = self.client.get(self.list_url)

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
            self.record.id,
        )

    def test_doctor_cannot_view_another_doctors_record(self):
        self.authenticate(self.doctor_user)

        url = reverse(
            "medical-record-detail",
            kwargs={"pk": self.other_doctor_record.id},
        )

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_patient_cannot_modify_medical_record(self):
        self.authenticate(self.patient_user)

        url = reverse(
            "medical-record-detail",
            kwargs={"pk": self.record.id},
        )

        response = self.client.patch(
            url,
            {
                "diagnosis": "Changed by patient",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_receptionist_cannot_access_medical_records(self):
        self.authenticate(self.receptionist_user)

        response = self.client.get(self.list_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            response.data,
            [],
        )

    def test_admin_can_view_all_medical_records(self):
        self.authenticate(self.admin_user)

        response = self.client.get(self.list_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            len(response.data),
            2,
        )