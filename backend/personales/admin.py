from django.contrib import admin
from .models import Personal

@admin.register(Personal)
class PersonalAdmin(admin.ModelAdmin):
    list_display = ('apellidos', 'nombres', 'dni', 'cargo', 'telefono', 'procedencia', 'fecha_registro')
    search_fields = ('nombres', 'apellidos', 'dni')
    list_filter = ('cargo', 'procedencia')
    ordering = ('apellidos', 'nombres')
