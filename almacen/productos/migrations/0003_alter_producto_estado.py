# Generated by Django 5.1.3 on 2024-11-29 02:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('productos', '0002_producto_descripcion_producto_estado_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='producto',
            name='estado',
            field=models.CharField(default='nuevo', max_length=50),
        ),
    ]
