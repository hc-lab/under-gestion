from rest_framework import serializers
from .models import Personal, Tareo
from django.contrib.auth.models import User
from .models import Perfil

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
            'fecha_registro'
        ]

    def validate(self, data):
        """
        Validar que no exista otro tareo para el mismo personal en la misma fecha
        """
        personal = data.get('personal')
        fecha = data.get('fecha')
        instance = self.instance

        # Verificar si ya existe un tareo para este personal en esta fecha
        existing_tareo = Tareo.objects.filter(
            personal=personal,
            fecha=fecha
        ).exclude(id=instance.id if instance else None).first()

        if existing_tareo:
            raise serializers.ValidationError(
                "Ya existe un tareo para este personal en esta fecha"
            )

        return data 

class PerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Perfil
        fields = ['rol', 'area', 'activo']

class UserSerializer(serializers.ModelSerializer):
    perfil = PerfilSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'perfil']

    def to_representation(self, instance):
        # Crear perfil si no existe
        if not hasattr(instance, 'perfil'):
            Perfil.objects.create(user=instance, rol='OPERADOR')
            instance.refresh_from_db()
        
        data = super().to_representation(instance)
        # Asegurarse de que el perfil esté incluido
        if hasattr(instance, 'perfil'):
            data['perfil'] = PerfilSerializer(instance.perfil).data
        
        return data 