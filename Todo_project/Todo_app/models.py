from django.db import models
import django
import datetime

# Create your models here.
class Tasks(models.Model):
    title = models.TextField(max_length=50)
    description = models.TextField(max_length=500, blank=True)
    date = models.DateField(default= django.utils.timezone.now)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class List(models.Model):  
    title = models.TextField(max_length=50)

    def __str__(self):
        return self.title

class ListTasks(models.Model):
    description = models.TextField(max_length=100)
    competed = models.BooleanField(default=False)
    tasks = models.ForeignKey(List, on_delete = models.CASCADE)

    def __str__(self):
        return self.description


    