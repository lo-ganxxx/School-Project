from django.conf import settings
from django.db import models
from django.db.models import Q

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
class PostQuerySet(models.QuerySet):
    def feed(self, user):
        profiles_exist = user.following.exists #does the user have any instances of following anyone
        followed_users_id = []
        if profiles_exist(): #if the user follows anyone
            followed_users_id = user.following.values_list("user__id", flat=True) #list of all the values of the users being followed's ids - flat=True means that the returned results are all single values
        pass #also appends the id of the user logged in themself
        return self.filter( #Model.objects
            Q(user__id__in=followed_users_id) | #using __in allows us to look inside of a list and then get all posts that are equal to an id in that list
            Q(user=user) #the pipe means or, so it will get both posts by followed users and the user logged in themself
            ).distinct().order_by("-timestamp") #the query set is ordered by what is most recent (newest first)

class PostManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        return PostQuerySet(self.model, using=self._db)

    def feed(self, user):
        return self.get_queryset().feed(user) #calls the PostQuerySet feed function itself

class Post(models.Model):
    #id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts") #one user can have many posts, if user is deleted, all their posts are deleted too
    #setting related_name means that i can easier find all posts related to a USER easier, rather than having to do i.e. user.post_set.all() to get all of a user's posts i can do user.posts.all()
    likes = models.ManyToManyField(User, related_name='post_user', blank=True, through=PostLike) #one post can have many users and many users can have many posts (in relation to likes) -- kind of as if for every like it creates a new object documenting that like and what user did it
    content = models.TextField(blank=True, null=True)
    image = models.FileField(upload_to="images/", blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    #comments = models.ManyToManyField(User, related_name="post_commented_on", blank=True, through=PostComment) #related_name field lets you access foreign keys defined in your Django models backwards - e.g. you could find all comments by doing

    objects = PostManager() #extends default model manager

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