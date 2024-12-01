from rest_framework import viewsets, generics
from .models import Producto, HistorialProducto, SalidaProducto
from .serializers import ProductoSerializer, HistorialProductoSerializer, SalidaProductoSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

class HistorialProductoViewSet(viewsets.ModelViewSet):
    serializer_class = HistorialProductoSerializer

    def get_queryset(self):
        producto_id = self.request.query_params.get('producto')
        if producto_id:
            return HistorialProducto.objects.filter(producto_id=producto_id)
        return HistorialProducto.objects.all()


    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
class SalidaProductoViewSet(viewsets.ModelViewSet):
    queryset = SalidaProducto.objects.all()
    serializer_class = SalidaProductoSerializer

