SHELL := /bin/bash

##################################################
# Dev docker control                             #
##################################################

docker_dev:
	docker-compose -p django_dev down
	docker-compose -p django_dev -f ./docker-compose-dev.yml build
	docker-compose -p django_dev -f ./docker-compose-dev.yml up -d

docker_dev_kill:
	docker-compose -p django_dev down
	docker-compose -p django_dev down --volumes

init_dev:
	pip install -r src/requirements-dev.txt
	pip install -r src/requirements.txt
	pre-commit install

pre-commit:
	pre-commit run --all-files

dev_admin:
	cd ${PWD}/src && python manage.py migrate && python manage.py runserver


##################################################
# Prod building                                  #
##################################################

docker_prod:
	docker-compose -p django_prod up -d --build

docker_prod_kill:
	docker-compose -p django_prod down
	docker-compose -p django_prod down --volumes