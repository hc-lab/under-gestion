from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PersonalViewSet, TareoViewSet, PersonalSearchView, PersonalListView

router = DefaultRouter()
router.register(r'personal', PersonalViewSet, basename='personal')
router.register(r'tareos', TareoViewSet, basename='tareo')

urlpatterns = [
    path('', include(router.urls)),
    path('buscar-personal/', PersonalSearchView.as_view(), name='buscar-personal'),
    path('lista-personal/', PersonalListView.as_view(), name='lista-personal'),
] 