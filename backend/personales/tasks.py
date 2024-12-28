from django.utils import timezone
from .models import Personal, Tareo
from datetime import datetime, time

def crear_tareos_diarios():
    """
    Crear registros de tareo para todo el personal a las 8:00 AM
    Por defecto se marca como 'F' (Falta) hasta que se actualice manualmente
    """
    hoy = timezone.now().date()
    hora_actual = timezone.now().time()
    hora_registro = time(8, 0)  # 8:00 AM

    # Solo ejecutar si es la hora programada (8:00 AM)
    if hora_actual.hour == hora_registro.hour and hora_actual.minute == hora_registro.minute:
        # Obtener todo el personal activo
        personal = Personal.objects.all()
        
        # Crear tareos para cada persona que no tenga registro hoy
        for persona in personal:
            Tareo.objects.get_or_create(
                personal=persona,
                fecha=hoy,
                defaults={
                    'tipo': 'F',  # Por defecto se marca como Falta
                    'observaciones': 'Registro automático'
                }
            ) 