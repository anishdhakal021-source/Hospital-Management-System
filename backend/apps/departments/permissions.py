from rest_framework.permissions import BasePermission


class CanReadDepartments(BasePermission):
    """
    Any authenticated HMS user can view departments.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated


class IsDepartmentManager(BasePermission):
    """
    Admin and Receptionist can create, update, and delete departments.
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