from rest_framework import serializers
from .models import *

class TasksSerializer(serializers.ModelSerializer):
    model = Tasks
    fields = ('title', 'description', 'date', 'completed')