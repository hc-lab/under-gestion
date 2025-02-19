from django.db import models
from django.utils import timezone

class Blasting(models.Model):
    TURNO_CHOICES = [
        ('DIA', 'Día'),
        ('NOCHE', 'Noche'),
    ]
    
    PERFORACION_CHOICES = [
        ('EXTRACCION', 'Extracción'),
        ('AVANCE', 'Avance'),
    ]
    
    fecha = models.DateField(
        verbose_name='Fecha',
        help_text='Fecha del registro',
        auto_now_add=False,
        default=timezone.now
    )
    armadas = models.IntegerField(
        verbose_name='Armadas',
        help_text='Número de armadas realizadas'
    )
    longitud = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Longitud (pies)',
        help_text='Longitud en pies'
    )
    turno = models.CharField(
        max_length=10,
        choices=TURNO_CHOICES,
        default='DIA',
        verbose_name='Turno',
        help_text='Turno de trabajo'
    )
    perforacion = models.CharField(
        max_length=10,
        choices=PERFORACION_CHOICES,
        default='EXTRACCION',
        verbose_name='Tipo de Perforación',
        help_text='Tipo de perforación realizada'
    )
    
    class Meta:
        ordering = ['-fecha']
        verbose_name = 'Blasting'
        verbose_name_plural = 'Blasting'
    
    def __str__(self):
        return f"Voladura {self.fecha} - {self.get_turno_display()} - {self.get_perforacion_display()}"
