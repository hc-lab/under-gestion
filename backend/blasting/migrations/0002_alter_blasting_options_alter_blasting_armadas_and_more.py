# Generated by Django 5.1.4 on 2025-02-06 09:50

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blasting', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='blasting',
            options={'ordering': ['-fecha'], 'verbose_name': 'Blasting', 'verbose_name_plural': 'Blasting'},
        ),
        migrations.AlterField(
            model_name='blasting',
            name='armadas',
            field=models.IntegerField(help_text='Número de armadas realizadas', verbose_name='Armadas'),
        ),
        migrations.AlterField(
            model_name='blasting',
            name='fecha',
            field=models.DateField(default=django.utils.timezone.now, help_text='Fecha del registro', verbose_name='Fecha'),
        ),
        migrations.AlterField(
            model_name='blasting',
            name='longitud',
            field=models.DecimalField(decimal_places=2, help_text='Longitud en pies', max_digits=10, verbose_name='Longitud (pies)'),
        ),
        migrations.AlterField(
            model_name='blasting',
            name='perforacion',
            field=models.CharField(choices=[('EXTRACCION', 'Extracción'), ('AVANCE', 'Avance')], default='EXTRACCION', help_text='Tipo de perforación realizada', max_length=10, verbose_name='Tipo de Perforación'),
        ),
        migrations.AlterField(
            model_name='blasting',
            name='turno',
            field=models.CharField(choices=[('DIA', 'Día'), ('NOCHE', 'Noche')], default='DIA', help_text='Turno de trabajo', max_length=10, verbose_name='Turno'),
        ),
    ]
