from django.shortcuts import render
import json.scanner
from .models import Tasks, ListTasks, List
from django.core import serializers 
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
import datetime


# Create your views here.


format = "%Y/%m/%d"     
@csrf_exempt
def get_task(request):
    try:
        body = json.loads(request.body)
        try:
            dateVal = datetime.datetime.strptime(body['date'], '%d-%m-%Y').strftime(format)
            dateVal = datetime.datetime.strptime(dateVal, format) 
        except Exception as e:
            dateVal = body['date']
        tasks = Tasks.objects.filter(date = dateVal, completed = False)
        tasks_data = json.loads(serializers.serialize('json', tasks))
        fields = []
        for i in range(0,len(tasks_data)):
            tasks_data[i]['fields']['id'] = tasks_data[i]['pk']
            fields.append(tasks_data[i]['fields'])
        data = {"completed": True, "tasks": fields}
    except Exception as e:
        data = {"completed": False, "error": str(e)}
    
    return JsonResponse(data)


@csrf_exempt
def add_task(request):
    try:
        body = json.loads(request.body)
        try:
            dateVal = datetime.datetime.strptime(body['date'], '%m/%d/%Y').strftime(format)
            dateVal = datetime.datetime.strptime(dateVal, format) 
        except Exception as e:
            dateVal = body['date']
        new_task = Tasks.objects.create(title = body['title'], date = dateVal, description = body["description"] if body["description"] != None else "", completed = body['completed'])
        data = {"added": True, "id": new_task.id}
    except Exception as e:
        data = {"added": False, "error": str(e)}
    
    return JsonResponse(data)

@csrf_exempt
def edit_task(request):

    try:
        body = json.loads(request.body)
        tasks = Tasks.objects.get(id = body['index'])
        tasks.title = body['title']
        tasks.save()
        data = {"edited": True}
    except Exception as e:
        data = {"edited": False, "error": str(e)}
        
    return JsonResponse(data)

@csrf_exempt
def delete_task(request):
    try:
        body = json.loads(request.body)
        Tasks.objects.filter(id = body['index']).delete()
        data = {"deleted": True}
    except Exception as e:
        data = {"deleted": False, "error": str(e)}
    
    return JsonResponse(data)

@csrf_exempt
def get_task_today(request):
    try:
        currdate = datetime.datetime.today();
        tasks = Tasks.objects.filter(date = currdate, completed = False)
        tasks_data = json.loads(serializers.serialize('json', tasks))
        fields = []
        for i in range(0,len(tasks_data)):
            tasks_data[i]['fields']['id'] = tasks_data[i]['pk']
            fields.append(tasks_data[i]['fields'])
        data = {"completed": True, "tasks": fields}
    except Exception as e:
        data = {"completed": False, "error": str(e)}
    return JsonResponse(data)

@csrf_exempt
def completed_task (request):
    try:
        body = json.loads(request.body)
        tasks = Tasks.objects.get(id = body['index'])
        tasks.completed = not tasks.completed
        tasks.save()
        data = {"completed": True}
    except Exception as e:
        data = {"completed": False, "error": str(e)}
    return JsonResponse(data)

@csrf_exempt
def get_completed_task(request):
    try:
        body = json.loads(request.body)
        try:
            dateVal = datetime.datetime.strptime(body['date'], '%d-%m-%Y').strftime(format)
            dateVal = datetime.datetime.strptime(dateVal, format) 
        except Exception as e:
            print(e)
            dateVal = body['date']
        tasks = Tasks.objects.filter(date = dateVal, completed = True)
        tasks_data = json.loads(serializers.serialize('json', tasks))
        fields = []
        for i in range(0,len(tasks_data)):
            tasks_data[i]['fields']['id'] = tasks_data[i]['pk']
            fields.append(tasks_data[i]['fields'])
        data = {"completed": True, "tasks": fields}
    except Exception as e:
        data = {"completed": False, "error": str(e)}
    
    return JsonResponse(data)

