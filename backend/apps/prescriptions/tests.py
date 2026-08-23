from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.departments.models import Department
from apps.doctors.models import Doctor
from apps.medical_records.models import MedicalRecord
from apps.patients.models import Patient

from .models import Prescription


User = get_user_model()


class PrescriptionAPITestCase(APITestCase):

    def setUp(self):
        self.department = Department.objects.create(
            name="General Medicine",
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
            license_number="LIC-TEST-001",
            phone="9800000001",
            consultation_fee=500,
        )

        self.doctor2 = Doctor.objects.create(
            user=self.doctor2_user,
            department=self.department,
            specialization="Cardiology",
            license_number="LIC-TEST-002",
            phone="9800000002",
            consultation_fee=700,
        )

        self.medical_record = MedicalRecord.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            diagnosis="Common cold",
            symptoms="Fever",
            notes="Rest recommended.",
        )

        self.other_medical_record = MedicalRecord.objects.create(
            patient=self.patient2,
            doctor=self.doctor2,
            diagnosis="Migraine",
            symptoms="Headache",
            notes="Follow-up required.",
        )

        self.prescription = Prescription.objects.create(
            medical_record=self.medical_record,
            patient=self.patient,
            doctor=self.doctor,
            instructions="Take medicine after meals.",
            status="ACTIVE",
        )

        self.other_prescription = Prescription.objects.create(
            medical_record=self.other_medical_record,
            patient=self.patient2,
            doctor=self.doctor2,
            instructions="Take medicine before meals.",
            status="ACTIVE",
        )

        self.list_url = reverse(
            "prescription-list-create"
        )

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def test_doctor_can_create_prescription(self):
        self.authenticate(self.doctor_user)

        response = self.client.post(
            self.list_url,
            {
                "medical_record_id": self.medical_record.id,
                "patient_id": self.patient.id,
                "doctor_id": self.doctor.id,
                "instructions": "Take after meals.",
                "status": "ACTIVE",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

    def test_patient_cannot_create_prescription(self):
        self.authenticate(self.patient_user)

        response = self.client.post(
            self.list_url,
            {
                "medical_record_id": self.medical_record.id,
                "patient_id": self.patient.id,
                "doctor_id": self.doctor.id,
                "instructions": "Test",
                "status": "ACTIVE",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_patient_sees_only_own_prescriptions(self):
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
            self.prescription.id,
        )

    def test_patient_cannot_access_other_patient_prescription(self):
        self.authenticate(self.patient_user)

        url = reverse(
            "prescription-detail",
            kwargs={"pk": self.other_prescription.id},
        )

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_patient_cannot_modify_prescription(self):
        self.authenticate(self.patient_user)

        url = reverse(
            "prescription-detail",
            kwargs={"pk": self.prescription.id},
        )

        response = self.client.patch(
            url,
            {
                "instructions": "Changed by patient",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_doctor_sees_only_own_prescriptions(self):
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
            self.prescription.id,
        )

    def test_doctor_cannot_access_other_doctor_prescription(self):
        self.authenticate(self.doctor_user)

        url = reverse(
            "prescription-detail",
            kwargs={"pk": self.other_prescription.id},
        )

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_doctor_cannot_use_another_doctors_medical_record(self):
        self.authenticate(self.doctor_user)

        response = self.client.post(
            self.list_url,
            {
                "medical_record_id": self.other_medical_record.id,
                "patient_id": self.patient2.id,
                "doctor_id": self.doctor2.id,
                "instructions": "Unauthorized prescription.",
                "status": "ACTIVE",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_invalid_status_is_rejected(self):
        self.authenticate(self.doctor_user)

        response = self.client.post(
            self.list_url,
            {
                "medical_record_id": self.medical_record.id,
                "patient_id": self.patient.id,
                "doctor_id": self.doctor.id,
                "instructions": "Test",
                "status": "INVALID",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertEqual(
            Prescription.objects.count(),
            2,
        )