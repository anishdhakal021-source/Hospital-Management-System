from django.contrib import admin

# Register your models here.
from .models import Prescription,PrescriptionItem

# Register your models here.

admin.site.register(Prescription)
admin.site.register(PrescriptionItem)
