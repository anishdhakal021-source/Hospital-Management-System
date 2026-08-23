from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.medicines.models import Medicine
from apps.users.models import User


class MedicinePermissionAPITestCase(APITestCase):
    def setUp(self):
        self.medicine = Medicine.objects.create(
            name="Paracetamol 500mg",
            generic_name="Paracetamol",
            category="Analgesic",
            manufacturer="Test Pharma",
        )

        self.admin = User.objects.create_user(
            username="medicine_admin",
            password="TestPass123!",
            role="ADMIN",
        )

        self.doctor = User.objects.create_user(
            username="medicine_doctor",
            password="TestPass123!",
            role="DOCTOR",
        )

        self.pharmacist = User.objects.create_user(
            username="medicine_pharmacist",
            password="TestPass123!",
            role="PHARMACIST",
        )

        self.receptionist = User.objects.create_user(
            username="medicine_receptionist",
            password="TestPass123!",
            role="RECEPTIONIST",
        )

        self.patient = User.objects.create_user(
            username="medicine_patient",
            password="TestPass123!",
            role="PATIENT",
        )

        self.list_url = reverse("medicine-list-create")
        self.detail_url = reverse(
            "medicine-detail",
            kwargs={"pk": self.medicine.id},
        )

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def test_doctor_can_view_medicines(self):
        self.authenticate(self.doctor)

        response = self.client.get(self.list_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_pharmacist_can_create_medicine(self):
        self.authenticate(self.pharmacist)

        response = self.client.post(
            self.list_url,
            {
                "name": "Amoxicillin 500mg",
                "generic_name": "Amoxicillin",
                "category": "Antibiotic",
                "manufacturer": "Test Pharma",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

    def test_doctor_cannot_create_medicine(self):
        self.authenticate(self.doctor)

        response = self.client.post(
            self.list_url,
            {
                "name": "Amoxicillin 500mg",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_patient_cannot_view_medicines(self):
        self.authenticate(self.patient)

        response = self.client.get(self.list_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_pharmacist_can_update_medicine(self):
        self.authenticate(self.pharmacist)

        response = self.client.patch(
            self.detail_url,
            {
                "description": "Updated medicine description.",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_pharmacist_cannot_delete_medicine(self):
        self.authenticate(self.pharmacist)

        response = self.client.delete(self.detail_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_admin_can_delete_medicine(self):
        self.authenticate(self.admin)

        response = self.client.delete(self.detail_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )