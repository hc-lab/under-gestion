# Generated by Django 5.1.4 on 2024-12-23 20:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('personales', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='personal',
            options={'ordering': ['apellidos', 'nombres']},
        ),
        migrations.RemoveField(
            model_name='personal',
            name='fecha_actualizacion',
        ),
        migrations.AlterField(
            model_name='personal',
            name='procedencia',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='personal',
            name='telefono',
            field=models.CharField(max_length=9),
        ),
    ]
