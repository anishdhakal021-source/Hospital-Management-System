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


class CanManagePrescriptionItem(BasePermission):
    """
    Admins can manage all prescription items.

    Doctors can manage prescription items only when the
    related prescription belongs to that doctor.
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

    def has_object_permission(self, request, view, obj):
        if request.user.role == "ADMIN":
            return True

        if request.user.role == "DOCTOR":
            return obj.prescription.doctor.user == request.user

        return False