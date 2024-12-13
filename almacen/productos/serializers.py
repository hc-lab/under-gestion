from rest_framework import serializers
from .models import Producto, HistorialProducto, SalidaProducto, Historial, Categoria, Noticia, ImagenNoticia, IngresoProducto

class ProductoSerializer(serializers.ModelSerializer):
    categoria = serializers.SerializerMethodField()
    
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
    
    class Meta:
        model = HistorialProducto
        fields = '__all__'

class SalidaProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalidaProducto
        fields = '__all__'

class HistorialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Historial
        fields = '__all__'

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
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
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    
    class Meta:
        model = IngresoProducto
        fields = ['id', 'producto', 'producto_nombre', 'fecha', 'cantidad']