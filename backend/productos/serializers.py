from rest_framework import serializers
from .models import Producto, SalidaProducto, Categoria, Noticia, ImagenNoticia, IngresoProducto
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



class SalidaProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalidaProducto
        fields = ['id', 'producto', 'cantidad', 'fecha_hora', 'entregado_a', 'motivo']



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