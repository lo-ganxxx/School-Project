from django import forms
from django.contrib.auth import get_user_model

from .models import Profile

User = get_user_model()

class ProfileForm(forms.ModelForm): #form for updating profile information
    first_name = forms.CharField(required=False)
    last_name = forms.CharField(required=False)
    email_address = forms.CharField(required=False)
    class Meta:
        model = Profile
        fields = ['picture', 'location', 'bio', 'qualification', 'instagram_username']

class ProfileSearchForm(forms.Form): #form for searching for profile
    search_query = forms.CharField(max_length=150)