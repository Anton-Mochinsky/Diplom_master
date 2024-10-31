from rest_framework import exceptions, status


class BaseException(exceptions.APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail ='Unexpected error'

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail
