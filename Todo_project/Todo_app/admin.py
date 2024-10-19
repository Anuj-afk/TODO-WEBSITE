from django.contrib import admin
from .models import Tasks, ListTasks, List

class TaskAdmin(admin.ModelAdmin):
    fields = ["title", "description", "date", "completed"]

class TaskListInline(admin.StackedInline):
    model = ListTasks

class ListAdmin(admin.ModelAdmin):
    fields = ["title"]
    inlines = [TaskListInline]

admin.site.register(List, ListAdmin)
admin.site.register(Tasks, TaskAdmin)
# Register your models here.
