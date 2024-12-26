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
        print(f"\n=== DEBUG SERIALIZER ===")
        print(f"Serializando usuario: {instance.username}")
        print(f"¿Tiene perfil antes?: {hasattr(instance, 'perfil')}")
        
        # Crear perfil si no existe
        try:
            if not hasattr(instance, 'perfil'):
                print("Creando perfil en serializer...")
                perfil = Perfil.objects.create(user=instance, rol='ADMIN')
                print(f"Perfil creado: {perfil}")
                instance.refresh_from_db()
        except Exception as e:
            print(f"Error creando perfil en serializer: {str(e)}")

        data = super().to_representation(instance)
        
        # Forzar la inclusión del perfil
        try:
            if hasattr(instance, 'perfil'):
                print("Agregando perfil a la serialización...")
                perfil_data = PerfilSerializer(instance.perfil).data
                data['perfil'] = perfil_data
                print(f"Datos del perfil agregados: {perfil_data}")
            else:
                print("¡ADVERTENCIA! Usuario sin perfil después de intentar crearlo")
        except Exception as e:
            print(f"Error serializando perfil: {str(e)}")

        print(f"Datos finales: {data}")
        return data 