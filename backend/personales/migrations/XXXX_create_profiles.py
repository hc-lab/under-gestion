from django.db import migrations

def create_profiles(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    Perfil = apps.get_model('personales', 'Perfil')
    
    for user in User.objects.all():
        Perfil.objects.get_or_create(
            user=user,
            defaults={'rol': 'ADMIN' if user.is_superuser else 'OPERADOR'}
        )

class Migration(migrations.Migration):
    dependencies = [
        ('personales', 'XXXX_previous_migration'),  # Reemplaza con la migración anterior
    ]

    operations = [
        migrations.RunPython(create_profiles),
    ] 