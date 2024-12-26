from django.contrib import admin
from django.db.models import Count
from django.template.response import TemplateResponse
from django.urls import path
from .models import Personal, Tareo
from django.utils import timezone

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

    def changelist_view(self, request, extra_context=None):
        # Obtener estadísticas para el día actual
        hoy = timezone.now().date()
        response = super().changelist_view(request, extra_context=extra_context)
        
        try:
            queryset = self.get_queryset(request).filter(fecha=hoy)
            stats = queryset.values('tipo').annotate(total=Count('id'))
            
            # Convertir a diccionario para fácil acceso
            stats_dict = {
                'UNIDAD': 0,
                'PERMISO': 0,
                'FALTA': 0,
                'DESCANSO': 0,
                'DIAS_LIBRES': 0,
                'OTROS': 0,
                'TOTAL': queryset.count()
            }
            
            for item in stats:
                stats_dict[item['tipo']] = item['total']
            
            # Agregar al contexto
            if not isinstance(response, TemplateResponse):
                return response
            
            response.context_data['stats'] = stats_dict
            
        except (AttributeError, KeyError):
            pass
        
        return response

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('stats/', self.admin_site.admin_view(self.stats_view), name='tareo_stats'),
        ]
        return custom_urls + urls

    def stats_view(self, request):
        # Vista para estadísticas detalladas si las necesitas
        context = {
            **self.admin_site.each_context(request),
            'title': 'Estadísticas de Tareo'
        }
        return TemplateResponse(request, 'admin/tareo/stats.html', context)
