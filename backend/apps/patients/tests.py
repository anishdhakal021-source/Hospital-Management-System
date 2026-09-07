from rest_framework import status
from rest_framework.test import APITestCase

from apps.users.models import User

from .models import Patient


class PatientAPITests(APITestCase):
    def setUp(self):
        self.patient1_user = User.objects.create_user(
            username="patient1",
            password="StrongPassword123!",
            role=User.Role.PATIENT,
        )

        self.patient2_user = User.objects.create_user(
            username="patient2",
            password="StrongPassword123!",
            role=User.Role.PATIENT,
        )

        self.patient1 = Patient.objects.create(
            user=self.patient1_user,
            phone="9800000001",
        )

        self.patient2 = Patient.objects.create(
            user=self.patient2_user,
            phone="9800000002",
        )

    def test_patient_can_only_see_own_profile_in_list(self):
        self.client.force_authenticate(user=self.patient1_user)

        response = self.client.get("/api/patients/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        returned_ids = [patient["id"] for patient in response.data]

        self.assertIn(self.patient1.id, returned_ids)
        self.assertNotIn(self.patient2.id, returned_ids)

    def test_patient_cannot_view_another_patient_profile(self):
        self.client.force_authenticate(user=self.patient1_user)

        response = self.client.get(
            f"/api/patients/{self.patient2.id}/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_patient_cannot_change_profile_owner(self):
        self.client.force_authenticate(user=self.patient1_user)

        response = self.client.patch(
            f"/api/patients/{self.patient1.id}/",
            {
                "user_id": self.patient2_user.id,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.patient1.refresh_from_db()

        self.assertEqual(
            self.patient1.user_id,
            self.patient1_user.id,
        )