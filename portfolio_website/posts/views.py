from django.conf import settings 
from django.http import HttpResponse, Http404, JsonResponse
from django.shortcuts import render, redirect
from django.utils.http import url_has_allowed_host_and_scheme #is_safe_url (renamed)

ALLOWED_HOSTS = settings.ALLOWED_HOSTS

# local views
def home_view(request, *args, **kwargs): #home page
    return render(request, "pages/feed.html")

def posts_list_view(request, *args, **kwargs): #global posts page
    return render(request, "posts/lists.html")

def posts_detail_view(request, post_id, *args, **kwargs): #post detail page
    return render(request, "posts/detail.html", context={"post_id": post_id})