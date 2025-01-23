# Under-Gestion

Sistema de gestión empresarial desarrollado con Python (Backend) y React (Frontend).

## Requisitos Previos

- Python 3.x
- Node.js y npm
- PostgreSQL
- Docker (opcional)

## Configuración del Proyecto

### Backend

1. Crear un entorno virtual:
```bash
python -m venv venv
source venv/bin/activate  # En Linux/Mac
```

2. Instalar dependencias:
```bash
pip install -r requirements.txt
```

3. Configurar variables de entorno:
Crear un archivo `.env` con las variables necesarias (ver `.env.example`)

### Frontend

1. Instalar dependencias:
```bash
cd frontend
npm install
```

2. Construir el frontend:
```bash
npm run build
```

## Ejecución del Proyecto

### Con Docker

```bash
docker-compose up --build
```

### Sin Docker

1. Backend:
```bash
python app.py
```

2. Frontend:
```bash
cd frontend
npm start
```

## Despliegue

El proyecto está configurado para desplegarse en Railway.com. Ver `railway.toml` para la configuración específica.

## Estructura del Proyecto

- `/backend`: Código del servidor Python
- `/frontend`: Aplicación React
- `/docker-compose.yml`: Configuración de Docker
- `requirements.txt`: Dependencias de Python
- `railway.toml`: Configuración de despliegue

## Contribuir

1. Fork el proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
