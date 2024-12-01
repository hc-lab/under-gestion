from rest_framework import serializers
from .models import Producto, HistorialProducto, SalidaProducto

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

class HistorialProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialProducto
        fields = '__all__'

class SalidaProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalidaProducto
        fields = '__all__'
