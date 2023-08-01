"""
URL configuration for portfolio_website project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

from accounts.views import (
    login_view,
    logout_view,
    register_view,
    home_view_with_register
)

from posts.views import (
    home_view,
    posts_list_view,
    posts_detail_view,
)

urlpatterns = [
    path('', home_view),
    path('admin/', admin.site.urls),
    #path('api/', include('api.urls')),
    path('global/', posts_list_view),
    path('login/', login_view),
    path('logout/', logout_view),
    path('register/', register_view),
    path('<int:post_id>', posts_detail_view), #sets post_id argument to whatever integer is in that place in the url
    path('profile/', include('profiles.urls')),
    path('api/posts/', include('posts.api.urls')),
    path('api/profile/', include('profiles.api.urls')),
    path('newhome', home_view_with_register),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)