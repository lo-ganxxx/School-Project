from django.conf import settings 
from django.http import HttpResponse, Http404, JsonResponse
from django.shortcuts import render, redirect
from django.utils.http import url_has_allowed_host_and_scheme #is_safe_url (renamed)

ALLOWED_HOSTS = settings.ALLOWED_HOSTS

import random #temp for likes

from .forms import PostForm
from .models import Post
# Create your views here.
def home_view(request, *args, **kwargs):
    #print(args, kwargs)
    #return HttpResponse("<h1>Hello</h1>")
    return render(request, "pages/home.html", context={}, status=200)

def create_post(request, *args, **kwargs):
    print("ajax", is_ajax(request=request))
    form = PostForm(request.POST or None) #this means that if the request is not a POST but instead a GET (e.g. loading up the page initially), it is a fallback value so that it doesnt just submit no data
    next_url = request.POST.get("next") or None #getting the next url from the POST request or just None if it was not declared
    if form.is_valid(): #if form doesnt return a ValidationError
        obj = form.save(commit=False) #creates a new Post object with the form data by calling the save() method on the form, passing in commit=False to prevent it from immediately being saved to the database
        obj.save() #saves the Post object to database
        if is_ajax(request=request):
            return JsonResponse(obj.serialize(), status=201) # 201 == created post
        if next_url != None and url_has_allowed_host_and_scheme(next_url, ALLOWED_HOSTS): #If there is a next url declared
            return redirect(next_url) #Redirect user to that url
        form = PostForm #clears the form for next submitting
    if form.errors:
        if is_ajax(request=request):
            return JsonResponse(form.errors, status=400)
    return render(request, "components/form.html", context={"form": form})

def post_list_view(request, *args, **kwargs):
    qs = Post.objects.all()
    posts_list = [x.serialize() for x in qs]
    data = {
        "isUser": False,
        "response": posts_list
    }
    return JsonResponse(data)

def post_detail_view(request, post_id, *args, **kwargs):
    data = {
        "id": post_id,
        #"image_path": obj.image.url
    }
    status = 200
    try:
        obj = Post.objects.get(id=post_id)
        data['content'] = obj.content
    except:
        data['message'] = "Not found"
        status = 404
    
    return JsonResponse(data, status=status)
    #return HttpResponse(f"<h1>Hello {post_id} - {obj.content}</h1>")

def is_ajax(request): #Had to create custom function to check as is_ajax() method was deprecated
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest' #Return boolean