@csrf_exempt
def get_uncompleted_task(request):
    try:
        body = json.loads(request.body)
        try:
            dateVal = datetime.datetime.strptime(body['date'], '%d-%m-%Y').strftime(format)
            dateVal = datetime.datetime.strptime(dateVal, format) 
        except Exception as e:
            print(e)
            dateVal = body['date']
        tasks = Tasks.objects.filter(date = dateVal, completed = False)
        tasks_data = json.loads(serializers.serialize('json', tasks))
        fields = []
        for i in range(0,len(tasks_data)):
            tasks_data[i]['fields']['id'] = tasks_data[i]['pk']
            fields.append(tasks_data[i]['fields'])
        data = {"completed": True, "tasks": fields}
    except Exception as e:
        data = {"completed": False, "error": str(e)}
    
    return JsonResponse(data)

@csrf_exempt
def add_list(request):
    try:
        List.objects.create(title = "New List")
        data = {"added": True}
    except Exception as e:
        data = {"added": False, "error": str(e)}
    
    return JsonResponse(data)

@csrf_exempt
def get_lists(request):
    try:
        lists = List.objects.all()
        list_data = json.loads(serializers.serialize('json', lists))
        fields = []
        for i in range(0,len(list_data)):
            list_data[i]['fields']['id'] = list_data[i]['pk']
            fields.append(list_data[i]['fields'])
        data = {"completed": True, "tasks": fields}
    except Exception as e:
        data = {"completed": False, "error": str(e)}
    return JsonResponse(data)

@csrf_exempt
def edit_list_title(request):
    try:
        body = json.loads(request.body)
        lists = List.objects.get(id = body['index'])
        lists.title = body['title']
        lists.save()
        data = {"edited": True}
    except Exception as e:
        data = {"edited": False, "error": str(e)}
    return JsonResponse(data)

@csrf_exempt
def delete_list(request):
    try:
        body = json.loads(request.body)
        List.objects.filter(id = body['index']).delete()
        data = {"deleted": True}
    except Exception as e:
        print(e)
        data = {"deleted": False, "error": str(e)}
    return JsonResponse(data)

@csrf_exempt
def add_task_to_list(request):
    try:
        body = json.loads(request.body)
        print(body["id"])
        addlist = List.objects.get(id = body['id'])
        list_tasks = ListTasks.objects.create(description = body["desc"], competed = False, tasks = addlist)
        data = {"added": True}
    except Exception as e:
        data = {"added": False, "error": str(e)}
    return JsonResponse(data)


@csrf_exempt
def get_task_list(request):
    try:
        list_tasks =   ListTasks.objects.all()
        tasks_data = json.loads(serializers.serialize('json', list_tasks))
        fields = []
        for i in range(0,len(tasks_data)):
            tasks_data[i]['fields']['id'] = tasks_data[i]['pk']
            fields.append(tasks_data[i]['fields'])
        print(fields)
        data = {"completed": True, "tasks": fields}
    except Exception as e:
        data = {"completed": False, "error": str(e)}
    return JsonResponse(data)

@csrf_exempt
def delete_task_from_list(request):
    try:
        body = json.loads(request.body)
        ListTasks.objects.filter(id = body['index']).delete()
        data = {"deleted": True}
    except Exception as e:
        data = {"deleted": False, "error": str(e)}
    return JsonResponse(data)

@csrf_exempt
def update_task_in_list(request):
    try:
        body = json.loads(request.body)
        list_tasks = ListTasks.objects.get(id = body['index'])
        list_tasks.description = body['desc']
        list_tasks.competed = body['completed']
        list_tasks.save()
        data = {"updated": True}
    except Exception as e:
        data = {"updated": False, "error": str(e)}
    return JsonResponse(data)

@csrf_exempt
def completed_list_task (request):
    try:
        body = json.loads(request.body)
        tasks = ListTasks.objects.get(id = body['index'])
        tasks.competed = not tasks.competed
        tasks.save()
        data = {"completed": True}
    except Exception as e:
        data = {"completed": False, "error": str(e)}
    return JsonResponse(data)