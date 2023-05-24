from django.contrib import admin

# Register your models here.
from .models import Post, PostLike, PostComment

class PostLikeAdmin(admin.TabularInline):
    model = PostLike

class PostCommentAdmin(admin.TabularInline):
    model = PostComment

class PostAdmin(admin.ModelAdmin):
    inlines = [PostLikeAdmin, PostCommentAdmin]
    list_display = ['__str__', 'user', 'content']
    search_fields = ['content', 'user__username', 'user__email']
    class Meta:
        model = Post

admin.site.register(Post, PostAdmin)