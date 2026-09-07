from rest_framework.permissions import BasePermission


class CanManageAppointments(BasePermission):
    """
    Admin, Resceptionist, and Patient can create appoinments.

    Admin and Receptionist can manage appoinment records.
    Patients will later be restricted to their own appointments.
    """

    allowed_roles = {
        "ADMIN",
        "RECEPTIONIST",
        "DOCTOR",
        "PATIENT",
    }

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in self.allowed_roles
        )