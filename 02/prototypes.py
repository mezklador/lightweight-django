import os
import sys

from django.conf import settings

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

settings.configure(
    DEBUG=True,
    SECRET_KEY='wxcn,cbwxcbjfhufz/456dqy,duqid789',
    ROOT_URLCONF='sitebuilder.urls',
    MIDDLEWARE_CLASSES=(),
    INSTALLED_APPS=(
        'django.contrib.staticfiles',
        # 'django.contrib.webdesign',
        'sitebuilder',
        'compressor',
    ),
    STATICFILES_DIRS = [
        os.path.join(BASE_DIR, 'sitebuilder', 'static'),
    ],
    STATIC_URL='/static/',
    TEMPLATES = [
        {
            'BACKEND': 'django.template.backends.django.DjangoTemplates',
            'DIRS': [
                os.path.join(BASE_DIR, 'sitebuilder', 'templates'),
            ],
        },

    ],
    SITE_PAGES_DIRECTORY=os.path.join(BASE_DIR, 'pages'),
    SITE_OUTPUT_DIRECTORY=os.path.join(BASE_DIR, '_build'),
    STATIC_ROOT=os.path.join(BASE_DIR, '_build', 'static'),
    STATICFILES_STORAGE='django.contrib.staticfiles.storage.CachedStaticFilesStorage',
    STATICFILES_FINDERS=(
        'django.contrib.staticfiles.finders.FileSystemFinder',
        'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    ),
)

if __name__ == '__main__':
    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
