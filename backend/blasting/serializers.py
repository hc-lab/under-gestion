from rest_framework import serializers
from .models import Blasting
from django.utils import timezone


class BlastingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blasting
        fields = ['id', 'fecha', 'armadas', 'longitud', 'turno', 'perforacion']

    def validate_armadas(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "El número de armadas debe ser mayor que 0")
        return value

    def validate_longitud(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "La longitud debe ser mayor que 0")
        return value

    def create(self, validated_data):
        if 'fecha' not in validated_data:
            validated_data['fecha'] = timezone.now()
        return super().create(validated_data)
