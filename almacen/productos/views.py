from rest_framework import viewsets
from .models import Producto, HistorialProducto, SalidaProducto, Historial
from .serializers import ProductoSerializer, HistorialProductoSerializer, SalidaProductoSerializer, HistorialSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status

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

class HistorialProductoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
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
    permission_classes = [IsAuthenticated]
    queryset = SalidaProducto.objects.all()
    serializer_class = SalidaProductoSerializer

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
            }
        })