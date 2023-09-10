from django.conf import settings
from django import forms

from .models import Post

MAX_POST_LENGTH = settings.MAX_POST_LENGTH

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['content']
    
    def clean_content(self): #returns content if it is less than or equal to max post length, otherwise raises validation error
        content = self.cleaned_data.get("content")
        if len(content) > MAX_POST_LENGTH:
            raise forms.ValidationError("This post is too long")
        return content
