from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from django.utils.html import format_html
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
    list_display = ('nombres', 'apellidos', 'dni', 'cargo', 'telefono')
    search_fields = ('nombres', 'apellidos', 'dni')
    list_filter = ('cargo',)

@admin.register(Tareo)
class TareoAdmin(admin.ModelAdmin):
    list_display = ('fecha', 'get_personal_nombre', 'get_personal_cargo', 'get_tipo_colored', 'observaciones')
    list_filter = ('tipo', 'fecha', 'personal__cargo')
    search_fields = ('personal__nombres', 'personal__apellidos', 'personal__dni', 'observaciones')
    date_hierarchy = 'fecha'
    ordering = ('-fecha', 'personal__apellidos')
    autocomplete_fields = ['personal']
    list_per_page = 50

    def get_personal_nombre(self, obj):
        return f"{obj.personal.apellidos}, {obj.personal.nombres}"
    get_personal_nombre.short_description = 'Personal'
    get_personal_nombre.admin_order_field = 'personal__apellidos'

    def get_personal_cargo(self, obj):
        return obj.personal.cargo
    get_personal_cargo.short_description = 'Cargo'
    get_personal_cargo.admin_order_field = 'personal__cargo'

    def get_tipo_colored(self, obj):
        tipo_descripcion = dict(obj._meta.get_field('tipo').choices)
        return format_html(
            '<strong style="color: {}">{}</strong>',
            {
                'T': '#4CAF50',   # Verde
                'PS': '#FF9800',  # Naranja
                'PC': '#2196F3',  # Azul
                'DL': '#9C27B0',  # Morado
                'DM': '#F44336',  # Rojo
                'TL': '#607D8B',  # Gris
                'F': '#d32f2f',   # Rojo oscuro
                'R': '#795548',   # Marrón
            }.get(obj.tipo, 'gray'),
            tipo_descripcion.get(obj.tipo)
        )
    get_tipo_colored.short_description = 'Estado'
    get_tipo_colored.admin_order_field = 'tipo'

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('personal')

@admin.register(Perfil)
class PerfilAdmin(admin.ModelAdmin):
    list_display = ('user', 'rol', 'area', 'activo')
    list_filter = ('rol', 'activo')
    search_fields = ('user__username', 'area')
