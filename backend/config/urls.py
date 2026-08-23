"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    path("api/users/login/", TokenObtainPairView.as_view(), name="token-obtain-pair"),
    path("api/users/token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    
    path("api/users/",include("apps.users.urls")),
    path("api/patients/", include("apps.patients.urls")),
    path("api/departments/", include("apps.departments.urls")),
    path("api/doctors/", include("apps.doctors.urls")),
    path("api/appointments/", include("apps.appointments.urls")),
    path("api/medical-records/", include("apps.medical_records.urls")),
    path("api/prescriptions/", include("apps.prescriptions.urls")),
    path("api/medicines/", include("apps.medicines.urls")),
    path("api/dispensing/", include("apps.dispensing.urls")),
]
