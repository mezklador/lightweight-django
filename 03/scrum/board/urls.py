from rest_framework.routers import DefaultRouter

from . import views

# router adaptation for Backbone.js
router = DefaultRouter(trailing_slash=False)
router.register(r'sprints', views.SprintViewSet)
router.register(r'tasks', views.TaskViewSet)
router.register(r'users', views.UserViewSet)