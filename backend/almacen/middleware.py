from django.http import HttpResponseForbidden, HttpResponse

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