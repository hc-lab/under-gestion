from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PersonalViewSet, TareoViewSet, PersonalSearchView, PersonalListView

router = DefaultRouter()
router.register(r'personal', PersonalViewSet)
router.register(r'tareos', TareoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('personal/search/', PersonalSearchView.as_view(), name='personal-search'),
    path('personal-list/', PersonalListView.as_view(), name='personal-list'),
] 