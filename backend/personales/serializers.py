from rest_framework import serializers
from .models import Personal, Tareo, TipoTareo

class PersonalSerializer(serializers.ModelSerializer):
    telefono_protegido = serializers.SerializerMethodField()
    dni_protegido = serializers.SerializerMethodField()

    class Meta:
        model = Personal
        fields = ['id', 'nombres', 'apellidos', 'dni_protegido', 'cargo', 'telefono_protegido', 'procedencia']

    def get_telefono_protegido(self, obj):
        if obj.telefono:
            return f"*****{obj.telefono[-4:]}"
        return None

    def get_dni_protegido(self, obj):
        if obj.dni:
            return f"*****{obj.dni[-3:]}"
        return None

# Nuevos serializers para el Tareo
class TareoSerializer(serializers.ModelSerializer):
    personal_nombre = serializers.CharField(source='personal.nombres', read_only=True)
    personal_apellidos = serializers.CharField(source='personal.apellidos', read_only=True)
    tipo_nombre = serializers.CharField(source='tipo.get_nombre_display', read_only=True)

    class Meta:
        model = Tareo
        fields = '__all__'

class TipoTareoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoTareo
        fields = '__all__' 