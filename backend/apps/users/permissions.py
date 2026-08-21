from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    """
    Allows access only to users with the Admin role.
    """

    def has_permission(self,request,view):
        return(
            request.user.is_authenticated
            and request.user.role =="ADMIN"
        )


class IsDoctor(BasePermission):
    """
    Allows access only to users with the Doctor role.
    """

    def has_permission(self,request,view):
        return(
            request.user.is_authenticated
            and request.user.role =="DOCTOR"
        )


class IsReceptionist(BasePermission):
    """
    Allows access only to users with the Receptionist role.
    """

    def has_permission(self,request,view):
        return(
            request.user.is_authenticated
            and request.user.role =="RECEPTIONIST"
        )


class IsPharmacist(BasePermission):
    """
    Allows access only to users with the Pharmacist role.
    """

    def has_permission(self,request,view):
        return(
            request.user.is_authenticated
            and request.user.role =="PHARMACIST"
        )


class IsAccountant(BasePermission):
    """
    Allows access only to users with the Accountant role.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "ACCOUNTANT"
        )



class IsPatient(BasePermission):
    """
    Allows access only to users with the Patient role.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "PATIENT"
        )


class IsAdminOrReceptionist(BasePermission):
    """
    Allows access to Admin or Receptionist users.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in [
                "ADMIN",
                "RECEPTIONIST",
            ]
        )