from django.contrib.auth import get_user_model
from django.core.exceptions import ImproperlyConfigured
from rest_framework import viewsets, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.settings import api_settings
from rest_framework.views import APIView
from django.db.models import Count

from filestorage import serializers
from filestorage.utils import get_and_authenticate_user, create_user_account
from filestorage.models import UserFile

User = get_user_model()


class UserViewSet(viewsets.GenericViewSet):
    permission_classes = [AllowAny, ]
    serializer_class = serializers.EmptySerializer
    serializer_classes = {
        'login': serializers.UserLoginSerializer,
        'register': serializers.UserRegisterSerializer,
        'logout': serializers.EmptySerializer,
    }

    def get_serializer_class(self):
        if not isinstance(self.serializer_classes, dict):
            raise ImproperlyConfigured("serializer_classes should be a dict mapping.")

        if self.action in self.serializer_classes.keys():
            return self.serializer_classes[self.action]
        return super().get_serializer_class()

    @action(methods=['POST', ], detail=False)
    def login(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_and_authenticate_user(**serializer.validated_data)
        data = serializers.AuthUserSerializer(user).data
        return Response(data=data, status=status.HTTP_200_OK)

    @action(methods=['POST', ], detail=False)
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = create_user_account(**serializer.validated_data)
        data = serializers.AuthUserSerializer(user).data
        return Response(data=data, status=status.HTTP_201_CREATED)

    @action(methods=['POST', ], detail=False, authentication_classes=[TokenAuthentication, ])
    def logout(self, request):
        request.user.auth_token.delete()
        data = {'success': 'Successfully logged out'}
        return Response(data=data, status=status.HTTP_200_OK)


class UpdateUserView(APIView):
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )

    def post(self, request):

        serializer = serializers.UpdateUserSerializer(data=request.data, context=request)
        serializer.is_valid(raise_exception=True)
        if 'new_password' in request.data and serializer.validated_data['new_password'] is not None:
            request.user.set_password(serializer.validated_data['new_password'])
        if 'first_name' in request.data:
            request.user.first_name = serializer.validated_data['first_name']
        if 'last_name' in request.data:
            request.user.last_name = serializer.validated_data['last_name']
        request.user.save()
        data = {'success': 'Successfully updated user data'}
        return Response(data=data, status=status.HTTP_200_OK)


class AdminViews(APIView):
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAdminUser, )


class UserListView(AdminViews):
    pagination_class = api_settings.DEFAULT_PAGINATION_CLASS

    def get_queryset(self):
        user = self.request.user
        return User.objects.filter(owner=user)
    def get(self, request):
        queryset = User.objects.raw("""
            SELECT
                "filestorage_customuser"."id", 
                "filestorage_customuser"."is_staff",
                "filestorage_customuser"."username",
                "filestorage_customuser"."email", 
                "filestorage_customuser"."first_name",
                "filestorage_customuser"."last_name", 
                count("user_file"."user_id") as count_files,
                sum("user_file"."file_size") as total_size
            FROM "filestorage_customuser"
            LEFT JOIN "user_file" 
            ON "filestorage_customuser"."id"="user_file"."user_id"
            GROUP BY "filestorage_customuser"."id"
        """)

        serializer = serializers.UserListSerializer(queryset, many=True)
        try:
            _paginator = self.pagination_class()
            page = _paginator.paginate_queryset(serializer.data, request)
            if page is not None:
                resp = _paginator.get_paginated_response(page)
                return resp
        except Exception as ex:
            return Response(serializer.data)


class DeleteUserView(AdminViews):

    def post(self, request):
        serializer = serializers.DeleteUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_id = serializer.validated_data['user_id']
        try:
            u = User.objects.get(id=user_id)
            u.delete()
            data = {'success': f'Successfully deleted user {user_id}'}
            return Response(data=data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(data={'error': f'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(data={'err': e.message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SetUserAdminStatusView(AdminViews):

    def post(self, request):
        serializer = serializers.SetUserAdminSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_id, is_staff = serializer.validated_data['user_id'], serializer.validated_data['is_staff']
        try:
            u = User.objects.get(id=user_id)
            u.is_staff = is_staff
            u.save()
            data = {'success': f'Successfully changed status user {user_id}'}
            return Response(data=data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(data={'error': f'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(data={'err': e.message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)