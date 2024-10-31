from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet

from filestorage.serializers import SignupSerializer


class UserViewSet(ModelViewSet):
    queryset = get_user_model().objects
    serializer_class = SignupSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = (AllowAny,)

        return super(UserViewSet, self).get_permissions()
