from django.db import models

class Personal(models.Model):
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    dni = models.CharField(max_length=8, unique=True)
    cargo = models.CharField(max_length=100)
    telefono = models.CharField(max_length=15)
    procedencia = models.CharField(max_length=200)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['apellidos', 'nombres']
        verbose_name = 'Personal'
        verbose_name_plural = 'Personal'

    def __str__(self):
        return f"{self.apellidos}, {self.nombres} - {self.cargo}"

    def clean(self):
        self.nombres = self.nombres.upper()
        self.apellidos = self.apellidos.upper()
        self.cargo = self.cargo.upper()
        self.procedencia = self.procedencia.upper()

        if not str(self.dni).isdigit():
            raise models.ValidationError('El DNI debe contener solo números')
        if len(str(self.dni)) != 8:
            raise models.ValidationError('El DNI debe tener 8 dígitos')

        telefono_limpio = ''.join(filter(str.isdigit, self.telefono))
        if len(telefono_limpio) < 7:
            raise models.ValidationError('El número de teléfono no es válido')
