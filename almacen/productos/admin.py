from django.contrib import admin
from .models import Producto, Categoria, HistorialProducto, SalidaProducto, Noticia, ImagenNoticia

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
    list_display = ('producto', 'fecha_hora', 'cantidad', 'entregado_a')
    list_filter = ('fecha_hora', 'producto')
    search_fields = ('producto__nombre', 'entregado_a')

@admin.register(SalidaProducto)
class SalidaProductoAdmin(admin.ModelAdmin):
    list_display = ('producto', 'fecha_hora', 'cantidad', 'entregado_a')
    list_filter = ('fecha_hora', 'producto')
    search_fields = ('producto__nombre', 'entregado_a')

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