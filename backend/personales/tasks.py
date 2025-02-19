from django.utils import timezone
from .models import Personal, Tareo
from datetime import datetime, time

def crear_tareos_diarios():
    """
    Crear registros de tareo para todo el personal a las 8:00 AM
    usando los datos de Control de Asistencia
    """
    hoy = timezone.now().date()
    hora_actual = timezone.now().time()
    hora_registro = time(8, 0)  # 8:00 AM

    # Solo ejecutar si es la hora programada (8:00 AM)
    if hora_actual.hour == hora_registro.hour and hora_actual.minute == hora_registro.minute:
        # Obtener todo el personal activo
        personal = Personal.objects.all()
        
        for persona in personal:
            # Verificar si ya existe un registro para hoy
            tareo_existente = Tareo.objects.filter(
                personal=persona,
                fecha=hoy
            ).first()

            if not tareo_existente:
                # Crear nuevo registro de tareo
                Tareo.objects.create(
                    personal=persona,
                    fecha=hoy,
                    tipo='T',  # Por defecto marca como "En Unidad"
                    observaciones='Registro automático del sistema'
                ) 