from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters import rest_framework as filters
from .models import Personal
from .serializers import PersonalSerializer

class PersonalFilter(filters.FilterSet):
    class Meta:
        model = Personal
        fields = {
            'nombres': ['icontains'],
            'apellidos': ['icontains'],
            'dni': ['exact'],
            'cargo': ['icontains'],
            'procedencia': ['icontains'],
        }

class PersonalViewSet(viewsets.ModelViewSet):
    queryset = Personal.objects.all()
    serializer_class = PersonalSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = PersonalFilter
    search_fields = ['nombres', 'apellidos', 'dni', 'cargo', 'procedencia']
    ordering_fields = ['apellidos', 'nombres', 'fecha_registro']
    ordering = ['apellidos', 'nombres']
