from django.contrib import admin
from .models import Personal, Tareo

@admin.register(Personal)
class PersonalAdmin(admin.ModelAdmin):
    list_display = (
        'apellidos', 
        'nombres', 
        'dni', 
        'cargo', 
        'telefono', 
        'procedencia',
        'banco',
        'numero_cuenta',
        'numero_cci', 
        'fecha_registro'
    )
    search_fields = ['nombres', 'apellidos', 'dni', 'numero_cuenta', 'numero_cci']
    list_filter = ('cargo', 'procedencia', 'banco')
    ordering = ('apellidos', 'nombres')
    fieldsets = (
        ('Información Personal', {
            'fields': ('nombres', 'apellidos', 'dni', 'cargo', 'telefono', 'procedencia')
        }),
        ('Información Bancaria', {
            'fields': ('banco', 'numero_cuenta', 'numero_cci')
        }),
    )

@admin.register(Tareo)
class TareoAdmin(admin.ModelAdmin):
    list_display = ('personal', 'fecha', 'tipo', 'fecha_registro')
    list_filter = ('tipo', 'fecha')
    search_fields = ['personal__nombres', 'personal__apellidos', 'motivo']
    date_hierarchy = 'fecha'
    raw_id_fields = ('personal',)
    ordering = ('-fecha', 'personal__apellidos')
