from uuid import UUID

from coreapi.compat import force_text
from django.http import Http404
from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from filestorage.models import UserFile, SharedUrl


def get_and_authenticate_user(username, password):
    user = authenticate(username=username, password=password)
    if user is None:
        raise serializers.ValidationError("Invalid username/password. Please try again!")
    return user


def get_user_file(file_id):
    try:
        file = UserFile.objects.get(id=file_id)
        if file is None:
            raise Http404
    except:
        raise Http404

    return file


def get_share_url(url_id):
    try:
        url = SharedUrl.objects.filter(id=url_id).select_related("user_file").first()
        if url is None:
            raise Http404
    except Exception as  ex:
        raise Http404

    return url


def create_user_account(username, email, password, first_name="",
                        last_name="", **extra_fields):
    user = get_user_model().objects.create_user(username=username, email=email, password=password,
                                                first_name=first_name, last_name=last_name, **extra_fields)
    return user


def encode_uuid_to_base64(uuid_) -> str:
    """Returns a urlsafe based64 encoded representation of a UUID object or UUID like string.
    """
    return urlsafe_base64_encode(force_bytes(uuid_))


def decode_uuid_from_base64(uuid_value: str):
    """Given a base64 encoded string, try to decode it to a valid UUID object.

    Returns a valid UUID value or None
    """
    try:
        return UUID(force_text(urlsafe_base64_decode(uuid_value)))
    except (ValueError, OverflowError, TypeError):
        return None
