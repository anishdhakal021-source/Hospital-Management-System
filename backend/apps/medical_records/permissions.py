from rest_framework.permissions import BasePermission


class CanManageMedicalRecords(BasePermission):
    """
    Allows only Admins and Doctors to manage medical records.

    Patients will receive read-only access through the views.
    """

    allowed_roles = {
        "ADMIN",
        "DOCTOR",
    }

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in self.allowed_roles
        )