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

from posts.views import home_view, post_detail_view, post_list_view, post_create_view, post_delete_view, post_action_view

urlpatterns = [
    path('admin/', admin.site.urls),
    #path('api/', include('api.urls')),
    path('', home_view),
    path('react/', TemplateView.as_view(template_name='react.html')),
    path('posts/<int:post_id>', post_detail_view),
    path('posts', post_list_view),
    path('create', post_create_view),
    #path('api/posts/<int:post_id>/delete', post_delete_view),
    #path('api/posts/action', post_action_view),
    path('api/posts/', include('posts.urls'))
    
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)