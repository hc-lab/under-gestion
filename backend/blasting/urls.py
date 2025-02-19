from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlastingViewSet

router = DefaultRouter()
router.register(r'blasting', BlastingViewSet, basename='blasting')

urlpatterns = [
    path('', include(router.urls)),
]
