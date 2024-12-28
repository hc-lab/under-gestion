from rest_framework import serializers
from .models import Personal, Tareo
from django.contrib.auth.models import User
from .models import Perfil

class PersonalSerializer(serializers.ModelSerializer):
    telefono_protegido = serializers.SerializerMethodField()
    dni_protegido = serializers.SerializerMethodField()

    class Meta:
        model = Personal
        fields = '__all__'

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
    class Meta:
        model = Tareo
        fields = ['id', 'personal', 'fecha', 'tipo', 'observaciones', 'registrado_por', 'fecha_registro']
        read_only_fields = ['fecha_registro']

    def validate_tipo(self, value):
        valid_tipos = ['T', 'PS', 'PC', 'DL', 'DM', 'TL', 'F', 'R']
        if value not in valid_tipos:
            raise serializers.ValidationError(f"Tipo debe ser uno de: {', '.join(valid_tipos)}")
        return value

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
            print(f"Creando perfil en serializer para {instance.username}")
            Perfil.objects.get_or_create(
                user=instance,
                defaults={'rol': 'ADMIN' if instance.is_superuser else 'OPERADOR'}
            )
            # Recargar el usuario para obtener el perfil
            instance.refresh_from_db()

        # Obtener la representación base
        data = super().to_representation(instance)
        
        # Asegurarse de que el perfil esté incluido
        if hasattr(instance, 'perfil'):
            print(f"Perfil encontrado para {instance.username}: {instance.perfil}")
            data['perfil'] = PerfilSerializer(instance.perfil).data
        else:
            print(f"¡ADVERTENCIA! No se encontró perfil para {instance.username}")

        print(f"Datos finales de serialización: {data}")
        return data 