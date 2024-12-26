from django.contrib.auth.models import User
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import datetime
from django.db.models import Q
from rest_framework import generics
from rest_framework.views import APIView
from .models import Personal, Tareo, Perfil
from .serializers import PersonalSerializer, TareoSerializer, UserSerializer

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
    serializer_class = TareoSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['tipo', 'personal', 'fecha']
    search_fields = ['motivo', 'personal__nombres', 'personal__apellidos']
    ordering_fields = ['fecha', 'fecha_registro']
    ordering = ['-fecha']

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Tareo.objects.all()
        elif hasattr(user, 'perfil'):
            if user.perfil.rol == 'SUPERVISOR':
                # Supervisores ven los tareos de su área
                return Tareo.objects.filter(personal__area=user.perfil.area)
            elif user.perfil.rol == 'OPERADOR':
                # Operadores solo ven sus propios tareos
                return Tareo.objects.filter(personal__user=user)
        return Tareo.objects.none()

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
        fecha_actual = timezone.now().date()
        tareos = Tareo.objects.filter(fecha=fecha_actual)
        
        if not tareos.exists():
            personal = Personal.objects.all()
            tareos_nuevos = []
            for persona in personal:
                tareos_nuevos.append(Tareo(
                    personal=persona,
                    fecha=fecha_actual,
                    tipo='UNIDAD'
                ))
            Tareo.objects.bulk_create(tareos_nuevos)
            tareos = Tareo.objects.filter(fecha=fecha_actual)
        
        serializer = self.get_serializer(tareos, many=True)
        return Response(serializer.data)

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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    try:
        print("\n=== DEBUG CURRENT_USER ===")
        user = User.objects.select_related('perfil').get(id=request.user.id)
        print(f"Usuario encontrado: {user.username}")
        print(f"¿Tiene perfil? {hasattr(user, 'perfil')}")
        
        # Intentar obtener o crear el perfil
        if not hasattr(user, 'perfil'):
            print("Creando perfil...")
            perfil, created = Perfil.objects.get_or_create(
                user=user,
                defaults={'rol': 'ADMIN' if user.is_superuser else 'OPERADOR'}
            )
            print(f"Perfil {'creado' if created else 'existente'}: {perfil}")
            # Recargar el usuario
            user.refresh_from_db()
        
        print(f"Perfil actual: {user.perfil if hasattr(user, 'perfil') else 'No tiene'}")
        
        # Serializar
        serializer = UserSerializer(user)
        data = serializer.data
        print(f"Datos serializados: {data}")
        
        if 'perfil' not in data:
            print("ERROR: Perfil no incluido en la serialización")
            # Intentar una última vez crear el perfil
            Perfil.objects.get_or_create(
                user=user,
                defaults={'rol': 'ADMIN' if user.is_superuser else 'OPERADOR'}
            )
            user.refresh_from_db()
            serializer = UserSerializer(user)
            data = serializer.data
        
        return Response(data)
        
    except Exception as e:
        print(f"Error en current_user: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=500)
