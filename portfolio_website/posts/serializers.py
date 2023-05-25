from django.conf import settings
from rest_framework import serializers

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
    likes = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Post
        fields = ['id', 'content', 'likes']

    def get_likes(self, obj):
        return obj.likes.count()
    
    def validate_content(self, value):
        if len(value) > MAX_POST_LENGTH:
            raise serializers.ValidationError("This post is too long")
        return value

class PostSerializer(serializers.ModelSerializer): #read only serializer
    likes = serializers.SerializerMethodField(read_only=True)
    content = serializers.SerializerMethodField(read_only=True)
    comments = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'content', 'likes', 'comments']

    def get_likes(self, obj):
        return obj.likes.count()
    
    def get_content(self, obj):
        return obj.content
    
    def get_comments(self, obj): #all me
        qs = PostComment.objects.filter(post=obj.id)
        serializer = CommentSerializer(qs, many=True)
        return serializer.data
    
class CommentSerializer(serializers.ModelSerializer): #all me
    content = serializers.SerializerMethodField

    class Meta:
        model = PostComment
        fields = ['id', 'content']

    def get_content(self, obj):
        return obj.content