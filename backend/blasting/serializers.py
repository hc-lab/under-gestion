from rest_framework import serializers
from .models import Blasting

class BlastingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blasting
        fields = ['id', 'fecha', 'armadas', 'longitud', 'turno', 'perforacion']
        read_only_fields = ['fecha']
