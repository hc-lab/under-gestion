from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Blasting
from .serializers import BlastingSerializer

class BlastingViewSet(viewsets.ModelViewSet):
    queryset = Blasting.objects.all()
    serializer_class = BlastingSerializer
    permission_classes = [IsAuthenticated]
