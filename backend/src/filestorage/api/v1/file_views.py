import os
from datetime import datetime
from pathlib import Path

from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import FileResponse

from config.settings import BASE_DIR
from filestorage import serializers
from filestorage.models import UserFile, SharedUrl
from filestorage.utils import get_user_file, get_share_url

from rest_framework.settings import api_settings

class BaseUserFileView(APIView):
    authentication_classes = (TokenAuthentication,)


class UploadUserFileView(BaseUserFileView):

    def post(self, request):
        file = request.FILES.get('file')
        description = request.data.get('description') if not request.data.get('description') is None else ""

        if file is None:
            return Response(data={'error': f'File not found'}, status=status.HTTP_404_NOT_FOUND)

        folder = f"{BASE_DIR}/upload/{request.user.id}/"
        file_path = f"{BASE_DIR}/upload/{request.user.id}/{file.name}"
        if not os.path.isdir(folder):
            Path(folder).mkdir(parents=True, exist_ok=True)
        if os.path.isfile(file_path):
            return Response(data={'error': f'File already exists'}, status=status.HTTP_423_LOCKED)
        try:
            with open(file_path, 'wb') as f:
                for chunk in file.chunks():
                    f.write(chunk)
        except Exception as e:
            return Response(data={'error': e.message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        user_file = UserFile(file_name=file.name, file_size=file.size, file_path=file_path,
                             user=request.user, description=description)
        user_file.save()
        data = serializers.UserFileSerializer(user_file).data
        return Response(data=data, status=status.HTTP_201_CREATED)


class DownloadUserFileView(BaseUserFileView):

    def get(self, request, *args, **kwargs):
        uuid = request.GET.get('uuid')
        blob = request.GET.get('blob') == '1'

        uf = get_user_file(uuid)

        response = FileResponse(open(uf.file_path, 'rb'), as_attachment=True)
        if blob:
            response.as_attachment = False
        uf.count_download = uf.count_download + 1
        uf.downloaded = datetime.now()
        uf.save()
        return response


class GetUserFileListView(BaseUserFileView):
    pagination_class = api_settings.DEFAULT_PAGINATION_CLASS

    def get(self, request):
        user_id = request.GET.get('user_id')
        if user_id and request.user.is_staff:
            queryset = UserFile.objects.filter(user_id=user_id).all()
        else:
            queryset = UserFile.objects.filter(user_id=request.user.id).all()

        serializer = serializers.UserFileSerializer(queryset, many=True)

        try:
            _paginator = self.pagination_class()
            page = _paginator.paginate_queryset(serializer.data, request)
            if page is not None:
                resp = _paginator.get_paginated_response(page)
                return resp
        except Exception as ex:
            return Response(serializer.data)


class DeleteUserFileView(BaseUserFileView):

    def post(self, request):
        serializer = serializers.DeleteUserFileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        uf = get_user_file(serializer.validated_data['id'])
        try:
            os.remove(uf.file_path)
            uf.delete()
            data = {'success': f'Successfully deleted file {id}'}
            return Response(data=data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(data={'err': e.message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateUserFileView(BaseUserFileView):

    def post(self, request):
        serializer = serializers.UpdateUserFileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_filename = serializer.validated_data['filename'] if 'filename' in serializer.validated_data else None
        new_description = serializer.validated_data[
            'description'] if 'description' in serializer.validated_data else None
        if not new_description and not new_filename:
            return Response(data={'error': "Need feel field filename or description"},
                            status=status.HTTP_400_BAD_REQUEST)
        uf = get_user_file(serializer.validated_data['id'])

        if new_filename:
            new_file_path = f"{BASE_DIR}/upload/{uf.user_id}/{new_filename}"
            if new_file_path != uf.file_path:
                if os.path.isfile(new_file_path):
                    return Response(data={'error': f'File {new_filename} already exists'}, status=status.HTTP_423_LOCKED)
                try:
                    os.rename(uf.file_path, new_file_path)
                    uf.file_path = new_file_path
                    uf.file_name = new_filename
                except Exception as e:
                    return Response(data={'error': e.message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        if new_description:
            uf.description = new_description

        uf.save()
        data = {'success': f'Successfully updated file name'}
        return Response(data=data, status=status.HTTP_200_OK)


class CreateSharedUrlView(BaseUserFileView):
    def post(self, request):
        serializer = serializers.CreateSharedUrlSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        uf = get_user_file(serializer.validated_data['user_file_id'])
        shu = SharedUrl.objects.filter(user_file=uf.id).first()
        if shu is not None:
            serializer = serializers.SharedUrlSerializer(shu, many=False)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        try:
            shu = SharedUrl(user_file=uf)
            shu.save()
            serializer = serializers.SharedUrlSerializer(shu, many=False)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(data={'err': e.message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DeleteSharedUrlView(BaseUserFileView):
    def post(self, request):
        serializer = serializers.DeleteSharedUrlSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        shu = get_share_url(serializer.validated_data['id'])
        try:
            shu.delete()
            data = {'success': f'Successfully deleted shared url'}
            return Response(data=data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(data={'err': e.message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetSharedUrlView(APIView):
    permission_classes = (AllowAny, )
    def get(self, request):
        uuid = request.GET.get('uuid')

        uf = get_share_url(uuid)
        try:
            response = FileResponse(open(uf.user_file.file_path, 'rb'), as_attachment=True)
            user_file = UserFile.objects.get(id=uf.user_file.id)
            # user_file = serializers.UserFileSerializer(data=data)
            # user_file.is_valid(raise_exception=True)
            user_file.count_download = user_file.count_download + 1
            user_file.downloaded = datetime.now()

            user_file.save()
            return response
        except Exception as e:
            return Response(data={'err': e.message}, status=status.HTTP_404_NOT_FOUND)


class DownloadBySharedUrlView(BaseUserFileView):

    def get(self, request):
        uuid = request.GET.get('uuid') if request.GET.get('uuid') else None
        blob = request.GET.get('blob') == 1 if request.GET.get('blob') else False

        shu = get_share_url(uuid)

        response = FileResponse(open(shu.user_file.file_path, 'rb'), as_attachment=True)
        if blob:
            response.as_attachment = False
        return response
