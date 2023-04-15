from django.http import HttpResponse
from django.shortcuts import render

from .models import Post
# Create your views here.
def home_view(request, *args, **kwargs):
    print(args, kwargs)
    return HttpResponse("<h1>Hello</h1>")

def post_detail_view(request, post_id, *args, **kwargs):
    try:
        obj = Post.objects.get(id=post_id)
    except:
        print("error")
    return HttpResponse(f"<h1>Hello {post_id} - {obj.content} </h1>")