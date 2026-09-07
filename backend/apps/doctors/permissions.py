from rest_framework.permissions import BasePermission


class IsDoctorManager(BasePermission):
    """
    Admin and Receptionist can create, update, and delete doctors.
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


class CanReadDoctors(BasePermission):
    """
    Any authenticated HMS user can view doctors.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated