from django.conf import settings
from rest_framework import serializers
from profiles.serializers import PublicProfileSerializer
import datetime

MAX_POST_LENGTH = settings.MAX_POST_LENGTH
POST_ACTION_OPTIONS = settings.POST_ACTION_OPTIONS
from .models import Post, PostComment

class PostActionSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    action = serializers.CharField()
    content = serializers.CharField(allow_blank = True, required=False) #for if the action is a comment

    def validate_action(self, value):
        value = value.lower().strip()
        if not value in POST_ACTION_OPTIONS:
            raise serializers.ValidationError("This is not a valid action for posts")
        return value

class PostCreateSerializer(serializers.ModelSerializer): #create only serializer
    user = PublicProfileSerializer(source='user.profile', read_only=True) #source is the object that it should be serializing
    likes = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Post
        fields = ['user', 'id', 'content', 'likes']

    def get_likes(self, obj):
        return obj.likes.count()
    
    def validate_content(self, value):
        if len(value) > MAX_POST_LENGTH:
            raise serializers.ValidationError("This post is too long")
        return value

class PostSerializer(serializers.ModelSerializer): #read only serializer
    user = PublicProfileSerializer(source='user.profile', read_only=True) #source is the object that it should be serializing
    likes = serializers.SerializerMethodField(read_only=True)
    content = serializers.SerializerMethodField(read_only=True)
    comments = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Post
        fields = [
                'user',
                'id',
                'content',
                'likes',
                'comments',
                'timestamp'
                ]

    def get_likes(self, obj):
        return obj.likes.count()
    
    def get_content(self, obj):
        return obj.content
    
    def get_comments(self, obj): #all me
        qs = PostComment.objects.filter(post=obj.id)
        serializer = CommentSerializer(qs, many=True)
        return serializer.data
    
class CommentSerializer(serializers.ModelSerializer): #all me
    user = PublicProfileSerializer(source='user.profile', read_only=True) #source is the object that it should be serializing
    content = serializers.SerializerMethodField()
    post = serializers.SerializerMethodField()
    timestamp = serializers.SerializerMethodField()

    class Meta:
        model = PostComment
        fields = ['user', 'id', 'content', 'post', 'timestamp']

    def get_content(self, obj):
        return obj.content
    
    def get_post(self, obj):
        return obj.post.id
    
    def get_timestamp(self, obj):
        #hour(12-hour clock):minute AM or PM, day/month/year
        return obj.timestamp.strftime("%I:%M%p, %d/%m/%Y") #formatting DateTimeField data to be readable as a string - timezone is set in settings.py
    
class CommentCreateSerializer(serializers.ModelSerializer):
    user = PublicProfileSerializer(source='user.profile', read_only=True) #source is the object that it should be serializing
    post = serializers.SerializerMethodField()
    timestamp = serializers.SerializerMethodField()

    class Meta:
        model = PostComment
        fields = ['user', 'id', 'content', 'post', 'timestamp'] #using content as a regular field allows it to be writable for when creating comment
    
    def get_post(self, obj):
        return obj.post.id
    
    def get_timestamp(self, obj):
        return "Now" #when new comment rendered on frontend it will simply display time of creation as "Now"
    
    def validate_content(self, value): #make a validators.py later possibly, to keep code DRY
        if len(value) > MAX_POST_LENGTH:
            raise serializers.ValidationError("This comment is too long")
        return value