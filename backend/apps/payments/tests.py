from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.billing.models import Invoice
from apps.patients.models import Patient

from .models import Payment


User = get_user_model()


class PaymentAPITestCase(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.accountant = User.objects.create_user(
            username="testaccountant",
            password="TestPass123!",
            role="ACCOUNTANT",
        )

        self.patient_user = User.objects.create_user(
            username="testpatient",
            password="TestPass123!",
            role="PATIENT",
        )

        self.patient = Patient.objects.create(
            user=self.patient_user,
            date_of_birth="2000-01-01",
            gender="Male",
            phone="9800000000",
            address="Bharatpur",
            blood_group="O+",
            emergency_contact="9811111111",
        )

        self.invoice = Invoice.objects.create(
            patient=self.patient,
            invoice_number="INV-TEST-001",
            total_amount=Decimal("1500.00"),
            status="UNPAID",
        )

        self.client.force_authenticate(
            user=self.accountant
        )

    def test_accountant_can_create_payment(self):
        response = self.client.post(
            "/api/payments/",
            {
                "invoice_id": self.invoice.id,
                "amount": "500.00",
                "payment_method": "CASH",
                "transaction_reference": "",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.assertEqual(
            Payment.objects.count(),
            1,
        )

    def test_payment_cannot_exceed_remaining_balance(self):
        Payment.objects.create(
            invoice=self.invoice,
            amount=Decimal("1000.00"),
            payment_method="CASH",
        )

        response = self.client.post(
            "/api/payments/",
            {
                "invoice_id": self.invoice.id,
                "amount": "600.00",
                "payment_method": "CASH",
                "transaction_reference": "",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertIn(
            "amount",
            response.data,
        )

    def test_payment_cannot_be_zero(self):
        response = self.client.post(
            "/api/payments/",
            {
                "invoice_id": self.invoice.id,
                "amount": "0.00",
                "payment_method": "CASH",
                "transaction_reference": "",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_payment_cannot_be_negative(self):
        response = self.client.post(
            "/api/payments/",
            {
                "invoice_id": self.invoice.id,
                "amount": "-100.00",
                "payment_method": "CASH",
                "transaction_reference": "",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_updating_payment_updates_invoice_status(self):
        payment = Payment.objects.create(
            invoice=self.invoice,
            amount=Decimal("1500.00"),
            payment_method="CASH",
        )

        self.invoice.status = "PAID"
        self.invoice.save()

        response = self.client.patch(
            f"/api/payments/{payment.id}/",
            {
                "amount": "500.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.invoice.refresh_from_db()

        self.assertEqual(
            self.invoice.status,
            "PARTIALLY_PAID",
        )


    def test_deleting_payment_updates_invoice_status(self):
        payment = Payment.objects.create(
            invoice=self.invoice,
            amount=Decimal("500.00"),
            payment_method="CASH",
        )

        self.invoice.status = "PARTIALLY_PAID"
        self.invoice.save()

        response = self.client.delete(
            f"/api/payments/{payment.id}/",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        self.invoice.refresh_from_db()

        self.assertEqual(
            self.invoice.status,
            "UNPAID",
        )