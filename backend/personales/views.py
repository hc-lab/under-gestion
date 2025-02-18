from django.contrib.auth.models import User
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import datetime
from django.db.models import Q, Count
from rest_framework import generics
from rest_framework.views import APIView
from .models import Personal, Tareo, Perfil
from .serializers import PersonalSerializer, TareoSerializer, UserSerializer
from django_filters.rest_framework import DjangoFilterBackend

class PersonalViewSet(viewsets.ModelViewSet):
    serializer_class = PersonalSerializer
    permission_classes = [permissions.IsAuthenticated]
    search_fields = ['nombres', 'apellidos', 'dni', 'cargo']
    ordering = ['apellidos', 'nombres']

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Personal.objects.all()
        elif hasattr(user, 'perfil'):
            if user.perfil.rol == 'SUPERVISOR':
                return Personal.objects.filter(area=user.perfil.area)
            elif user.perfil.rol == 'OPERADOR':
                return Personal.objects.filter(user=user)
        return Personal.objects.none()

class PersonalSearchView(generics.ListAPIView):
    serializer_class = PersonalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query = self.request.query_params.get('search', '')
        if query:
            return Personal.objects.filter(
                Q(nombres__icontains=query) | 
                Q(apellidos__icontains=query)
            ).order_by('nombres', 'apellidos')[:10]
        return Personal.objects.none()

class PersonalListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        personal = Personal.objects.all()
        serializer = PersonalSerializer(personal, many=True)
        return Response(serializer.data)

class TareoViewSet(viewsets.ModelViewSet):
    queryset = Tareo.objects.all()
    serializer_class = TareoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'fecha': ['exact', 'day', 'month', 'year'],
        'tipo': ['exact'],
        'personal': ['exact']
    }

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Obtener parámetros de fecha
        year = self.request.query_params.get('fecha__year')
        month = self.request.query_params.get('fecha__month')
        day = self.request.query_params.get('fecha__day')

        if all([year, month, day]):
            queryset = queryset.filter(
                fecha__year=year,
                fecha__month=month,
                fecha__day=day
            )

        return queryset.select_related('personal')

    def create(self, request, *args, **kwargs):
        try:
            print("Datos recibidos:", request.data)  # Para depuración
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print("Error en create:", str(e))  # Para depuración
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

    def update(self, request, *args, **kwargs):
        try:
            print("Datos de actualización:", request.data)  # Para depuración
            return super().update(request, *args, **kwargs)
        except Exception as e:
            print("Error en update:", str(e))  # Para depuración
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'])
    def hoy(self, request):
        """Obtener todos los tareos de hoy"""
        try:
            fecha_actual = timezone.now().date()
            print(f"Buscando tareos para la fecha: {fecha_actual}")
            
            tareos = Tareo.objects.filter(fecha=fecha_actual)
            print(f"Tareos encontrados: {tareos.count()}")
            
            serializer = self.get_serializer(tareos, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error en la vista hoy: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def actualizar_estado(self, request):
        """Actualizar el estado de un personal para hoy"""
        personal_id = request.data.get('personal_id')
        tipo = request.data.get('tipo')
        motivo = request.data.get('motivo', '')
        fecha = request.data.get('fecha', timezone.now().date().isoformat())

        try:
            tareo = Tareo.objects.get(
                personal_id=personal_id,
                fecha=fecha
            )
            tareo.tipo = tipo
            tareo.motivo = motivo
            tareo.save()
        except Tareo.DoesNotExist:
            tareo = Tareo.objects.create(
                personal_id=personal_id,
                fecha=fecha,
                tipo=tipo,
                motivo=motivo
            )

        serializer = self.get_serializer(tareo)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def por_fecha(self, request):
        """Obtener tareos por fecha específica"""
        try:
            fecha_str = request.query_params.get('fecha')
            if fecha_str:
                fecha = datetime.strptime(fecha_str, '%Y-%m-%d').date()
            else:
                fecha = timezone.now().date()

            tareos = Tareo.objects.filter(fecha=fecha)
            serializer = self.get_serializer(tareos, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error en por_fecha: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def actualizar_tareo(self, request):
        """Actualizar o crear un tareo para una fecha específica"""
        try:
            personal_id = request.data.get('personal')
            fecha = request.data.get('fecha')
            tipo = request.data.get('tipo')
            
            # Si tipo está vacío, eliminar el registro si existe
            if not tipo:
                Tareo.objects.filter(personal_id=personal_id, fecha=fecha).delete()
                return Response({'message': 'Registro eliminado'})
            
            # Si existe, actualizar; si no, crear
            tareo, created = Tareo.objects.update_or_create(
                personal_id=personal_id,
                fecha=fecha,
                defaults={
                    'tipo': tipo,
                    'registrado_por': request.user
                }
            )
            
            serializer = self.get_serializer(tareo)
            
            # Devolver también la fecha para facilitar la actualización en el frontend
            response_data = {
                'tareo': serializer.data,
                'fecha': fecha
            }
            return Response(response_data)
        except Exception as e:
            print(f"Error en actualizar_tareo: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'])
    def resumen_dia(self, request):
        today = timezone.now().date()
        
        # Obtener todos los tareos del día
        tareos_hoy = Tareo.objects.filter(
            fecha=today
        )
        
        # Contar personal en unidad (tipo 'T')
        personal_en_unidad = tareos_hoy.filter(tipo='T').count()
        
        # Contar total de tareos del día
        total_tareos = tareos_hoy.count()
        
        return Response({
            'fecha': today,
            'personal_en_unidad': personal_en_unidad,
            'total_tareos': total_tareos
        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    try:
        print("\n=== DEBUG CURRENT_USER ===")
        user = request.user
        print(f"Usuario encontrado: {user.username}")
        print(f"Usuario es superuser: {user.is_superuser}")
        
        # Asegurar que existe el perfil
        perfil, created = Perfil.objects.get_or_create(
            user=user,
            defaults={'rol': 'ADMIN' if user.is_superuser else 'OPERADOR'}
        )
        print(f"Perfil {'creado' if created else 'existente'}: {perfil.rol}")

        data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_superuser': user.is_superuser,
            'perfil': {
                'id': perfil.id,
                'rol': perfil.rol,
                'area': perfil.area
            }
        }
        print(f"Datos a enviar: {data}")
        return Response(data)
    except Exception as e:
        print(f"Error en current_user: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
def verify_user(request):
    try:
        username = request.data.get('username')
        print(f"Verificando usuario: {username}")
        users = User.objects.filter(username=username)
        if users.exists():
            user = users.first()
            # Asegurar que el usuario tiene perfil
            perfil, created = Perfil.objects.get_or_create(
                user=user,
                defaults={'rol': 'ADMIN' if user.is_superuser else 'OPERADOR'}
            )
            print(f"Usuario encontrado: {user.username} (perfil: {perfil.rol})")
            return Response({
                'exists': True,
                'is_active': user.is_active,
                'is_superuser': user.is_superuser,
                'has_profile': True,
                'profile_role': perfil.rol
            })
        return Response({'exists': False})
    except Exception as e:
        print(f"Error en verify_user: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({'error': str(e)}, status=500)
