from django.db import migrations

def actualizar_permisos(apps, schema_editor):
    Tareo = apps.get_model('personales', 'Tareo')
    # Actualizar PS y PC a P
    Tareo.objects.filter(tipo__in=['PS', 'PC']).update(tipo='P')

class Migration(migrations.Migration):

    dependencies = [
        ('personales', '0002_update_tipo_values'),
    ]

    operations = [
        migrations.RunPython(actualizar_permisos, reverse_code=migrations.RunPython.noop),
        migrations.AlterField(
            model_name='tareo',
            name='tipo',
            field=models.CharField(
                max_length=2,
                choices=[
                    ('T', 'En Unidad'),
                    ('P', 'Permiso'),
                    ('DL', 'Días Libres'),
                    ('DM', 'Descanso Médico'),
                    ('TL', 'Trabaja en Lima'),
                ],
            ),
        ),
    ] 