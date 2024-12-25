from django.db import models
from django.core.exceptions import ValidationError

class Personal(models.Model):
    BANCOS_CHOICES = [
        ('BCP', 'Banco de Crédito del Perú'),
        ('BBVA', 'BBVA'),
        ('Interbank', 'Interbank'),
        ('Scotiabank', 'Scotiabank'),
        ('BN', 'Banco de la Nación'),   
        ('Otros', 'Otros')
    ]

    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    dni = models.CharField(max_length=8, unique=True)
    cargo = models.CharField(max_length=100)
    telefono = models.CharField(max_length=9, blank=True, null=True)
    procedencia = models.CharField(max_length=100)
    numero_cuenta = models.CharField(max_length=20, blank=True, null=True, verbose_name='Número de Cuenta')
    numero_cci = models.CharField(max_length=20, blank=True, null=True, verbose_name='Número de CCI')
    banco = models.CharField(
        max_length=20, 
        choices=BANCOS_CHOICES,
        blank=True, 
        null=True, 
        verbose_name='Entidad Bancaria'
    )
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['apellidos', 'nombres']

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"

class Tareo(models.Model):
    TIPO_CHOICES = [
        ('UNIDAD', 'En Unidad'),
        ('PERMISO', 'Permiso'),
        ('FALTA', 'Falta'),
        ('DESCANSO', 'Descanso Médico'),
        ('DIAS_LIBRES', 'Días Libres'),
        ('OTROS', 'Otros')
    ]

    personal = models.ForeignKey(Personal, on_delete=models.CASCADE, related_name='tareos')
    fecha = models.DateField()
    tipo = models.CharField(
        max_length=20, 
        choices=TIPO_CHOICES,
        default='UNIDAD'
    )
    motivo = models.TextField(blank=True, null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-fecha', 'personal__apellidos']
        unique_together = ['personal', 'fecha']

    def __str__(self):
        return f"{self.personal} - {self.get_tipo_display()} ({self.fecha})"

    def clean(self):
        # Validaciones personalizadas si son necesarias
        pass

