from django.http import Http404
from django.shortcuts import render, redirect

from .forms import ProfileForm
from .models import Profile

def profile_update_view(request, *args, **kwargs): #handles updating a user's profile information - validates and saves changes to both the user model and associated profile model (if any made) and renders the form to edit the profile data
    if not request.user.is_authenticated: #not logged in
        return redirect("/login?next=/profile/edit") #redirect to login page and set argument for next
    user = request.user
    user_data = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email_address": user.email
    }
    my_profile = user.profile #one to one field so i can do this
    form = ProfileForm(request.POST or None, request.FILES or None, instance=my_profile, initial=user_data) #instance is what object the form is updating (also fillows input boxes with current values on the object), initial sets the initial values of the input boxes to what is set in user_data dictionary
    description = None
    if form.is_valid():
        profile_obj = form.save(commit=False)
        first_name = form.cleaned_data.get('first_name')
        last_name = form.cleaned_data.get('last_name')
        email_address = form.cleaned_data.get('email_address')
        user.first_name = first_name
        user.last_name = last_name
        user.email = email_address
        user.save() #done this way in order to save 2 models in 1 form and 1 view
        profile_obj.save()
        description = "Profile saved successfully!"
    else:
        print(form.errors)
    context = {
        "form": form,
        "btn_label": "Save",
        "title": "Update Profile",
        "description": description
    }
    return render(request, "profiles/form.html", context)

def profile_detail_view(request, username, *args, **kwargs): #renders the user profile page with follower status for a specified username
    #get the profile for the passed username
    qs = Profile.objects.filter(user__username=username)
    if not qs.exists():
        raise Http404
    profile_obj = qs.first()
    is_following = False
    if request.user.is_authenticated: #if the requests user is logged in to an account
        is_following = request.user in profile_obj.followers.all() #is the logged in user following the user whos profile is being viewed - boolean value
    context = {
        "username": username,
        "profile": profile_obj,
        "is_following": is_following
        }
    return render(request, "profiles/detail.html", context) #username is the username given in function argument

def profile_search_view(request, query, *args, **kwargs): #renders the search results for a specific query
    return render(request, "profiles/search_results.html", context={"query": query})

def profile_popular_view(request, *args, **kwargs): #renders the popular profiles page
    return render(request, "profiles/search_results.html")