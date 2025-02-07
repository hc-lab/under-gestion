from rest_framework import viewsets
from .models import Producto, SalidaProducto, Categoria, Noticia, PerfilUsuario, IngresoProducto
from .serializers import ProductoSerializer, SalidaProductoSerializer, CategoriaSerializer, NoticiaSerializer, IngresoProductoSerializer, UserSerializer
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
from rest_framework.views import APIView
from django.db.models import Sum
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        serializer = UserSerializer(user)
        return Response({
            'token': token.key,
            'user': serializer.data
        })
    return Response(
        {'error': 'Credenciales inválidas'}, 
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        request.user.auth_token.delete()
        return Response({'message': 'Logout exitoso'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
    queryset = Producto.objects.select_related('categoria').all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['categoria', 'estado']
    search_fields = ['nombre', 'descripcion']
    ordering_fields = ['nombre', 'stock', 'fecha_creacion']
    filterset_class = ProductoFilter

    def list(self, request, *args, **kwargs):
        self.queryset = Producto.objects.select_related('categoria').all()
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        try:
            producto = Producto.objects.select_related('categoria').get(pk=kwargs['pk'])
            serializer = self.get_serializer(producto)
            return Response(serializer.data)
        except Producto.DoesNotExist:
            return Response(
                {'error': 'Producto no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )



class SalidaProductoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SalidaProductoSerializer
    queryset = SalidaProducto.objects.select_related('producto', 'usuario').all()

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            salida_producto = serializer.save(usuario=self.request.user)

            # Devolver el producto actualizado junto con la salida
            producto_serializer = ProductoSerializer(salida_producto.producto)
            response_data = {
                'salida': serializer.data,
                'producto': producto_serializer.data
            }

            return Response(response_data, status=status.HTTP_201_CREATED)
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
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': {
                    'id': user.pk,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name
                }
            })
        except Exception as e:
            return Response(
                {'error': 'Credenciales inválidas'},
                status=status.HTTP_400_BAD_REQUEST
            )

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
        else:
            today = timezone.now().date()
            queryset = queryset.filter(fecha__date=today)
        queryset = queryset.select_related('producto', 'usuario')
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

class DashboardDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Obtener estadísticas básicas
            total_productos = Producto.objects.count()
            productos_en_stock = Producto.objects.filter(stock__gt=0).count()
            productos_alerta = Producto.objects.filter(stock__lte=10).count()

            # Obtener movimientos del día
            hoy = timezone.now().date()
            movimientos_hoy = HistorialProducto.objects.filter(
                fecha__date=hoy
            ).count()

            data = {
                'totalProductos': total_productos,
                'enStock': productos_en_stock,
                'alertas': productos_alerta,
                'movimientosHoy': movimientos_hoy
            }

            return Response(data)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SalidaProductoDataView(APIView):
    def get(self, request, producto_id):
        # Filtrar las salidas del producto por ID
        salidas = SalidaProducto.objects.filter(producto_id=producto_id)
        
        # Agrupar por fecha y sumar las cantidades
        data = salidas.values('fecha_hora__date').annotate(total_salidas=Sum('cantidad')).order_by('fecha_hora__date')
        
        # Formatear los datos para el gráfico
        fechas = [entry['fecha_hora__date'] for entry in data]
        cantidades = [entry['total_salidas'] for entry in data]

        return Response({'fechas': fechas, 'cantidades': cantidades})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    user = request.user
    data = {
        'id': user.pk,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name
    }
    return Response(data)