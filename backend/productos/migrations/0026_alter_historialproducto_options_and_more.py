# Generated by Django 5.1.3 on 2024-12-14 16:18

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('productos', '0025_historialproducto_usuario'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='historialproducto',
            options={'ordering': ['-fecha']},
        ),
        migrations.RemoveField(
            model_name='historialproducto',
            name='fecha_hora',
        ),
        migrations.AddField(
            model_name='historialproducto',
            name='fecha',
            field=models.DateTimeField(db_index=True, default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='historialproducto',
            name='tipo_movimiento',
            field=models.CharField(blank=True, choices=[('Ingreso', 'Ingreso'), ('Salida', 'Salida')], default='Salida', max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='historialproducto',
            name='entregado_a',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='historialproducto',
            name='motivo',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='historialproducto',
            name='producto',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='productos.producto'),
        ),
        migrations.AlterField(
            model_name='historialproducto',
            name='usuario',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
