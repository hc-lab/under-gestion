from django.contrib import admin
from .models import Personal, TipoTareo, Tareo

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

    def get_search_results(self, request, queryset, search_term):
        queryset, use_distinct = super().get_search_results(request, queryset, search_term)
        if search_term:
            queryset |= self.model.objects.filter(
                nombres__icontains=search_term
            ) | self.model.objects.filter(
                apellidos__icontains=search_term
            )
        return queryset, use_distinct

@admin.register(TipoTareo)
class TipoTareoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion')
    search_fields = ['nombre']

@admin.register(Tareo)
class TareoAdmin(admin.ModelAdmin):
    list_display = ('personal', 'tipo', 'fecha_inicio', 'fecha_fin', 'estado', 'unidad_trabajo')
    list_filter = ('tipo', 'estado', 'fecha_inicio')
    search_fields = ['personal__nombres', 'personal__apellidos', 'observaciones']
    date_hierarchy = 'fecha_inicio'
    raw_id_fields = ('personal',)
