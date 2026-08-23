from rest_framework.permissions import BasePermission


class CanManageMedicines(BasePermission):
    """
    Controls access to the Medicine API based on user role and HTTP method.

    Admins can perform all medicine management operations.
    Pharmacists can create and update medicines.
    Doctors and receptionists can only view medicines.
    """

    read_roles = {
        "ADMIN",
        "DOCTOR",
        "PHARMACIST",
        "RECEPTIONIST",
    }

    write_roles = {
        "ADMIN",
        "PHARMACIST",
    }

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.method in {"GET", "HEAD", "OPTIONS"}:
            return request.user.role in self.read_roles

        if request.method in {"POST", "PUT", "PATCH"}:
            return request.user.role in self.write_roles

        if request.method == "DELETE":
            return request.user.role == "ADMIN"

        return False

# Medicine Batch

class CanManageMedicineBatches(BasePermission):
    """
    Controls access to medicine batch inventory.

    Admins and pharmacists can create and update batches.
    Only admins can delete batches.
    Doctors and receptionists can view batches.
    """

    read_roles = {
        "ADMIN",
        "DOCTOR",
        "PHARMACIST",
        "RECEPTIONIST",
    }

    write_roles = {
        "ADMIN",
        "PHARMACIST",
    }

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.method in {"GET", "HEAD", "OPTIONS"}:
            return request.user.role in self.read_roles

        if request.method in {"POST", "PUT", "PATCH"}:
            return request.user.role in self.write_roles

        if request.method == "DELETE":
            return request.user.role == "ADMIN"

        return False