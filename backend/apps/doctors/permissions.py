from rest_framework.permissions import BasePermission


class IsDoctorOrStaff(BasePermission):
    """
    Doctors can access their own profile.
    Authorized staff can access doctor records.
    """

    allowed_staff_roles = {
        "ADMIN",
        "RECEPTIONIST",
    }

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        return (
            request.user.role == "DOCTOR"
            or request.user.role in self.allowed_staff_roles
        )

    def has_object_permission(self, request, view, obj):
        if request.user.role in self.allowed_staff_roles:
            return True

        return obj.user_id == request.user.id


class CanCreateDoctor(BasePermission):
    """
    Only Admin can create doctor profiles.
    """

    allowed_roles = {
        "ADMIN",
    }

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in self.allowed_roles
        )