from django.contrib import admin
from .models import Blasting

@admin.register(Blasting)
class BlastingAdmin(admin.ModelAdmin):
    list_display = ('fecha', 'armadas', 'longitud', 'turno', 'perforacion')
    list_filter = ('fecha', 'turno', 'perforacion')
    search_fields = ('fecha', 'turno', 'perforacion')
    ordering = ('-fecha',)
    
    fieldsets = (
        ('Información de Fecha', {
            'fields': ('fecha',)
        }),
        ('Detalles de Voladura', {
            'fields': ('armadas', 'longitud', 'turno', 'perforacion')
        }),
    )
    date_hierarchy = 'fecha'
    
    class Media:
        css = {
            'all': ('admin/css/custom_admin.css',)
        }
