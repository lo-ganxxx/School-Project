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

from ..forms import PostForm
from ..models import Post, PostComment
from ..serializers import PostSerializer, PostActionSerializer, PostCreateSerializer, CommentCreateSerializer
# Create your views here.

#these requirements for a function to run like e.g. @api_view are called decorators
@api_view(['POST']) #http method that the client has to send has to be POST
# @authentication_classes([SessionAuthentication]) #the type of authentication allowed
@permission_classes([IsAuthenticated]) #only works if request is from an authenticated user
def post_create_view(request, *args, **kwargs): #handles a POST  request to create a new Post object (if valid)
    serializer = PostCreateSerializer(data=request.data) #uses data from the POST request
    if serializer.is_valid(raise_exception=True): #if form doesnt return a ValidationError from validate_content function in PostCreateSerializer class
        serializer.save(user = request.user) #save the Post object to database with user set as the POST requests user
        return Response(serializer.data, status=201)
    return Response({}, status=400)

@api_view(['GET']) #http method that the client has to send has to be GET
def post_list_view(request, *args, **kwargs): #returns paginated queryset response of all posts or a single user's posts if set
    qs = Post.objects.all()
    username = request.GET.get('username') #username is going to pass in a parameter i.e., username=logan
    if username != None:
        qs = qs.filter(user__username__iexact=username) #filters to find only posts by that user -- iexact means its not caps sensitive
    return get_paginated_queryset_response(qs, request)

def get_paginated_queryset_response(qs, request): #custom function to use for default pagination for posts
    paginator = PageNumberPagination() #setting paginator class (so can make it so there are multiple pages for the query sets items rather than having to get all the items at once)
    paginator.page_size = 18 #each page will send back 18 items from whatever query set ends up being (18 because it is divisible by 3, so it will be even on grid view mini post pages, ie profiles)
    paginated_qs = paginator.paginate_queryset(qs, request) #paginates the query set (for page given in request query parameters)
    serializer = PostSerializer(paginated_qs, many=True, context={"request": request}) #serialize the paginated query set - needs to pass the context of the request so it knows what user is logged in (so it knows if the posts user is followed)
    return paginator.get_paginated_response(serializer.data) #return in default pagination output style (count, next, previous and results)

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def post_feed_view(request, *args, **kwargs): #returns paginated queryset response request users posts + users they follow's posts
    user = request.user #the user logged in themself
    qs = Post.objects.feed(user) #uses the function in custom model manager to filter it
    return get_paginated_queryset_response(qs, request) #much more fast and efficient than loading the whole query set at once


@api_view(['GET'])
def post_detail_view(request, post_id, *args, **kwargs): #returns serialized data about a post
    qs = Post.objects.filter(id=post_id) #Finds the post by its ID
    if not qs.exists():
        return Response({}, status=404)
    obj = qs.first()
    serializer = PostSerializer(obj)
    return Response(serializer.data, status=200)

@api_view(['DELETE', 'POST'])
@permission_classes([IsAuthenticated])
def post_delete_view(request, post_id, *args, **kwargs): #deletes a post from the database (if the post belongs to the request user)
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
def post_report_view(request, post_id, *args, **kwargs): #adds 1 to the report count of a post (if it exists) and returns the post's updated serialized data
    qs = Post.objects.filter(id=post_id)
    if not qs.exists():
        return Response({}, status=404)
    obj = qs.first()
    obj.reports += 1
    obj.save()
    serializer = PostSerializer(obj)
    return Response(serializer.data, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_action_view(request, *args, **kwargs): #handles a post request to perform actions on the Post object such as like, unlike or comment - validates the Post object exists and associates the action with the request user - returns appropriate response so that frontend can update correctly
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
            comment_serializer = CommentCreateSerializer(data={"content": content}) #uses data from the POST request
            if comment_serializer.is_valid(raise_exception=True): #if form doesnt return a ValidationError from validate_content function in CommentCreateSerializer class
                comment_serializer.save(user = request.user, post=obj) #save the Comment object to database with user set as the POST requests user and the Post object that the comment is related to set as the post the action is on
                #serializer = PostSerializer(obj)
                return Response(comment_serializer.data, status=201)
            return Response({}, status=400) #if not valid
    return Response({}, status=200)