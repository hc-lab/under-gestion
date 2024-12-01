from django.contrib import admin
from .models import Producto, HistorialProducto, SalidaProducto

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'categoria', 'stock', 'unidad_medida', 'estado', 'fecha_creacion', 'fecha_actualizacion')
    list_filter = ('categoria', 'estado')
    search_fields = ('nombre', 'categoria')
    readonly_fields = ('estado',)  # Añadir esta línea

@admin.register(HistorialProducto)
class HistorialProductoAdmin(admin.ModelAdmin):
    list_display = ('producto', 'fecha_hora', 'cantidad', 'entregado_a', 'motivo')
    list_filter = ('producto__categoria', 'fecha_hora')
    search_fields = ('producto__nombre', 'entregado_a')

@admin.register(SalidaProducto)
class SalidaProductoAdmin(admin.ModelAdmin):
    list_display = ('producto', 'fecha_hora', 'cantidad', 'entregado_a', 'motivo')
    list_filter = ('producto__categoria', 'fecha_hora')
    search_fields = ('producto__nombre', 'entregado_a')