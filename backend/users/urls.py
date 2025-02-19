from django.urls import path
from .views import UserMeView

urlpatterns = [
    path('user/me/', UserMeView.as_view(), name='user-me'),  # Cambiado de 'users/me/' a 'user/me/'
    # ...otros paths...
]
