from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PersonalViewSet, PersonalSearchView

router = DefaultRouter()
router.register(r'personales', PersonalViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('search/', PersonalSearchView.as_view(), name='personal-search'),
] 