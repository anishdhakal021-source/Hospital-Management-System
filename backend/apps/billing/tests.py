from decimal import Decimal
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.patients.models import Patient
from apps.users.models import User

from .models import Invoice,InvoiceItem


class InvoiceAPITestCase(APITestCase):

    def setUp(self):
        self.patient_user = User.objects.create_user(
            username="billing_patient",
            password="TestPass123!",
            role="PATIENT",
        )

        self.patient = Patient.objects.create(
            user=self.patient_user,
            gender="Male",
        )

        self.patient2_user = User.objects.create_user(
            username="billing_patient2",
            password="TestPass123!",
            role="PATIENT",
        )

        self.patient2 = Patient.objects.create(
            user=self.patient2_user,
            gender="Female",
        )

        self.admin = User.objects.create_user(
            username="billing_admin",
            password="TestPass123!",
            role="ADMIN",
        )

        self.accountant = User.objects.create_user(
            username="billing_accountant",
            password="TestPass123!",
            role="ACCOUNTANT",
        )

        self.doctor = User.objects.create_user(
            username="billing_doctor",
            password="TestPass123!",
            role="DOCTOR",
        )

        self.invoice = Invoice.objects.create(
            patient=self.patient,
            invoice_number="INV-001",
            total_amount=500,
            status="UNPAID",
        )

        self.list_url = reverse(
            "invoice-list-create"
        )

        self.detail_url = reverse(
            "invoice-detail",
            kwargs={"pk": self.invoice.id},
        )

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def test_admin_can_create_invoice(self):
        self.authenticate(self.admin)

        response = self.client.post(
            self.list_url,
            {
                "patient_id": self.patient.id,
                "invoice_number": "INV-002",
                "total_amount": "1000.00",
                "status": "UNPAID",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.assertTrue(
            Invoice.objects.filter(
                invoice_number="INV-002"
            ).exists()
        )

    def test_accountant_can_create_invoice(self):
        self.authenticate(self.accountant)

        response = self.client.post(
            self.list_url,
            {
                "patient_id": self.patient.id,
                "invoice_number": "INV-003",
                "total_amount": "750.00",
                "status": "UNPAID",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

    def test_doctor_cannot_create_invoice(self):
        self.authenticate(self.doctor)

        response = self.client.post(
            self.list_url,
            {
                "patient_id": self.patient.id,
                "invoice_number": "INV-004",
                "total_amount": "500.00",
                "status": "UNPAID",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_patient_cannot_create_invoice(self):
        self.authenticate(self.patient_user)

        response = self.client.post(
            self.list_url,
            {
                "patient_id": self.patient.id,
                "invoice_number": "INV-005",
                "total_amount": "500.00",
                "status": "UNPAID",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_admin_can_view_invoices(self):
        self.authenticate(self.admin)

        response = self.client.get(self.list_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_accountant_can_view_invoices(self):
        self.authenticate(self.accountant)

        response = self.client.get(self.list_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_doctor_cannot_view_invoices(self):
        self.authenticate(self.doctor)

        response = self.client.get(self.list_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_admin_can_update_invoice(self):
        self.authenticate(self.admin)

        response = self.client.patch(
            self.detail_url,
            {
                "total_amount": "750.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_accountant_can_update_invoice(self):
        self.authenticate(self.accountant)

        response = self.client.patch(
            self.detail_url,
            {
                "total_amount": "750.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_doctor_cannot_update_invoice(self):
        self.authenticate(self.doctor)

        response = self.client.patch(
            self.detail_url,
            {
                "total_amount": "750.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_total_amount_is_backend_controlled(self):
        self.authenticate(self.accountant)

        response = self.client.post(
            self.list_url,
            {
                "patient_id": self.patient.id,
                "invoice_number": "INV-BACKEND-TOTAL",
                "total_amount": -100,
                "status": "UNPAID",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        invoice = Invoice.objects.get(
            invoice_number="INV-BACKEND-TOTAL"
        )

        self.assertEqual(
            invoice.total_amount,
            Decimal("0.00"),
        )

    def test_empty_invoice_number_is_rejected(self):
        self.authenticate(self.accountant)

        response = self.client.post(
            self.list_url,
            {
                "patient_id": self.patient.id,
                "invoice_number": "   ",
                "total_amount": "500.00",
                "status": "UNPAID",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_duplicate_invoice_number_is_rejected(self):
        self.authenticate(self.accountant)

        response = self.client.post(
            self.list_url,
            {
                "patient_id": self.patient2.id,
                "invoice_number": "INV-001",
                "total_amount": "800.00",
                "status": "UNPAID",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_invalid_status_is_rejected(self):
        self.authenticate(self.accountant)

        response = self.client.post(
            self.list_url,
            {
                "patient_id": self.patient.id,
                "invoice_number": "INV-007",
                "total_amount": "500.00",
                "status": "INVALID",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_admin_can_delete_invoice(self):
        self.authenticate(self.admin)

        response = self.client.delete(
            self.detail_url
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

    def test_accountant_can_delete_invoice(self):
        self.authenticate(self.accountant)

        response = self.client.delete(
            self.detail_url
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

    def test_accountant_can_create_invoice_item(self):
        self.authenticate(self.accountant)

        url = reverse(
            "invoice-item-list-create"
        )

        response = self.client.post(
            url,
            {
                "invoice": self.invoice.id,
                "description": "Doctor consultation",
                "quantity": 2,
                "unit_price": "250.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        item = InvoiceItem.objects.get(
            invoice=self.invoice,
            description="Doctor consultation",
        )

        self.assertEqual(
            item.subtotal,
            500,
        )

    def test_invoice_item_subtotal_is_calculated_by_backend(self):
        self.authenticate(self.accountant)

        url = reverse(
            "invoice-item-list-create"
        )

        response = self.client.post(
            url,
            {
                "invoice": self.invoice.id,
                "description": "Medicine",
                "quantity": 5,
                "unit_price": "100.00",
                "subtotal": "9999.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        item = InvoiceItem.objects.get(
            invoice=self.invoice,
            description="Medicine",
        )

        self.assertEqual(
            item.subtotal,
            500,
        )

    def test_doctor_cannot_create_invoice_item(self):
        self.authenticate(self.doctor)

        url = reverse(
            "invoice-item-list-create"
        )

        response = self.client.post(
            url,
            {
                "invoice": self.invoice.id,
                "description": "Medicine",
                "quantity": 1,
                "unit_price": "100.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_zero_quantity_is_rejected(self):
        self.authenticate(self.accountant)

        url = reverse(
            "invoice-item-list-create"
        )

        response = self.client.post(
            url,
            {
                "invoice": self.invoice.id,
                "description": "Medicine",
                "quantity": 0,
                "unit_price": "100.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_negative_unit_price_is_rejected(self):
        self.authenticate(self.accountant)

        url = reverse(
            "invoice-item-list-create"
        )

        response = self.client.post(
            url,
            {
                "invoice": self.invoice.id,
                "description": "Medicine",
                "quantity": 1,
                "unit_price": "-100.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_invoice_total_calculated_when_item_created(self):
        self.authenticate(self.accountant)

        url = reverse("invoice-item-list-create")

        response = self.client.post(
            url,
            {
                "invoice": self.invoice.id,
                "description": "Consultation",
                "quantity": 2,
                "unit_price": "500.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.invoice.refresh_from_db()

        self.assertEqual(
            self.invoice.total_amount,
            Decimal("1000.00"),
        )


    def test_invoice_total_recalculated_when_item_updated(self):
        self.authenticate(self.accountant)

        item = InvoiceItem.objects.create(
            invoice=self.invoice,
            description="Consultation",
            quantity=2,
            unit_price=Decimal("500.00"),
            subtotal=Decimal("1000.00"),
        )

        self.invoice.total_amount = Decimal("1000.00")
        self.invoice.save()

        url = reverse(
            "invoice-item-detail",
            kwargs={"pk": item.id},
        )

        response = self.client.patch(
            url,
            {
                "quantity": 3,
                "unit_price": "600.00",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.invoice.refresh_from_db()

        self.assertEqual(
            self.invoice.total_amount,
            Decimal("1800.00"),
        )


    def test_invoice_total_recalculated_when_item_deleted(self):
        self.authenticate(self.accountant)

        item1 = InvoiceItem.objects.create(
            invoice=self.invoice,
            description="Consultation",
            quantity=1,
            unit_price=Decimal("500.00"),
            subtotal=Decimal("500.00"),
        )

        InvoiceItem.objects.create(
            invoice=self.invoice,
            description="Medicine",
            quantity=2,
            unit_price=Decimal("100.00"),
            subtotal=Decimal("200.00"),
        )

        self.invoice.total_amount = Decimal("700.00")
        self.invoice.save()

        url = reverse(
            "invoice-item-detail",
            kwargs={"pk": item1.id},
        )

        response = self.client.delete(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        self.invoice.refresh_from_db()

        self.assertEqual(
            self.invoice.total_amount,
            Decimal("200.00"),
        )