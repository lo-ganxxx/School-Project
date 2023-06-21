from django.conf import settings
from django.db import models
from django.db.models.signals import post_save

# Create your models here.

User = settings.AUTH_USER_MODEL

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE) #one user associated with one profile, one profile associated with one user
    nickname = models.CharField(max_length=100, null=True, blank=True)
    bio = models.TextField(blank=True, null=True)

def user_did_save(sender, instance, created, *args, **kwargs):
    if created:
        Profile.objects.get_or_create(user=instance) #get profile object if it exists for that user or create it if not

post_save.connect(user_did_save, sender=User) #when a user is saved, it will trigger the receiver function (user_did_save)