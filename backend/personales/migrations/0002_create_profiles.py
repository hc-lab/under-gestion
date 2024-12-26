from django.db import migrations

def create_profiles(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    Perfil = apps.get_model('personales', 'Perfil')
    
    for user in User.objects.all():
        Perfil.objects.get_or_create(
            user=user,
            defaults={'rol': 'ADMIN' if user.is_superuser else 'OPERADOR'}
        )

def reverse_func(apps, schema_editor):
    # No hacemos nada en la reversión
    pass

class Migration(migrations.Migration):
    dependencies = [
        ('personales', '0001_initial'),  # Asegúrate de que este sea el nombre correcto de tu migración inicial
    ]

    operations = [
        migrations.RunPython(create_profiles, reverse_func),
    ] 