from rest_framework import serializers
from .models import Personal

class PersonalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Personal
        fields = '__all__'
        read_only_fields = ('fecha_registro', 'fecha_actualizacion')

    def validate_dni(self, value):
        if not str(value).isdigit():
            raise serializers.ValidationError("El DNI debe contener solo números")
        if len(str(value)) != 8:
            raise serializers.ValidationError("El DNI debe tener 8 dígitos")
        return value

    def validate_telefono(self, value):
        telefono_limpio = ''.join(filter(str.isdigit, value))
        if len(telefono_limpio) < 7:
            raise serializers.ValidationError("El número de teléfono no es válido")
        return value 