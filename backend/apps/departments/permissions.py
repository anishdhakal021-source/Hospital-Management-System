from rest_framework.permissions import BasePermission


class IsDepartmentManager(BasePermission):
    """
    Allows Admin and Receptionist users to manage departments.
    """

    allowed_roles = {
        "ADMIN",
        "RECEPTIONIST",
    }

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in self.allowed_roles
        )