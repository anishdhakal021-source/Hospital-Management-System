from rest_framework.permissions import BasePermission


class CanManageInvoices(BasePermission):
    """
    Admin and accountants can manage invoices.

    Other roles cannot create, update, or delete invoices.
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