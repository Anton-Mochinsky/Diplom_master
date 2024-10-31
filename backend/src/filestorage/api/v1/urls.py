from django.urls import path

from .user_views import UserViewSet, UserListView, DeleteUserView, SetUserAdminStatusView, UpdateUserView
from .file_views import UploadUserFileView, GetUserFileListView, DownloadUserFileView, DeleteUserFileView, \
    UpdateUserFileView, CreateSharedUrlView, DeleteSharedUrlView, DownloadBySharedUrlView, GetSharedUrlView

urlpatterns = [
    path('users/list', UserListView.as_view()),
    path('users/register', UserViewSet.as_view({"post": "register"})),
    path('users/login', UserViewSet.as_view({"post": "login"})),
    path('users/logout', UserViewSet.as_view({"post": "logout"})),
    path('users/update', UpdateUserView.as_view()),
    path('users/delete', DeleteUserView.as_view()),
    path('users/set-admin', SetUserAdminStatusView.as_view()),
]


urlpatterns += [
    path('files/list', GetUserFileListView.as_view()),
    path('files/upload', UploadUserFileView.as_view()),
    path('files/download', DownloadUserFileView.as_view()),
    path('files/delete', DeleteUserFileView.as_view()),
    path('files/update', UpdateUserFileView.as_view()),
    path('files/create-share', CreateSharedUrlView.as_view()),
    path('files/hide-share', DeleteSharedUrlView.as_view()),
    path('files/get-share', GetSharedUrlView.as_view()),
    path('files/share', DownloadBySharedUrlView.as_view()),
]
