import os

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DB'),
        'USER': os.environ.get('POSTGRES_USER'),  
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD'),  
        'HOST': os.environ.get('POSTGRES_HOST', 'localhost'),  
        'PORT': os.environ.get('POSTGRES_PORT', '5432'), 
        'OPTIONS': {
            'options': '-c search_path=public'
        }
    }
}
