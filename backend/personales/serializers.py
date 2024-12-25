from rest_framework import serializers
from .models import Personal, Tareo

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
    nombre_personal = serializers.CharField(source='personal.nombres', read_only=True)
    apellidos_personal = serializers.CharField(source='personal.apellidos', read_only=True)
    cargo_personal = serializers.CharField(source='personal.cargo', read_only=True)

    class Meta:
        model = Tareo
        fields = [
            'id', 
            'personal', 
            'nombre_personal',
            'apellidos_personal',
            'cargo_personal',
            'fecha', 
            'tipo', 
            'motivo',
            'unidad_trabajo',
            'fecha_registro'
        ] 