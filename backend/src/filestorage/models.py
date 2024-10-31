import uuid

from django.db import models
from django.contrib.auth.models import AbstractUser, User


# Create your models here.


class TimeStampedMixin(models.Model):
    # auto_now_add автоматически выставит дату создания записи
    created = models.DateTimeField(auto_now_add=True)
    # auto_now изменятся при каждом обновлении записи
    modified = models.DateTimeField(auto_now=True)

    class Meta:
        # Этот параметр указывает Django, что этот класс не является представлением таблицы
        abstract = True


class UUIDMixin(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class CustomUser(AbstractUser):
    username = models.CharField('First Name', max_length=255, blank=True,
                                null=False, unique=True)
    email = models.EmailField('email address', unique=True)
    first_name = models.CharField('First Name', max_length=255, blank=True,
                                  null=False)
    last_name = models.CharField('Last Name', max_length=255, blank=True,
                                 null=False)
    is_superuser = models.BooleanField(default=False, help_text='Designates that this user has all permissions '
                                                                'without explicitly assigning them.',
                                       verbose_name='superuser status')
    is_active = models.BooleanField(default=True, help_text='Designates whether this user should be treated as active.'
                                                            ' Unselect this instead of deleting accounts.',
                                    verbose_name='active')

    def __str__(self):
        return f"{self.username} - {self.first_name} {self.last_name}  {self.email} " +\
                (" admin" if self.is_superuser else "") +\
                (" active" if self.is_active else " blocked")


class UserFile(UUIDMixin, TimeStampedMixin):
    #  имя файла, комментарий, размер, дата загрузки, дата последнего скачивания
    file_name = models.CharField(max_length=100, verbose_name='Имя файла')
    file_size = models.BigIntegerField(default=0, verbose_name='Размер файла')
    file_path = models.CharField(db_index=True, max_length=500, verbose_name="Путь к файлу")
    description = models.TextField(blank=True, verbose_name='комментарий')
    count_download = models.BigIntegerField(default=0, verbose_name='количество скачиваний')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, verbose_name='владелец файла')
    downloaded = models.DateTimeField(auto_now=True)

    class Meta:
        # Ваши таблицы находятся в нестандартной схеме. Это нужно указать в классе модели
        db_table = "user_file"
        # Следующие два поля отвечают за название модели в интерфейсе
        verbose_name = "Список файлов пользователей"
        verbose_name_plural = "Список файлов пользователей"

    def __str__(self):
        return self.file_name


class SharedUrl(UUIDMixin):
    user_file = models.ForeignKey(UserFile, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "shared_url"
        verbose_name = 'Публичные файлы'
        verbose_name_plural = 'Публичные файлы'
