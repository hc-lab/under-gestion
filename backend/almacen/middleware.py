from django.http import HttpResponseForbidden

class CORSMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
        response["Access-Control-Allow-Credentials"] = "true"
        return response

class RoleMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated and not request.user.is_superuser:
            if not hasattr(request.user, 'perfil'):
                return HttpResponseForbidden("No tiene perfil asignado")
            
            if request.user.perfil.rol == 'OPERADOR':
                if '/admin/' in request.path and not request.path.endswith('/change/'):
                    return HttpResponseForbidden("Acceso no autorizado")

        response = self.get_response(request)
        return response 