from django.urls import path, include
from rest_framework.routers import DefaultRouter

from filestorage.api.v1.user_views import UserViewSet

urlpatterns = [
    path('v1/', include('filestorage.api.v1.urls'))
]

# restful api
router = DefaultRouter(trailing_slash=False)
router.register('users', UserViewSet, 'users')