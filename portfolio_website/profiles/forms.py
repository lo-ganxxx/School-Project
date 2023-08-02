from django import forms
from django.contrib.auth import get_user_model

from .models import Profile

User = get_user_model()

class ProfileForm(forms.ModelForm):
    first_name = forms.CharField(required=False)
    last_name = forms.CharField(required=False)
    email_address = forms.CharField(required=False)
    class Meta:
        model = Profile
        fields = ['picture', 'location', 'bio']

class ProfileSearchForm(forms.Form):
    search_query = forms.CharField(max_length=150)