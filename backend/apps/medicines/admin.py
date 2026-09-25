from django.contrib import admin

# Register your models here.
from .models import Medicine, MedicineBatch

# Register your models here.

admin.site.register(Medicine)
admin.site.register(MedicineBatch)
