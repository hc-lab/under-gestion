from rest_framework import serializers
from .models import Producto, HistorialProducto, SalidaProducto, Historial, Categoria, Noticia, ImagenNoticia, IngresoProducto
from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer() 
    
    class Meta:
        model = Producto
        fields = '__all__'
        read_only_fields = ('estado', 'usuario')

    def get_categoria(self, obj):
        if obj.categoria:
            return obj.categoria.nombre
        return None

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("El stock no puede ser negativo")
        return value

class HistorialProductoSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    unidad_medida = serializers.CharField(source='producto.unidad_medida', read_only=True)
    usuario_nombre = serializers.CharField(source='usuario.username', read_only=True)
    
    class Meta:
        model = HistorialProducto
        fields = [
            'id', 'producto', 'producto_nombre',
            'cantidad', 'tipo_movimiento', 'fecha',
            'usuario_nombre', 'entregado_a', 'motivo',
            'unidad_medida'
        ]

class SalidaProductoSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='usuario.username', read_only=True)
    producto_detail = ProductoSerializer(source='producto', read_only=True)
    
    class Meta:
        model = SalidaProducto
        fields = [
            'id', 'producto', 'producto_detail',
            'fecha_hora', 'cantidad', 'entregado_a', 'motivo', 
            'usuario', 'usuario_nombre'
        ]

class HistorialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Historial
        fields = '__all__'

class ImagenNoticiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenNoticia
        fields = ['id', 'imagen', 'descripcion', 'orden']

class NoticiaSerializer(serializers.ModelSerializer):
    imagenes = ImagenNoticiaSerializer(many=True, read_only=True)
    
    class Meta:
        model = Noticia
        fields = ['id', 'titulo', 'contenido', 'fecha_creacion', 'usuario', 'imagenes']

class IngresoProductoSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='usuario.username', read_only=True)
    producto_detail = ProductoSerializer(source='producto', read_only=True)
    
    class Meta:
        model = IngresoProducto
        fields = [
            'id', 'producto', 'producto_detail',
            'fecha', 'cantidad', 'usuario', 'usuario_nombre'
        ]
        read_only_fields = ('usuario',)