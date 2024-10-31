from django.test import TestCase

from filestorage.serializers import User


class UserModelTestCase(TestCase):

    def test_create_user(self):
        u = User.objects.create_user(username="test_user", email='f@f.com', password='abc12399A#',
                                     first_name="F", last_name='B')
        assert u.is_active is True
        assert u.is_staff is False
        assert u.is_superuser is False
        assert u.email == 'f@f.com'
        assert u.get_full_name() == 'F B'
        assert u.get_short_name() == 'F'
        assert str(u) == str('{} - {} - {}'.format(u.username, u.email, u.get_full_name()))

    def test_create_super_user(self):
        u = User.objects.create_superuser(username="test_admin", email='f@f.com', password='abc12399A#')
        assert u.is_active is True
        assert u.is_staff is True
        assert u.is_superuser is True
        assert str(u) == str('{} - {} - {}'.format(u.username, u.email, u.get_full_name()))
