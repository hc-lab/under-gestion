from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('personales', '0003_update_permisos'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tareo',
            name='tipo',
            field=models.CharField(
                max_length=2,
                choices=[
                    ('T', 'En Unidad'),
                    ('PS', 'Permiso Sin Goce'),
                    ('PC', 'Permiso Con Goce'),
                    ('DL', 'Días Libres'),
                    ('DM', 'Descanso Médico'),
                    ('TL', 'Trabaja en Lima'),
                    ('F', 'Falta'),
                    ('R', 'Renuncia'),
                ],
                default='T'
            ),
        ),
    ] 