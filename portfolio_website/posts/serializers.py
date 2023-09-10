from django.conf import settings
from rest_framework import serializers
from profiles.serializers import PublicProfileSerializer
import datetime

MAX_POST_LENGTH = settings.MAX_POST_LENGTH
POST_ACTION_OPTIONS = settings.POST_ACTION_OPTIONS
from .models import Post, PostComment

class PostActionSerializer(serializers.Serializer): #serializes the POST request data for a post action
    id = serializers.IntegerField()
    action = serializers.CharField()
    content = serializers.CharField(allow_blank = True, required=False) #for if the action is a comment

    def validate_action(self, value): #validates that the action is a valid option or not
        value = value.lower().strip()
        if not value in POST_ACTION_OPTIONS:
            raise serializers.ValidationError("This is not a valid action for posts")
        return value

class PostCreateSerializer(serializers.ModelSerializer): #serializes the data for a post that has just been created with only necessary data (read only)
    user = PublicProfileSerializer(source='user.profile', read_only=True) #source is the object that it should be serializing
    likes = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Post
        fields = ['user', 'id', 'content', 'likes']

    def get_likes(self, obj): #returns the number of likes the post has (0 by default)
        return obj.likes.count()
    
    def validate_content(self, value): #validates that the content of the post is equal to or less than the max post length
        if len(value) > MAX_POST_LENGTH:
            raise serializers.ValidationError("This post is too long")
        return value

class PostSerializer(serializers.ModelSerializer): #serializes the data of a post (read only)
    user = PublicProfileSerializer(source='user.profile', read_only=True) #source is the object that it should be serializing
    likes = serializers.SerializerMethodField(read_only=True)
    content = serializers.SerializerMethodField(read_only=True)
    comments = serializers.SerializerMethodField(read_only=True)
    comment_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Post
        fields = [
                'user',
                'id',
                'content',
                'likes',
                'comments',
                'timestamp',
                'comment_count'
                ]

    def get_likes(self, obj): #returns the number of likes the post has 
        return obj.likes.count()
    
    def get_content(self, obj): #returns the content of the post
        return obj.content
    
    def get_comments(self, obj): #returns the comments associated with the post
        qs = PostComment.objects.filter(post=obj.id)
        serializer = CommentSerializer(qs, many=True)
        return serializer.data
    
    def get_comment_count(self, obj): #returns the number of comments the post has
        return obj.comments.count()
    
class CommentSerializer(serializers.ModelSerializer): #serializes the data of a comment (read only)
    user = PublicProfileSerializer(source='user.profile', read_only=True) #source is the object that it should be serializing
    content = serializers.SerializerMethodField(read_only=True)
    post = serializers.SerializerMethodField(read_only=True)
    timestamp = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PostComment
        fields = ['user', 'id', 'content', 'post', 'timestamp']

    def get_content(self, obj): #returns the content of the comment
        return obj.content
    
    def get_post(self, obj): #returns the id of the post the comment is associated with
        return obj.post.id
    
    def get_timestamp(self, obj): #returns the timestamp of when the comment was created
        #hour(12-hour clock):minute AM or PM, day/month/year
        return obj.timestamp.strftime("%I:%M%p, %d/%m/%Y") #formatting DateTimeField data to be readable as a string - timezone is set in settings.py
    
class CommentCreateSerializer(serializers.ModelSerializer): #serializes the data for a comment that has just been created with only necessary data (read only)
    user = PublicProfileSerializer(source='user.profile', read_only=True) #source is the object that it should be serializing
    post = serializers.SerializerMethodField(read_only=True)
    timestamp = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PostComment
        fields = ['user', 'id', 'content', 'post', 'timestamp'] #using content as a regular field allows it to be writable for when creating comment
    
    def get_post(self, obj): #returns the id of the post the comment is associated with
        return obj.post.id
    
    def get_timestamp(self, obj): #returns temporary timestamp to be rendered on frontend (because newly created comment)
        return "Now" #when new comment rendered on frontend it will simply display time of creation as "Now"
    
    def validate_content(self, value): #validates that the content of the comment is equal to or less than the max post length
        #make a validators.py later possibly, to keep code DRY
        if len(value) > MAX_POST_LENGTH:
            raise serializers.ValidationError("This comment is too long")
        return value