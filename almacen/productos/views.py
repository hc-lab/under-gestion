from rest_framework import viewsets
from .models import Producto, HistorialProducto, SalidaProducto, Historial, Categoria, Noticia, PerfilUsuario
from .serializers import ProductoSerializer, HistorialProductoSerializer, SalidaProductoSerializer, HistorialSerializer, CategoriaSerializer, NoticiaSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
import logging

logger = logging.getLogger(__name__)

def login_view(request):
    logger.debug(f"Datos recibidos: {request.data}")
    # ... tu código ...
    user = authenticate(username=username, password=password)
    logger.debug(f"Resultado autenticación: {user}")

class TienePermisosNecesarios(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
            
        try:
            perfil = request.user.perfilusuario
            if request.method in ['POST']:
                return perfil.puede_escribir
            elif request.method in ['PUT', 'PATCH']:
                return perfil.puede_editar
            elif request.method == 'DELETE':
                return perfil.puede_eliminar
            return True  # Para GET
        except PerfilUsuario.DoesNotExist:
            return False

class ProductoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, TienePermisosNecesarios]
    serializer_class = ProductoSerializer

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Producto.objects.all()
        
        try:
            perfil = self.request.user.perfilusuario
            if perfil.usar_base_datos_admin:
                return Producto.objects.filter(usuario__is_superuser=True)
            return Producto.objects.filter(usuario=self.request.user)
        except PerfilUsuario.DoesNotExist:
            return Producto.objects.none()

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
            'user_id': user.pk,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name
        })

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAuthenticated]

class NoticiaViewSet(viewsets.ModelViewSet):
    queryset = Noticia.objects.all().order_by('-fecha_creacion')
    serializer_class = NoticiaSerializer
    permission_classes = [AllowAny]  # Permitir acceso público a las noticias