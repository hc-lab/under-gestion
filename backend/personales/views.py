from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime
from .models import Personal, Tareo
from .serializers import PersonalSerializer, TareoSerializer

class TareoViewSet(viewsets.ModelViewSet):
    queryset = Tareo.objects.all()
    serializer_class = TareoSerializer
    filterset_fields = ['tipo', 'personal', 'fecha']
    search_fields = ['motivo', 'personal__nombres', 'personal__apellidos']
    ordering_fields = ['fecha', 'fecha_registro']
    ordering = ['-fecha']

    @action(detail=False, methods=['get'])
    def hoy(self, request):
        """Obtener todos los tareos de hoy"""
        fecha_actual = timezone.now().date()
        tareos = Tareo.objects.filter(fecha=fecha_actual)
        
        # Si no hay tareos para hoy, crear automáticamente para todo el personal
        if not tareos.exists():
            personal = Personal.objects.all()
            tareos_nuevos = []
            for persona in personal:
                tareos_nuevos.append(Tareo(
                    personal=persona,
                    fecha=fecha_actual,
                    tipo='UNIDAD'  # Por defecto todos están en unidad
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
