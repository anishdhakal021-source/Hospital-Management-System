from datetime import timedelta

from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.doctors.models import Doctor
from apps.medicines.models import Medicine, MedicineBatch
from apps.prescriptions.models import Prescription, PrescriptionItem
from apps.users.models import User

from .models import Dispensing


class DispensingAPITestCase(APITestCase):

    def setUp(self):
        # Create users with the roles required for the API tests.
        self.pharmacist = User.objects.create_user(
            username="testpharmacist",
            password="Pharmacist@123",
            role="PHARMACIST",
        )

        self.doctor_user = User.objects.create_user(
            username="testdoctor",
            password="Doctor@123",
            role="DOCTOR",
        )

        self.patient_user = User.objects.create_user(
            username="testpatient",
            password="Patient@123",
            role="PATIENT",
        )

        # Create a department and doctor profile.
        from apps.departments.models import Department
        from apps.patients.models import Patient

        department = Department.objects.create(
            name="General Medicine",
            description="General medicine department",
        )

        self.doctor = Doctor.objects.create(
            user=self.doctor_user,
            department=department,
            specialization="General Medicine",
            license_number="TEST-LICENSE-001",
            phone="9800000001",
            consultation_fee=500,
        )

        self.patient = Patient.objects.create(
            user=self.patient_user,
        )

        # Create medicine and a valid batch.
        self.medicine = Medicine.objects.create(
            name="Test Paracetamol",
            generic_name="Paracetamol",
            category="Painkiller",
            manufacturer="Test Pharma",
        )

        self.batch = MedicineBatch.objects.create(
            medicine=self.medicine,
            batch_number="TEST-BATCH-001",
            expiry_date=timezone.localdate() + timedelta(days=30),
            quantity=50,
            purchase_price=10,
            selling_price=15,
        )

        # Create prescription and prescription item.
        medical_record = self._create_medical_record()

        prescription = Prescription.objects.create(
            medical_record=medical_record,
            patient=self.patient,
            doctor=self.doctor,
            instructions="Take after meals.",
        )

        self.prescription_item = PrescriptionItem.objects.create(
            prescription=prescription,
            medicine=self.medicine,
            quantity=10,
            dosage="1 tablet",
            frequency="Twice daily",
            duration="5 days",
            instructions="Take after meals.",
        )

        self.url = reverse("dispensing-list-create")

    def _create_medical_record(self):
        from apps.medical_records.models import MedicalRecord

        return MedicalRecord.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            diagnosis="Test diagnosis",
            symptoms="Test symptoms",
            notes="Test notes",
        )

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def test_pharmacist_can_dispense_medicine(self):
        self.authenticate(self.pharmacist)

        response = self.client.post(
            self.url,
            {
                "prescription_item": self.prescription_item.id,
                "medicine_batch": self.batch.id,
                "quantity": 5,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        dispensing = Dispensing.objects.get(
            id=response.data["id"]
        )

        self.assertEqual(
            dispensing.dispensed_by,
            self.pharmacist,
        )

    def test_stock_decreases_after_dispensing(self):
        self.authenticate(self.pharmacist)

        initial_stock = self.batch.quantity

        response = self.client.post(
            self.url,
            {
                "prescription_item": self.prescription_item.id,
                "medicine_batch": self.batch.id,
                "quantity": 5,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.batch.refresh_from_db()

        self.assertEqual(
            self.batch.quantity,
            initial_stock - 5,
        )

    def test_insufficient_stock_is_rejected(self):
        self.authenticate(self.pharmacist)

        initial_stock = self.batch.quantity

        response = self.client.post(
            self.url,
            {
                "prescription_item": self.prescription_item.id,
                "medicine_batch": self.batch.id,
                "quantity": initial_stock + 1,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.batch.refresh_from_db()

        self.assertEqual(
            self.batch.quantity,
            initial_stock,
        )

    def test_expired_batch_cannot_be_dispensed(self):
        self.authenticate(self.pharmacist)

        expired_batch = MedicineBatch.objects.create(
            medicine=self.medicine,
            batch_number="EXPIRED-BATCH-001",
            expiry_date=timezone.localdate() - timedelta(days=1),
            quantity=20,
            purchase_price=10,
            selling_price=15,
        )

        response = self.client.post(
            self.url,
            {
                "prescription_item": self.prescription_item.id,
                "medicine_batch": expired_batch.id,
                "quantity": 2,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        expired_batch.refresh_from_db()

        self.assertEqual(
            expired_batch.quantity,
            20,
        )

    def test_wrong_medicine_batch_is_rejected(self):
        self.authenticate(self.pharmacist)

        another_medicine = Medicine.objects.create(
            name="Another Test Medicine",
        )

        another_batch = MedicineBatch.objects.create(
            medicine=another_medicine,
            batch_number="OTHER-BATCH-001",
            expiry_date=timezone.localdate() + timedelta(days=30),
            quantity=20,
            purchase_price=10,
            selling_price=15,
        )

        response = self.client.post(
            self.url,
            {
                "prescription_item": self.prescription_item.id,
                "medicine_batch": another_batch.id,
                "quantity": 2,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        another_batch.refresh_from_db()

        self.assertEqual(
            another_batch.quantity,
            20,
        )

    def test_patient_cannot_dispense_medicine(self):
        self.authenticate(self.patient_user)

        response = self.client.post(
            self.url,
            {
                "prescription_item": self.prescription_item.id,
                "medicine_batch": self.batch.id,
                "quantity": 2,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_doctor_cannot_dispense_medicine(self):
        self.authenticate(self.doctor_user)

        response = self.client.post(
            self.url,
            {
                "prescription_item": self.prescription_item.id,
                "medicine_batch": self.batch.id,
                "quantity": 2,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_zero_quantity_is_rejected(self):
        self.authenticate(self.pharmacist)

        initial_stock = self.batch.quantity

        response = self.client.post(
            self.url,
            {
                "prescription_item": self.prescription_item.id,
                "medicine_batch": self.batch.id,
                "quantity": 0,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.batch.refresh_from_db()

        self.assertEqual(
            self.batch.quantity,
            initial_stock,
        )


    def test_negative_quantity_is_rejected(self):
        self.authenticate(self.pharmacist)

        initial_stock = self.batch.quantity

        response = self.client.post(
            self.url,
            {
                "prescription_item": self.prescription_item.id,
                "medicine_batch": self.batch.id,
                "quantity": -5,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.batch.refresh_from_db()

        self.assertEqual(
            self.batch.quantity,
            initial_stock,
        )