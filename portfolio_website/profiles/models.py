from django.conf import settings
from django.db import models

# Create your models here.
User = settings.AUTH_USER_MODEL
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE) #one user associated with one profile, one profile associated with one user
    nickname = models.CharField(max_length=100, null=True, blank=True)
    bio = models.TextField(blank=True, null=True)