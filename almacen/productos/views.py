from rest_framework import viewsets
from .models import Producto, HistorialProducto, SalidaProducto, Historial, Categoria, Noticia, PerfilUsuario, IngresoProducto
from .serializers import ProductoSerializer, HistorialProductoSerializer, SalidaProductoSerializer, HistorialSerializer, CategoriaSerializer, NoticiaSerializer, IngresoProductoSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
import logging
from datetime import datetime, timedelta
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import ValidationError
from django.db import transaction
from django_filters import rest_framework as filters
from django.core.cache import cache
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

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

class ProductoFilter(filters.FilterSet):
    nombre = filters.CharFilter(lookup_expr='icontains')
    categoria = filters.CharFilter(field_name='categoria__nombre')
    
    class Meta:
        model = Producto
        fields = ['nombre', 'categoria', 'estado']

class ProductoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductoSerializer
    queryset = Producto.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['categoria', 'estado']
    search_fields = ['nombre', 'descripcion']
    ordering_fields = ['nombre', 'stock', 'fecha_creacion']
    filterset_class = ProductoFilter

    @method_decorator(cache_page(60 * 15))  # Cache por 15 minutos
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        cache_key = f'producto_{kwargs["pk"]}'
        producto = cache.get(cache_key)
        
        if not producto:
            producto = self.get_object()
            cache.set(cache_key, producto, timeout=60*15)
        
        serializer = self.get_serializer(producto)
        return Response(serializer.data)

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
    serializer_class = SalidaProductoSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                serializer.save(usuario=self.request.user)
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except ValidationError as e:
            return Response({'error': str(e)}, status=400)
        except Exception as e:
            return Response(
                {'error': 'Error interno del servidor', 'details': str(e)}, 
                status=500
            )

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
    permission_classes = [IsAuthenticated]
    serializer_class = CategoriaSerializer
    queryset = Categoria.objects.all()

class NoticiaViewSet(viewsets.ModelViewSet):
    queryset = Noticia.objects.all().order_by('-fecha_creacion')
    serializer_class = NoticiaSerializer
    permission_classes = [AllowAny]  # Permitir acceso público a las noticias

class IngresoProductoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = IngresoProductoSerializer

    def get_queryset(self):
        queryset = IngresoProducto.objects.all()
        fecha = self.request.query_params.get('fecha', None)
        if fecha:
            fecha_inicio = datetime.strptime(fecha, '%Y-%m-%d')
            fecha_fin = fecha_inicio + timedelta(days=1)
            queryset = queryset.filter(fecha__gte=fecha_inicio, fecha__lt=fecha_fin)
        return queryset.order_by('-fecha')

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            user = self.user
            response.data['user'] = {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        return response