# Generated by Django 5.1.3 on 2024-11-30 01:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('productos', '0008_alter_producto_unidad_medida'),
    ]

    operations = [
        migrations.AlterField(
            model_name='producto',
            name='categoria',
            field=models.CharField(choices=[('Cocina', 'Cocina'), ('Almacen', 'Almacén'), ('EPPS', 'EPPS'), ('Mina', 'Mina'), ('Medicamento', 'Medicamento')], default='Cocina', max_length=50),
        ),
        migrations.AlterField(
            model_name='producto',
            name='estado',
            field=models.CharField(default='Disponible', max_length=50),
        ),
    ]