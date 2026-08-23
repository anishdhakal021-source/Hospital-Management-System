from rest_framework.permissions import BasePermission


class CanManagePrescriptions(BasePermission):
    """
    Only doctors and admins can create, update, or delete prescriptions.
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