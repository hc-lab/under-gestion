from django.apps import AppConfig

class BlastingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'blasting'
    verbose_name = 'Budget'  # Esto cambiará el nombre en el admin
