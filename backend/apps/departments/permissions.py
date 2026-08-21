from rest_framework.permissions import BasePermission

from apps.users.models import User


class IsAdminOrReadOnly(BasePermission):
    """
    Everyone authenticated can red departments.
    Only Admin can create or modify departments.
    """


def has_permission(self,request,view):
    if not request.user or not request.user.is_authenticated:
        return False
    
    if request.method in ["GET","HEAD","OPTIONS"]:
        return True

    return request.user.role == User.Role.ADMIN