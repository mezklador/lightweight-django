from django.contrib.auth import get_user_model

from rest_framework import serializers
from rest_framework.reverse import reverse

from .models import Sprint, Task

User = get_user_model()

class SprintSerializer(serializers.ModelSerializer):

    links = serializers.SerializerMethodField()

    class Meta:
        model = Sprint
        fields = ('id', 'name', 'description', 'end', 'links',)

    def get_links(self, obj):
        request = self.context['request']
        return {
                'self': reverse('sprint-detail',
                                kwargs={'pk': obj.pk},
                                request=request),
        }


class TaskSerializer(serializers.ModelSerializer):

    """
    BUGFIX: new version of DRF needs more precisions on the SlugRelatedField
    FROM:
    http://stackoverflow.com/questions/27484344/assertion-error-at-django-rest-framework#answer-27484906
    """
    assigned = serializers.SlugRelatedField(slug_field=User.USERNAME_FIELD,
                                            required=False,
                                            queryset=User.objects.all())
    """
    BUGFIX: due to new version of DRF, no need to declare methods inside
    SerializerMethodField
    Error TraceBack was clear & precise according to this issue
    FROM: https://github.com/lightweightdjango/examples/compare/396eb56e96...bbf88e2076
    """
    status_display = serializers.SerializerMethodField()
    links = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = ('id', 'name', 'description', 'sprint', 'status',
                  'status_display', 'order', 'assigned', 'started', 
                  'due', 'completed', 'links',)

    def get_status_display(self, obj):
        return obj.get_status_display()

    def get_links(self, obj):
        request = self.context['request']

        links = {
                'self': reverse('task-detail',
                                kwargs={'pk':obj.pk},
                                request=request),
                'sprint': None,
                'assigned': None
        }
        if obj.sprint_id:
            links['sprint'] = reverse('sprint-detail',
                                      kwargs={'pk':obj.sprint_id},
                                      request=request)
        if obj.assigned:
            links['assigned'] = reverse('user-detail',
                                        kwargs={User.USERNAME_FIELD:obj.assigned},
                                        request=request)

        return links


class UserSerializer(serializers.ModelSerializer):

    full_name = serializers.CharField(source='get_full_name', read_only=True)
    links = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', User.USERNAME_FIELD, 'full_name',
                  'is_active', 'links', )

    def get_links(self, obj):
        request = self.context['request']
        username = obj.get_username()

        return {
                'self': reverse('user-detail',
                                kwargs={User.USERNAME_FIELD: username},
                                request=request)
        }
