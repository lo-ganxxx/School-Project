from rest_framework import serializers

from .models import Profile

class PublicProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.SerializerMethodField(read_only=True)
    last_name = serializers.SerializerMethodField(read_only=True)
    username = serializers.SerializerMethodField(read_only=True)
    follower_count = serializers.SerializerMethodField(read_only=True)
    following_count = serializers.SerializerMethodField(read_only=True)
    is_following = serializers.SerializerMethodField(read_only=True)
    post_count = serializers.SerializerMethodField(read_only=True)
    can_be_followed = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Profile
        fields = [
            'first_name',
            'last_name',
            'id',
            'location',
            'bio',
            'follower_count',
            'following_count',
            'is_following',
            'username',
            'post_count',
            'picture',
            'can_be_followed'
            ]
    
    def get_is_following(self, obj):
        is_following = False
        context = self.context #getting context passed to serializer
        request = context.get("request")
        if request:
            user = request.user
            is_following = user in obj.followers.all() #is the request user (logged in user) following the user whos profile is being viewed/serialized - boolean value
        return is_following
    
    def get_can_be_followed(self, obj):
        context = self.context #getting context passed to serializer
        request = context.get("request")
        if request:
            user = request.user
            if user.is_authenticated: #if user is logged in
                if user == obj.user: #if the requests user is same as the profiles user
                    return("edit")
                return("follow")
        return("login")
            
            

    def get_first_name(self, obj):
        return obj.user.first_name
    
    def get_last_name(self, obj):
        return obj.user.last_name
    
    def get_username(self, obj):
        return obj.user.username
    
    def get_follower_count(self, obj):
        return obj.followers.count()
    
    def get_following_count(self, obj):
        return obj.user.following.count()
    
    def get_post_count(self, obj):
        return obj.user.posts.count()