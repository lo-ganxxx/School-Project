from django.conf import settings
from django.db import models
import random

User = settings.AUTH_USER_MODEL

class PostLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey("Post", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

# Create your models here.
class Post(models.Model):
    #id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE) #one user can have many posts, if user is deleted, all their posts are deleted too
    likes = models.ManyToManyField(User, related_name='post_user', blank=True, through=PostLike) #one post can have many users and many users can have many posts (in relation to likes)
    content = models.TextField(blank=True, null=True)
    image = models.FileField(upload_to="images/", blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "Post ID: " + str(self.id)
    class Meta:
        ordering = ['-id']

    def serialize(self):
        return {
            "id": self.id,
            "content": self.content,
            "likes": random.randint(0,200),
            "creator": self.user.username
        }