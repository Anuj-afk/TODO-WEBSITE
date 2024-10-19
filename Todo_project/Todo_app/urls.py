from . import views
from django.urls import path

urlpatterns = [
    path(route='getTask', view=views.get_task, name="getTask"),    
    path(route='addTask', view=views.add_task, name="addTask"),  
    path(route='editTask', view=views.edit_task, name="editTask"),
    path(route='delTask', view=views.delete_task, name="delTask"),
    path(route='getTaskToday', view=views.get_task_today, name="getTaskToday"),
    path(route="completeTask", view=views.completed_task, name="completeTask"),
    path(route='getCompletedTask', view=views.get_completed_task, name="getCompletedTask"),
    path(route='getUncompletedTask', view=views.get_uncompleted_task, name="UncompletedTask"),
    path(route='addList', view=views.add_list, name="addList"), 
    path(route='getList', view=views.get_lists, name="getList"), 
    path(route = "editTitle", view=views.edit_list_title, name="editTitle"),
    path(route = "deleteList", view=views.delete_list, name="deleteList"),
    path(route = "getListTask", view=views.get_task_list, name="getListTask"),
    path(route='addTaskList', view=views.add_task_to_list, name="addTaskList"),
    path(route = "deleteTaskList", view=views.delete_task_from_list, name="deleteTaskList"),
    path(route = "editTaskList", view=views.update_task_in_list, name="editTaskListTask"),
    path(route = "completeTaskList", view=views.completed_list_task, name="completeTaskList"),
]