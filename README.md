# Файловый сервис Python + Django + PostgreSQL + React 
## Сборка фронта React
Для сборки фронта необходимо выполнить следующие команды

* Перейти в папку проекта выполнив команду

    `cd frontend`

* Установить пакеты выполнив команду

    `npm install`

* Собрать проект выполнив команду

    `npm run-script build`

* Скопировать статические файлы 

    `xcopy build ..\backend\src\static /y /e - для Windows`

или

    `cp -R build ..\backend\src\static` - для Linux

### Дополнительные настройки для фронта
* Чтобы изменить адрес сервера RestAPI необходимо откорректировать файл `frontend/.env` после чего 
  пересобрать проект и скопировать заново файлы


## Сборка backend Python

* Перейти в папку проекта выполнив команду
    
    `cd backend/src`

* Создать виртуальное окружение 

    `python -m venv venv`

* Активировать виртуальное окружение 

    `venv\Scripts\activate.bat - для Windows;`
    `source venv/bin/activate - для Linux и MacOS.`


* Установить пакеты выполнив команду

    `pip install -r ./requirements.txt`

## Настройка проекта

* Установить базу данных PostgreSQL локально, либо иметь уже развернутую, либо через докер выполнив команду
    
    `docker-compose -p django_db -f ./docker-compose-dev.yml build`

* Переименовать .env.example в .env и прописать необходимые настройки
 
* Установить миграции базы дынных выполнив команду
 
     `python manage.py migrate`

* Для создания суперпользователя выполнить команду

    `python manage.py createsuperuser --username=admin --email=admin@example.com`

## Запуск проекта

* Для запуска проекта выполнить команду

    `python manage.py runserver 9000`
* Для ОС Windows установить пакет `pip install  psycopg2-binary`

* В браузере открыть страницу "http://127.0.0.1:9000/ui/index.html" 

