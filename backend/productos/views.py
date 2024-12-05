from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Producto, Historial
from .serializers import ProductoSerializer, HistorialSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductoSerializer

    def get_queryset(self):
        return Producto.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class HistorialViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = HistorialSerializer

    def get_queryset(self):
        return Historial.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user) 