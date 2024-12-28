from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

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
        ('T', 'En Unidad'),
        ('PS', 'Permiso Sin Goce'),
        ('PC', 'Permiso Con Goce'),
        ('DL', 'Días Libres'),
        ('DM', 'Descanso Médico'),
        ('TL', 'Trabaja en Lima'),
        ('F', 'Falta'),
        ('R', 'Renuncia'),
    ]

    personal = models.ForeignKey('Personal', on_delete=models.CASCADE)
    fecha = models.DateField()
    tipo = models.CharField(max_length=2, choices=TIPO_CHOICES)
    observaciones = models.TextField(blank=True, null=True)
    registrado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['personal', 'fecha']
        ordering = ['fecha', 'personal']

    def __str__(self):
        return f"{self.personal} - {self.fecha} - {self.get_tipo_display()}"

    def clean(self):
        # Validaciones personalizadas si son necesarias
        pass

class Perfil(models.Model):
    ROLES = [
        ('ADMIN', 'Administrador'),
        ('SUPERVISOR', 'Supervisor'),
        ('OPERADOR', 'Operador'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    rol = models.CharField(max_length=20, choices=ROLES, default='OPERADOR')
    area = models.CharField(max_length=100, blank=True, null=True)
    activo = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        # Asegurar que los superusuarios siempre sean ADMIN
        if self.user.is_superuser:
            self.rol = 'ADMIN'
            print(f"Asignando rol ADMIN a superusuario {self.user.username}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.get_rol_display()}"

    class Meta:
        verbose_name = 'Perfil'
        verbose_name_plural = 'Perfiles'

# Señal para crear perfil automáticamente
@receiver(post_save, sender=User)
def ensure_profile_exists(sender, instance, created, **kwargs):
    """
    Asegura que exista un perfil para cada usuario.
    """
    if not hasattr(instance, 'perfil'):
        print(f"Creando perfil para {instance.username}")
        try:
            Perfil.objects.create(
                user=instance,
                rol='ADMIN' if instance.is_superuser else 'OPERADOR'
            )
            print(f"Perfil creado exitosamente para {instance.username}")
        except Exception as e:
            print(f"Error creando perfil para {instance.username}: {str(e)}")

