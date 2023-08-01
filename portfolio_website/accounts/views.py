from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm

#function based views (current) -> class based views -> more DRY but much more COMPLEX!

# Create your views here.
def login_view(request, *args, **kwargs):
    form = AuthenticationForm(request, data=request.POST or None)
    next_url = request.GET.get('next' or None) #if a next url was set in the query parameters (i.e. /login?next=profile/logan)
    if form.is_valid(): #logs in successfully
        user_ = form.get_user()
        login(request, user_)
        if next_url:
            return redirect(next_url) #redirects to url set in query parameters
        else:
            return redirect("/") #redirects to home page
    context = {
        "form": form,
        "description": "Don't have an account?",
        "link_display": "Register",
        "link_url": "register",
        "btn_label": "Sign in",
        "title": "Sign in"
    }
    return render(request, "accounts/auth.html", context)

def logout_view(request, *args, **kwargs):
    if request.method == "POST":
        logout(request)
        return redirect("/login")
    context = {
        "form": None, #no form, just the button to logout (no input needed)
        "description": "Are you sure you want to logout?",
        "btn_label": "Click to confirm",
        "title": "Logout"
    }
    return render(request, "accounts/auth.html", context) #if not POST method, render the logout page

def register_view(request, *args, **kwargs):
    form = UserCreationForm(request.POST or None)
    if form.is_valid():
        user = form.save(commit=True) #saves the user to the database
        user.set_password(form.cleaned_data.get("password1")) #sets password (encrytped)
        #send a confirmation email to verify their account??? could add later.
        new_user = authenticate(username=form.cleaned_data['username'],
                                password=form.cleaned_data['password1']) #authenticates that credentials are correct
        login(request, new_user) #logs them into account they just created
        return redirect("/")

    context = {
        "form": form,
        "description": "Create an account to start posting today!",
        "btn_label": "Register",
        "title": "Register"
    }
    if request.path == '/register/': #if its the register page
        return render(request, "accounts/auth.html", context)
    else: #if its just the home page (which has register form on it)
        return render(request, "pages/feed.html", context)