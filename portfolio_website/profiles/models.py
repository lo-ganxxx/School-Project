from django.conf import settings
from django.db import models
from django.db.models.signals import post_save

# Create your models here.

User = settings.AUTH_USER_MODEL

class FollowerRelation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    profile = models.ForeignKey("Profile", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE) #one user associated with one profile, one profile associated with one user
    location = models.CharField(max_length=100, null=True, blank=True)
    bio = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True) #most recent time it was saved
    followers = models.ManyToManyField(User, related_name="following", blank=True) #related name is "following" as from the followers perspective this profile is one they are folllowing i.e. user.following.all() -> all users a user follows
    

def user_did_save(sender, instance, created, *args, **kwargs):
    if created:
        Profile.objects.get_or_create(user=instance) #get profile object if it exists for that user or create it if not

post_save.connect(user_did_save, sender=User) #when a user is saved, it will trigger the receiver function (user_did_save)