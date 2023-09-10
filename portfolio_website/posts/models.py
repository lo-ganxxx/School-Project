from django.conf import settings
from django.db import models
from django.db.models import Q

User = settings.AUTH_USER_MODEL

class PostComment(models.Model): #model for comment on post
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey("Post", on_delete=models.CASCADE, related_name="comments")
    timestamp = models.DateTimeField(auto_now_add=True)
    content = models.TextField(blank=False, null=False)

    def __str__(self): #returns string representation of the post comment object
        return f"Comment {self.content} by {self.user.username}" #using f string rather than .format
    class Meta:
        ordering = ['-id'] #ordered from greatest id to least (high number to low) so it is most recent first

class PostLike(models.Model): #model for like on post
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey("Post", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

# Create your models here.
class PostQuerySet(models.QuerySet):
    def feed(self, user): #custom queryset method for retrieving post feed for a specific user. users posts + users they follow's posts (in order of most recent)
        profiles_exist = user.following.exists #does the user have any instances of following anyone
        followed_users_id = []
        if profiles_exist(): #if the user follows anyone
            followed_users_id = user.following.values_list("user__id", flat=True) #list of all the values of the users being followed's ids - flat=True means that the returned results are all single values
        pass #also appends the id of the user logged in themself
        return self.filter( #Model.objects
            Q(user__id__in=followed_users_id) | #using __in allows us to look inside of a list and then get all posts that are equal to an id in that list
            Q(user=user) #the pipe means or, so it will get both posts by followed users and the user logged in themself
            ).distinct().order_by("-timestamp") #the query set is ordered by what is most recent (newest first)

class PostManager(models.Manager): #custom manager for the Post model that provides a method to retrieve a feed of posts for a specific user
    def get_queryset(self, *args, **kwargs): #override the default manager's get_queryset method and return a custom queryset instance PostQuerySet
        return PostQuerySet(self.model, using=self._db)

    def feed(self, user): #call the feed function on the custom queryset instance returned by get_queryset()
        return self.get_queryset().feed(user) #used to retrieve post feed for a specific user

class Post(models.Model): #model for post
    #id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts") #one user can have many posts, if user is deleted, all their posts are deleted too
    #setting related_name means that i can easier find all posts related to a USER easier, rather than having to do i.e. user.post_set.all() to get all of a user's posts i can do user.posts.all()
    likes = models.ManyToManyField(User, related_name='post_user', blank=True, through=PostLike) #one post can have many users and many users can have many posts (in relation to likes) -- kind of as if for every like it creates a new object documenting that like and what user did it
    content = models.TextField(blank=True, null=True)
    image = models.FileField(upload_to="post_pics/", blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    reports = models.IntegerField(default=0) #how many times has the post been reported

    objects = PostManager() #extends default model manager

    def __str__(self): #returns string representation of the post object
        return "Post ID: " + str(self.id)
    class Meta:
        ordering = ['-id'] #ordered from greatest id to least (high number to low) so it is most recent first