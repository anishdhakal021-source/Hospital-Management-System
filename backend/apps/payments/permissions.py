from rest_framework.permissions import BasePermission


class CanManagePayments(BasePermission):
    """
    Only admins and accountants can manage payments.
    """

    allowed_roles = {
        "ADMIN",
        "ACCOUNTANT",
    }

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in self.allowed_roles
        )