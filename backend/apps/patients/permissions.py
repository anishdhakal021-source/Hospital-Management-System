from rest_framework.permissions import BasePermission


class IsPatientOrStaff(BasePermission):
    """
    Patients can access their own profile.
    Admin, Doctor, and Receptionist can access patient records.
    """

    allowed_staff_roles = {
        "ADMIN",
        "DOCTOR",
        "RECEPTIONIST",
    }

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        return (
            request.user.role == "PATIENT"
            or request.user.role in self.allowed_staff_roles
        )

    def has_object_permission(self, request, view, obj):
        if request.user.role in self.allowed_staff_roles:
            return True

        return obj.user_id == request.user.id


class CanCreatePatient(BasePermission):
    """
    Only Admin and Receptionist can create patient profiles.
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