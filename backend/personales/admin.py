from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Perfil, Personal, Tareo

class PerfilInline(admin.StackedInline):
    model = Perfil
    can_delete = False
    verbose_name_plural = 'Perfil'

class UserAdmin(BaseUserAdmin):
    inlines = (PerfilInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'get_rol', 'is_active')
    list_filter = ('perfil__rol', 'is_active', 'is_staff')

    def get_rol(self, obj):
        return obj.perfil.get_rol_display() if hasattr(obj, 'perfil') else '-'
    get_rol.short_description = 'Rol'

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            return qs.filter(id=request.user.id)
        return qs

# Re-registrar UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

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
    list_display = ('personal', 'fecha', 'tipo', 'motivo', 'fecha_registro')
    list_filter = ('tipo', 'fecha')
    search_fields = ['personal__nombres', 'personal__apellidos', 'motivo']
    date_hierarchy = 'fecha'
    raw_id_fields = ('personal',)
    ordering = ('-fecha', 'personal__apellidos')
