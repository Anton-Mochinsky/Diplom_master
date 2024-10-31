from coreapi.auth import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework import serializers
from django.contrib.auth import get_user_model, password_validation
from rest_framework.serializers import ModelSerializer,  StringRelatedField, DateTimeField

from filestorage.models import UserFile, SharedUrl

User = get_user_model()


class UserLoginSerializer(serializers.Serializer):
    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass

    username = serializers.CharField(max_length=20,  required=True)
    password = serializers.CharField(write_only=True, required=True)


class AuthUserSerializer(serializers.ModelSerializer):
    auth_token = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff',  'auth_token')
        read_only_fields = ('id', 'is_staff', 'is_active', 'is_superuser',  'auth_token')

    def get_auth_token(self, obj):
        try:
            token = Token.objects.get(user=User.objects.get(id=obj.id))
            if token:
                return token.key
        except:
            pass
        token = Token.objects.create(user=obj)
        return token.key


class UserRegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False)
    password = serializers.CharField(required=False)
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')

    def validate_username(self, username):
        user = User.objects.filter(username=username)
        if user:
            raise serializers.ValidationError(f"Пользователь с таким логином уже существует")
        return username

    def validate_password(self, value):
        password_validation.validate_password(value)
        return value


class UpdateUserSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=False, allow_blank=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)

    def validate_current_password(self, value):
        user = self.context.user
        if not user or not user.check_password(value):
            raise serializers.ValidationError('Current password does not match')
        return value

    @staticmethod
    def validate_new_password(value):
        if value is None or value == "":
            return None
        password_validation.validate_password(value)
        return value



class DeleteUserSerializer(serializers.Serializer):
    user_id = serializers.CharField(required=True)




class SetUserAdminSerializer(serializers.Serializer):
    user_id = serializers.CharField(required=True)
    is_staff = serializers.BooleanField(required=True)





class EmptySerializer(serializers.Serializer):
    pass


class UserFileSerializer(serializers.ModelSerializer):
    created = DateTimeField(format='%Y-%m-%d %H:%M')
    modified = DateTimeField(format='%Y-%m-%d %H:%M')
    downloaded = DateTimeField(format='%Y-%m-%d %H:%M')

    class Meta:
        model = UserFile
        fields = ['id', 'file_name', 'file_size',  'description', 'count_download', 'created', 'modified', 'downloaded']
        read_only_fields = ('id', 'file_size',  'created', 'modified')



class UserSerializer(serializers.ModelSerializer):
    id = serializers.CharField(required=True)
    username = serializers.CharField(required=True)
    email = serializers.CharField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    is_active = serializers.BooleanField(required=True)
    is_staff = serializers.BooleanField(required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'is_superuser')
        read_only_fields = ('id', 'is_staff', 'is_active', 'is_superuser')


class UserListSerializer(serializers.ModelSerializer):
    id = serializers.CharField(required=True)
    username = serializers.CharField(required=True)
    email = serializers.CharField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    is_active = serializers.BooleanField(required=True)
    is_staff = serializers.BooleanField(required=True)
    count_files = serializers.IntegerField(required=True)
    total_size = serializers.IntegerField(required=True, allow_null=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'is_superuser',
                  'count_files', 'total_size')
        read_only_fields = ('id', 'is_staff', 'is_active', 'is_superuser', 'count_files', 'total_size')


class DeleteUserFileSerializer(serializers.Serializer):
    id = serializers.CharField(required=True)


class UpdateUserFileSerializer(serializers.Serializer):
    id = serializers.CharField(required=True)
    filename = serializers.CharField(required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True)


class CreateSharedUrlSerializer(serializers.Serializer):
    user_file_id = serializers.CharField(required=True)


class DeleteSharedUrlSerializer(serializers.Serializer):
    id = serializers.CharField(required=True)


class SharedUrlSerializer(ModelSerializer):
    created = DateTimeField(format='%Y-%m-%d %H:%M')

    class Meta:
        model = SharedUrl
        fields = ['id', 'created']
        read_only_fields = ('id', 'created')
