from django.http import HttpResponse, Http404, JsonResponse
from django.shortcuts import render

import random #temp for likes

from .forms import PostForm
from .models import Post
# Create your views here.
def home_view(request, *args, **kwargs):
    #print(args, kwargs)
    #return HttpResponse("<h1>Hello</h1>")
    return render(request, "pages/home.html", context={}, status=200)

def create_post(request, *args, **kwargs):
    form = PostForm(request.POST or None) #this means that if the request is not a POST but instead a GET (e.g. loading up the page initially), it is a fallback value so that it doesnt just submit no data
    if form.is_valid(): #if form doesnt return a ValidationError
        obj = form.save(commit=False) #creates a new Post object with the form data by calling the save() method on the form, passing in commit=False to prevent it from immediately being saved to the database
        obj.save() #saves the Post object to database
        form = PostForm #clears the form for next submitting
    return render(request, "components/form.html", context={"form": form})

def post_list_view(request, *args, **kwargs):
    qs = Post.objects.all()
    posts_list = [{"id": x.id, "content": x.content, "likes": random.randint(0,1000)} for x in qs]
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