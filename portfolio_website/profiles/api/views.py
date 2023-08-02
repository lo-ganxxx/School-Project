from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import HttpResponse, Http404, JsonResponse
from django.shortcuts import render, redirect
from django.utils.http import url_has_allowed_host_and_scheme #is_safe_url (renamed)
from django.db.models import Count

from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..models import Profile
from ..serializers import PublicProfileSerializer

ALLOWED_HOSTS = settings.ALLOWED_HOSTS
User = get_user_model()

# Create your views here.

@api_view(['GET', 'POST'])
def profile_detail_api_view(request, username, *args, **kwargs):
    #get the profile for the passed username
    qs = Profile.objects.filter(user__username=username)
    if not qs.exists():
        return Response({"detail":"User not found"}, status=404)
    profile_obj = qs.first()
    data = request.data or {} #set to the requests data or an empty dictionary if there is none set
    if request.method == "POST":
        me = request.user
        action = data.get("action") #getting the post requests action from data dictionary
        if profile_obj.user != me:
            if action == "follow":
                profile_obj.followers.add(me) #follow
            elif action == "unfollow":
                profile_obj.followers.remove(me) #unfollow
            else:
                pass
    serializer = PublicProfileSerializer(instance=profile_obj, context={"request": request}) #serialize the profiles data and passes the requests data (so the serializer knows who the request user is)
    return Response(serializer.data, status=200) #username is the username given in function argument

@api_view(['GET'])
def profile_search_api_view(request, search_query, *args, **kwargs):
    #search_query = request.GET.get("q") #the search query is set as "q" under the query parameters
    qs = Profile.objects.all() #all profile objects
    if len(search_query) > 0: #not searching for nothing
        qs= qs.filter(user__username__icontains=search_query) #the profile's user's username has the search query in it (icontains -> not caps sensitive)
    serializer = PublicProfileSerializer(qs, many=True, context={"request": request})
    return Response(serializer.data, status=200)
    #USE PAGINATED QUERYSET RESPONSE!

@api_view(['GET'])
def profile_suggestions_api_view(request, qs, *args, **kwargs):
    qs = qs.annotate(common_follower_count=Count('common_followers')).filter(
    common_follower_count__gt=0) #if common followers count is greater than 0
    serializer = PublicProfileSerializer(qs, many=True, context={"request": request})
    return Response(serializer.data, status=200)