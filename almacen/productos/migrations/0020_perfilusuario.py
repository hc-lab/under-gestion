# Generated by Django 5.1.3 on 2024-12-12 19:16

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('productos', '0019_alter_noticia_fecha_creacion'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='PerfilUsuario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('es_admin', models.BooleanField(default=False)),
                ('puede_escribir', models.BooleanField(default=False)),
                ('puede_editar', models.BooleanField(default=False)),
                ('puede_eliminar', models.BooleanField(default=False)),
                ('usar_base_datos_admin', models.BooleanField(default=True)),
                ('base_datos_propia', models.CharField(blank=True, max_length=100, null=True)),
                ('usuario', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
