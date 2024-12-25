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

class TipoTareo(models.Model):
    TIPO_CHOICES = [
        ('PERMISO', 'Permiso'),
        ('DIA_LIBRE', 'Día Libre'),
        ('UNIDAD', 'En Unidad'),
        ('RENUNCIA', 'Renuncia'),
        ('FALTA', 'Falta'),
        ('DESCANSO_MEDICO', 'Descanso Médico')
    ]

    nombre = models.CharField(max_length=50, choices=TIPO_CHOICES, unique=True)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.get_nombre_display()

class Tareo(models.Model):
    personal = models.ForeignKey('Personal', on_delete=models.CASCADE, related_name='tareos')
    tipo = models.ForeignKey(TipoTareo, on_delete=models.PROTECT)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField(null=True, blank=True)
    observaciones = models.TextField(blank=True, null=True)
    documento = models.FileField(upload_to='documentos_tareo/', blank=True, null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    unidad_trabajo = models.CharField(max_length=100, blank=True, null=True)
    estado = models.CharField(
        max_length=20,
        choices=[
            ('PENDIENTE', 'Pendiente'),
            ('APROBADO', 'Aprobado'),
            ('RECHAZADO', 'Rechazado')
        ],
        default='PENDIENTE'
    )

    def clean(self):
        if self.fecha_fin and self.fecha_inicio > self.fecha_fin:
            raise ValidationError('La fecha de fin no puede ser anterior a la fecha de inicio')

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-fecha_inicio']

    def __str__(self):
        return f"{self.personal} - {self.tipo} ({self.fecha_inicio})"

