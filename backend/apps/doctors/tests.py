from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.departments.models import Department
from apps.doctors.models import Doctor
from apps.users.models import User


class DoctorRegistrationTests(APITestCase):

    def setUp(self):
        self.department = Department.objects.create(
            name="Cardiology",
            description="Heart and cardiovascular department",
            is_active=True,
        )

        self.admin = User.objects.create_user(
            username="admin_test",
            password="AdminPass123!",
            role=User.Role.ADMIN,
        )

        self.receptionist = User.objects.create_user(
            username="reception_test",
            password="ReceptionPass123!",
            role=User.Role.RECEPTIONIST,
        )

        self.patient = User.objects.create_user(
            username="patient_test",
            password="PatientPass123!",
            role=User.Role.PATIENT,
        )

        self.doctor_data = {
            "username": "doctor_test",
            "password": "DoctorPass123!",
            "email": "doctor@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "department_id": self.department.id,
            "specialization": "Cardiologist",
            "license_number": "LIC-TEST-001",
            "phone": "9800000000",
            "consultation_fee": "1500.00",
            "is_available": True,
        }

    def authenticate(self, user):
        refresh = RefreshToken.for_user(user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
        )

    def test_admin_can_register_doctor(self):
        self.authenticate(self.admin)

        response = self.client.post(
            "/api/doctors/register/",
            self.doctor_data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertTrue(
            User.objects.filter(username="doctor_test").exists()
        )

        doctor = Doctor.objects.get(
            license_number="LIC-TEST-001"
        )

        self.assertEqual(doctor.user.role, User.Role.DOCTOR)
        self.assertEqual(
            doctor.department,
            self.department,
        )

    def test_receptionist_can_register_doctor(self):
        self.authenticate(self.receptionist)

        response = self.client.post(
            "/api/doctors/register/",
            self.doctor_data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertTrue(
            Doctor.objects.filter(
                license_number="LIC-TEST-001"
            ).exists()
        )

    def test_patient_cannot_register_doctor(self):
        self.authenticate(self.patient)

        response = self.client.post(
            "/api/doctors/register/",
            self.doctor_data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.assertFalse(
            User.objects.filter(username="doctor_test").exists()
        )

    def test_duplicate_username_is_rejected(self):
        self.authenticate(self.admin)

        User.objects.create_user(
            username="doctor_test",
            password="ExistingPass123!",
            role=User.Role.PATIENT,
        )

        response = self.client.post(
            "/api/doctors/register/",
            self.doctor_data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertIn("username", response.data)

    def test_duplicate_license_number_is_rejected(self):
        self.authenticate(self.admin)

        existing_user = User.objects.create_user(
            username="existing_doctor",
            password="ExistingDoctor123!",
            role=User.Role.DOCTOR,
        )

        Doctor.objects.create(
            user=existing_user,
            department=self.department,
            specialization="Neurologist",
            license_number="LIC-TEST-001",
            phone="9811111111",
            consultation_fee="1200.00",
            is_available=True,
        )

        response = self.client.post(
            "/api/doctors/register/",
            self.doctor_data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertIn("license_number", response.data)

    def test_registration_creates_user_and_doctor(self):
        self.authenticate(self.admin)

        response = self.client.post(
            "/api/doctors/register/",
            self.doctor_data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        user = User.objects.get(username="doctor_test")
        doctor = Doctor.objects.get(user=user)

        self.assertEqual(user.role, User.Role.DOCTOR)
        self.assertEqual(user.email, "doctor@example.com")
        self.assertEqual(user.first_name, "John")
        self.assertEqual(user.last_name, "Doe")

        self.assertEqual(
            doctor.specialization,
            "Cardiologist",
        )
        self.assertEqual(
            doctor.license_number,
            "LIC-TEST-001",
        )
        self.assertEqual(
            doctor.phone,
            "9800000000",
        )


    def test_delete_doctor_also_deletes_user(self):
        doctor_user = User.objects.create_user(
            username="delete_doctor",
            password="TestPassword123!",
            role=User.Role.DOCTOR,
        )

        doctor = Doctor.objects.create(
            user=doctor_user,
            department=self.department,
            specialization="Cardiology",
            license_number="DEL-001",
            phone="9800000011",
            consultation_fee="1500.00",
            is_available=True,
        )

        doctor_id = doctor.id
        user_id = doctor_user.id

        self.client.force_authenticate(user=self.admin)

        response = self.client.delete(
            f"/api/doctors/{doctor_id}/"
        )

        self.assertEqual(response.status_code, 204)

        self.assertFalse(
            Doctor.objects.filter(id=doctor_id).exists()
        )

        self.assertFalse(
            User.objects.filter(id=user_id).exists()
        )