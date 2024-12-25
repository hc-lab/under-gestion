from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import Producto, Categoria, HistorialProducto, SalidaProducto, Noticia, ImagenNoticia, PerfilUsuario, IngresoProducto
from personales.models import Personal

class PerfilUsuarioInline(admin.StackedInline):
    model = PerfilUsuario
    can_delete = False
    verbose_name_plural = 'Perfil de Usuario'

class CustomUserAdmin(UserAdmin):
    inlines = (PerfilUsuarioInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'get_permisos')
    
    def get_permisos(self, obj):
        try:
            perfil = obj.perfilusuario
            permisos = []
            if perfil.puede_escribir:
                permisos.append('Escribir')
            if perfil.puede_editar:
                permisos.append('Editar')
            if perfil.puede_eliminar:
                permisos.append('Eliminar')
            return ', '.join(permisos)
        except PerfilUsuario.DoesNotExist:
            return 'Sin permisos'
    get_permisos.short_description = 'Permisos'

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        try:
            # Intentar obtener el perfil existente
            perfil = PerfilUsuario.objects.get(usuario=obj)
        except PerfilUsuario.DoesNotExist:
            # Si no existe, crear uno nuevo
            perfil = PerfilUsuario.objects.create(
                usuario=obj,
                es_admin=True,
                puede_escribir=True,
                puede_editar=True,
                puede_eliminar=True
            )

    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)
        for instance in instances:
            if isinstance(instance, PerfilUsuario):
                try:
                    # Intentar actualizar el perfil existente
                    existing_profile = PerfilUsuario.objects.get(usuario=instance.usuario)
                    existing_profile.es_admin = instance.es_admin
                    existing_profile.puede_escribir = instance.puede_escribir
                    existing_profile.puede_editar = instance.puede_editar
                    existing_profile.puede_eliminar = instance.puede_eliminar
                    existing_profile.usar_base_datos_admin = instance.usar_base_datos_admin
                    existing_profile.base_datos_propia = instance.base_datos_propia
                    existing_profile.save()
                except PerfilUsuario.DoesNotExist:
                    instance.save()
            else:
                instance.save()
        formset.save_m2m()

# Desregistrar el UserAdmin por defecto
admin.site.unregister(User)
# Registrar nuestro CustomUserAdmin
admin.site.register(User, CustomUserAdmin)

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion', 'fecha_creacion')
    search_fields = ('nombre',)
    list_filter = ('fecha_creacion',)
    ordering = ('nombre',)

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'categoria', 'stock', 'estado', 'unidad_medida')
    list_filter = ('categoria', 'estado', 'unidad_medida')
    search_fields = ('nombre', 'descripcion')
    ordering = ('nombre',)

@admin.register(HistorialProducto)
class HistorialProductoAdmin(admin.ModelAdmin):
    list_display = [
        'fecha',
        'tipo_movimiento',
        'get_producto_nombre',
        'cantidad',
        'usuario',
        'entregado_a'
    ]
    list_filter = [
        'tipo_movimiento',
        'fecha',
        'producto',
        'usuario'
    ]
    search_fields = [
        'producto__nombre',
        'usuario__username',
        'entregado_a'
    ]
    date_hierarchy = 'fecha'
    ordering = ['-fecha']

    def get_producto_nombre(self, obj):
        return obj.producto.nombre if obj.producto else '-'
    get_producto_nombre.short_description = 'Producto'
    get_producto_nombre.admin_order_field = 'producto__nombre'

@admin.register(SalidaProducto)
class SalidaProductoAdmin(admin.ModelAdmin):
    autocomplete_fields = ['entregado_a']
    list_display = ['producto', 'cantidad', 'fecha_hora', 'entregado_a']
    search_fields = ['producto__nombre', 'entregado_a__nombres', 'entregado_a__apellidos']

class ImagenNoticiaInline(admin.TabularInline):
    model = ImagenNoticia
    extra = 1  # Número de formularios vacíos a mostrar

@admin.register(Noticia)
class NoticiaAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'fecha_creacion', 'usuario')
    list_filter = ('fecha_creacion', 'usuario')
    search_fields = ('titulo', 'contenido')
    ordering = ('-fecha_creacion',)
    inlines = [ImagenNoticiaInline]

    def save_model(self, request, obj, form, change):
        if not obj.pk:  # Si es una nueva noticia
            obj.usuario = request.user
        super().save_model(request, obj, form, change)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        try:
            perfil = request.user.perfilusuario
            if perfil.usar_base_datos_admin:
                return qs.filter(usuario__is_superuser=True)
            return qs.filter(usuario=request.user)
        except PerfilUsuario.DoesNotExist:
            return qs.none()

    def has_add_permission(self, request):
        if request.user.is_superuser:
            return True
        try:
            return request.user.perfilusuario.puede_escribir
        except PerfilUsuario.DoesNotExist:
            return False

    def has_change_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        try:
            return request.user.perfilusuario.puede_editar
        except PerfilUsuario.DoesNotExist:
            return False

    def has_delete_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        try:
            return request.user.perfilusuario.puede_eliminar
        except PerfilUsuario.DoesNotExist:
            return False

@admin.register(IngresoProducto)
class IngresoProductoAdmin(admin.ModelAdmin):
    list_display = [
        'fecha',
        'get_producto_nombre',
        'cantidad',
        'usuario'
    ]
    list_filter = [
        'fecha',
        'producto',
        'usuario'
    ]
    search_fields = [
        'producto__nombre',
        'usuario__username'
    ]
    date_hierarchy = 'fecha'
    ordering = ['-fecha']

    def get_producto_nombre(self, obj):
        return obj.producto.nombre if obj.producto else '-'
    get_producto_nombre.short_description = 'Producto'
    get_producto_nombre.admin_order_field = 'producto__nombre'