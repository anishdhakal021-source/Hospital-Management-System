from rest_framework.permissions import BasePermission


class CanManageDispensing(BasePermission):
    """
    Only pharmacists and admins can manage dispensing records.
    """

    allowed_roles = {
        "ADMIN",
        "PHARMACIST",
    }

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in self.allowed_roles
        )