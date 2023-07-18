from django.conf import settings 
from django.http import HttpResponse, Http404, JsonResponse
from django.shortcuts import render, redirect
from django.utils.http import url_has_allowed_host_and_scheme #is_safe_url (renamed)

from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

ALLOWED_HOSTS = settings.ALLOWED_HOSTS

import random #temp for likes

from ..forms import PostForm
from ..models import Post, PostComment
from ..serializers import PostSerializer, PostActionSerializer, PostCreateSerializer
# Create your views here.

#these requirements for a function to run like e.g. @api_view are called decorators
@api_view(['POST']) #http method that the client has to send has to be POST
# @authentication_classes([SessionAuthentication]) #the type of authentication allowed
@permission_classes([IsAuthenticated]) #only works if request is from an authenticated user
def post_create_view(request, *args, **kwargs):
    serializer = PostCreateSerializer(data=request.data) #uses data from the POST request
    if serializer.is_valid(raise_exception=True): #if form doesnt return a ValidationError from validate_content function in PostCreateSerializer class
        serializer.save(user = request.user) #save the Post object to database with user set as the POST requests user
        return Response(serializer.data, status=201)
    return Response({}, status=400)

@api_view(['GET']) #http method that the client has to send has to be GET
def post_list_view(request, *args, **kwargs):
    qs = Post.objects.all()
    username = request.GET.get('username') #username is going to pass in a parameter i.e., username=logan
    if username != None:
        qs = qs.filter(user__username__iexact=username) #filters to find only posts by that user -- iexact means its not caps sensitive
    return get_paginated_queryset_response(qs, request)

def get_paginated_queryset_response(qs, request): #custom function to use for default pagination for posts
    paginator = PageNumberPagination() #setting paginator class (so can make it so there are multiple pages for the query sets items rather than having to get all the items at once)
    paginator.page_size = 20 #each page will send back 20 items from whatever query set ends up being
    paginated_qs = paginator.paginate_queryset(qs, request) #paginates the query set
    serializer = PostSerializer(paginated_qs, many=True, context={"request": request}) #serialize the paginated query set - needs to pass the context of the request so it knows what user is logged in (so it knows if the posts user is followed)
    return paginator.get_paginated_response(serializer.data) #return in default pagination output style (count, next, previous and results)

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def post_feed_view(request, *args, **kwargs): #users posts + users they follow's posts
    user = request.user #the user logged in themself
    qs = Post.objects.feed(user) #uses the function in custom model manager to filter it
    return get_paginated_queryset_response(qs, request) #much more fast and efficient than loading the whole query set at once
    #Response(serializer.data, status=200)


@api_view(['GET'])
def post_detail_view(request, post_id, *args, **kwargs):
    qs = Post.objects.filter(id=post_id) #Finds the post by its ID
    if not qs.exists():
        return Response({}, status=404)
    obj = qs.first()
    serializer = PostSerializer(obj)
    return Response(serializer.data, status=200)

@api_view(['DELETE', 'POST'])
@permission_classes([IsAuthenticated])
def post_delete_view(request, post_id, *args, **kwargs):
    qs = Post.objects.filter(id=post_id) #Finds the post by its ID
    if not qs.exists():
        return Response({}, status=404)
    qs = qs.filter(user=request.user)
    if not qs.exists():
        return Response({"message": "You cannot delete this post"}, status=401)
    obj = qs.first()
    obj.delete()
    return Response({"message": "Post removed"}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_action_view(request, *args, **kwargs):
    '''
    id is required.
    Action options are: like, unlike -> these actions are seperate and not toggled to prevent accidental unliking/reliking if lag on frontend
    '''
    serializer = PostActionSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        data = serializer.validated_data
        post_id = data.get("id")
        action = data.get("action")
        content = data.get("content")
        qs = Post.objects.filter(id=post_id) #Finds the post by its ID
        if not qs.exists():
            return Response({}, status=404)
        obj = qs.first()
        if action == "like":
            obj.likes.add(request.user) #adds a like from the user making the request
            serializer = PostSerializer(obj)
            return Response(serializer.data, status=200)
        elif action == "unlike":
            obj.likes.remove(request.user)
            serializer = PostSerializer(obj)
            return Response(serializer.data, status=200)
        elif action == "comment": #need to make a way to type stuff
            new_comment = PostComment.objects.create(
                user=request.user,
                post=obj,
                content=content
            )
            print(obj.comments.all())
            serializer = PostSerializer(obj)
            return Response(serializer.data, status=201)
    return Response({}, status=200)

def create_post_pure_django(request, *args, **kwargs):
    user = request.user
    if not request.user.is_authenticated: #Anonymous user
        user = None
        if is_ajax(request=request):
            return JsonResponse({}, status=401)
        return redirect(settings.LOGIN_URL)
    form = PostForm(request.POST or None) #this means that if the request is not a POST but instead a GET (e.g. loading up the page initially), it is a fallback value so that it doesnt just submit no data
    next_url = request.POST.get("next") or None #getting the next url from the POST request or just None if it was not declared
    if form.is_valid(): #if form doesnt return a ValidationError
        obj = form.save(commit=False) #creates a new Post object with the form data by calling the save() method on the form, passing in commit=False to prevent it from immediately being saved to the database
        obj.user = user
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

def post_list_view_pure_django(request, *args, **kwargs):
    qs = Post.objects.all()
    posts_list = [x.serialize() for x in qs]
    data = {
        "isUser": False,
        "response": posts_list
    }
    return JsonResponse(data)

def post_detail_view_pure_django(request, post_id, *args, **kwargs):
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