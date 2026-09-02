from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.medicines.models import Medicine,MedicineBatch
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

        self.batch = MedicineBatch.objects.create(
            medicine=self.medicine,
            batch_number="BATCH-001",
            expiry_date="2027-12-31",
            quantity=100,
            purchase_price=50,
            selling_price=75,
        )

        self.list_url = reverse("medicine-list-create")
        self.detail_url = reverse(
            "medicine-detail",
            kwargs={"pk": self.medicine.id},
        )
        self.batch_list_url = reverse(
            "medicine-batch-list-create"
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

        # Medicine cannot be deleted while batches reference it.
        self.batch.delete()

        response = self.client.delete(self.detail_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

    def test_pharmacist_can_create_batch(self):
        self.authenticate(self.pharmacist)

        response = self.client.post(
            self.batch_list_url,
            {
                "medicine": self.medicine.id,
                "batch_number": "BATCH-002",
                "expiry_date": "2027-12-31",
                "quantity": 50,
                "purchase_price": "40.00",
                "selling_price": "60.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )


    def test_doctor_can_view_batches(self):
        self.authenticate(self.doctor)

        response = self.client.get(
            self.batch_list_url
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            len(response.data),
            1,
        )


    def test_patient_cannot_view_batches(self):
        self.authenticate(self.patient)

        response = self.client.get(
            self.batch_list_url
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )


    def test_pharmacist_cannot_delete_batch(self):
        self.authenticate(self.pharmacist)

        url = reverse(
            "medicine-batch-detail",
            kwargs={"pk": self.batch.id},
        )

        response = self.client.delete(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )


    def test_admin_can_delete_batch(self):
        self.authenticate(self.admin)

        url = reverse(
            "medicine-batch-detail",
            kwargs={"pk": self.batch.id},
        )

        response = self.client.delete(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

    def test_negative_quantity_is_rejected(self):
        self.authenticate(self.pharmacist)

        response = self.client.post(
            self.batch_list_url,
            {
                "medicine": self.medicine.id,
                "batch_number": "BATCH-003",
                "expiry_date": "2027-12-31",
                "quantity": -10,
                "purchase_price": "40.00",
                "selling_price": "60.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )


    def test_expired_batch_is_rejected(self):
        self.authenticate(self.pharmacist)

        response = self.client.post(
            self.batch_list_url,
            {
                "medicine": self.medicine.id,
                "batch_number": "BATCH-004",
                "expiry_date": "2025-01-01",
                "quantity": 10,
                "purchase_price": "40.00",
                "selling_price": "60.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )


    def test_selling_price_cannot_be_lower_than_purchase_price(self):
        self.authenticate(self.pharmacist)

        response = self.client.post(
            self.batch_list_url,
            {
                "medicine": self.medicine.id,
                "batch_number": "BATCH-005",
                "expiry_date": "2027-12-31",
                "quantity": 10,
                "purchase_price": "100.00",
                "selling_price": "80.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_duplicate_batch_number_for_same_medicine_is_rejected(self):
        self.authenticate(self.pharmacist)

        response = self.client.post(
            self.batch_list_url,
            {
                "medicine": self.medicine.id,
                "batch_number": "BATCH-001",
                "expiry_date": "2028-12-31",
                "quantity": 20,
                "purchase_price": "30.00",
                "selling_price": "50.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_same_batch_number_allowed_for_different_medicine(self):
        another_medicine = Medicine.objects.create(
            name="Ibuprofen 400mg",
        )

        self.authenticate(self.pharmacist)

        response = self.client.post(
            self.batch_list_url,
            {
                "medicine": another_medicine.id,
                "batch_number": "BATCH-001",
                "expiry_date": "2028-12-31",
                "quantity": 20,
                "purchase_price": "30.00",
                "selling_price": "50.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

    def test_pharmacist_can_update_batch(self):
        self.authenticate(self.pharmacist)

        url = reverse(
            "medicine-batch-detail",
            kwargs={"pk": self.batch.id},
        )

        response = self.client.patch(
            url,
            {
                "quantity": 150,
                "selling_price": "80.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.batch.refresh_from_db()

        self.assertEqual(
            self.batch.quantity,
            150,
        )

        self.assertEqual(
            self.batch.selling_price,
            80,
        )