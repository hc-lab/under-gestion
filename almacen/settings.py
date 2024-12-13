DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'almacen',
        'USER': 'hitt',
        'PASSWORD': 'una_contraseña_segura',
        'HOST': 'localhost',
        'PORT': '5432',
        'OPTIONS': {
            'client_encoding': 'UTF8'
        },
    }
}

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media') 

# Asegúrate de que estos permisos estén configurados
POSTGRES_SUPERUSER_PERMISSIONS = [
    'CREATE',
    'ALTER',
    'DROP',
    'DELETE',
    'INSERT',
    'UPDATE',
    'SELECT'
]