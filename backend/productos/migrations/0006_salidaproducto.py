# Generated by Django 5.1.3 on 2024-11-30 00:42

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('productos', '0005_producto_categoria'),
    ]

    operations = [
        migrations.CreateModel(
            name='SalidaProducto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_hora', models.DateTimeField(default=django.utils.timezone.now)),
                ('cantidad', models.IntegerField()),
                ('entregado_a', models.CharField(max_length=100)),
                ('motivo', models.TextField()),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='salidas', to='productos.producto')),
            ],
        ),
    ]