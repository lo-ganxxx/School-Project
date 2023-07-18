from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import HttpResponse, Http404, JsonResponse
from django.shortcuts import render, redirect
from django.utils.http import url_has_allowed_host_and_scheme #is_safe_url (renamed)

from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..models import Profile
from ..serializers import PublicProfileSerializer

ALLOWED_HOSTS = settings.ALLOWED_HOSTS
User = get_user_model()

# Create your views here.

@api_view(['GET'])
def profile_detail_api_view(request, username, *args, **kwargs):
    #get the profile for the passed username
    qs = Profile.objects.filter(user__username=username)
    if not qs.exists():
        return Response({"detail":"User not found"}, status=404)
    profile_obj = qs.first()
    data = PublicProfileSerializer(instance=profile_obj, context={"request": request}) #serialize the profiles data and passes the requests data (so the serializer knows who the request user is)
    return Response(data.data, status=200) #username is the username given in function argument

#these requirements for a function to run like e.g. @api_view are called decorators
@api_view(['GET', 'POST']) #http method that the client has to send has to be POST or GET
@permission_classes([IsAuthenticated]) #only works if request is from an authenticated user
def user_follow_view(request, username, *args, **kwargs):
    me = request.user
    other_user_qs = User.objects.filter(username=username) #using passed in username of user to be followed/unfollowed
    if me.username == username: #if the user followings username is same as the user being followed's username (same user)
        my_followers = me.profile.followers.all()
        return Response({"count":my_followers.count()}, status=200) #dont update followers, just give response of the user's followers (you shouldn't be able to follow yourself)
    if not other_user_qs.exists():
        return Response({}, status=404)
    other = other_user_qs.first()
    profile = other.profile #profile associated with user being followed/unfollowed
    data = request.data or {} #set to the requests data or an empty dictionary if there is none set
    action = data.get("action") #getting the post requests action from data dictionary
    if action == "follow":
        profile.followers.add(me) #follow
    elif action == "unfollow":
        profile.followers.remove(me) #unfollow
    else:
        pass
    current_followers_qs = profile.followers.all()
    return Response({"count":current_followers_qs.count()}, status=200)