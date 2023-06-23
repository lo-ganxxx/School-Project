from django.conf import settings
from django.db import models
import random

User = settings.AUTH_USER_MODEL

class PostComment(models.Model): #all me
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey("Post", on_delete=models.CASCADE, related_name="comments")
    timestamp = models.DateTimeField(auto_now_add=True)
    content = models.TextField(blank=True, null=True)

    def __str__(self):
        return "Comment '{}' by {}".format(self.content, self.user.username)
    class Meta:
        ordering = ['-id']

class PostLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey("Post", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

# Create your models here.
class Post(models.Model):
    #id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts") #one user can have many posts, if user is deleted, all their posts are deleted too
    #setting related_name means that i can easier find all posts related to a USER easier, rather than having to do i.e. user.post_set.all() to get all of a user's posts i can do user.posts.all()
    likes = models.ManyToManyField(User, related_name='post_user', blank=True, through=PostLike) #one post can have many users and many users can have many posts (in relation to likes) -- kind of as if for every like it creates a new object documenting that like and what user did it
    content = models.TextField(blank=True, null=True)
    image = models.FileField(upload_to="images/", blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    #comments = models.ManyToManyField(User, related_name="post_commented_on", blank=True, through=PostComment) #related_name field lets you access foreign keys defined in your Django models backwards - e.g. you could find all comments by doing

    def __str__(self):
        return "Post ID: " + str(self.id)
    class Meta:
        ordering = ['-id']

    # def serialize(self):
    #     return {
    #         "id": self.id,
    #         "content": self.content,
    #         "likes": self.likes.count(),
    #         "creator": self.user.username
    #     } not needed anymore