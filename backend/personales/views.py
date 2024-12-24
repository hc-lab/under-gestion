from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters import rest_framework as filters
from .models import Personal
from .serializers import PersonalSerializer
from rest_framework import generics
from django.db.models import Q

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

class PersonalSearchView(generics.ListAPIView):
    serializer_class = PersonalSerializer

    def get_queryset(self):
        query = self.request.query_params.get('search', '')
        if query:
            return Personal.objects.filter(
                Q(nombres__icontains=query) | 
                Q(apellidos__icontains=query)
            )[:10]  # Limitamos a 10 resultados
        return Personal.objects.none()
