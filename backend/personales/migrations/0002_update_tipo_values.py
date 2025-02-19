from django.db import migrations

def update_tipo_values(apps, schema_editor):
    Tareo = apps.get_model('personales', 'Tareo')
    
    # Mapeo de valores antiguos a nuevos
    tipo_mapping = {
        'UNIDAD': 'T',
        'PERMISO': 'PS',
        'FALTA': 'DL',
        'DESCANSO': 'DM',
        'DIAS_LIBRES': 'DL',
        'OTROS': 'PC',
    }
    
    for tareo in Tareo.objects.all():
        tareo.tipo = tipo_mapping.get(tareo.tipo, 'T')  # 'T' como valor por defecto
        tareo.save()

class Migration(migrations.Migration):

    dependencies = [
        ('personales', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(update_tipo_values, reverse_code=migrations.RunPython.noop),
    ] 