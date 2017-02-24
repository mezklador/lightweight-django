#!/usr/bin/fish

gunicorn $argv --log-file=-
