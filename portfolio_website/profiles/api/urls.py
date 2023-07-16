from django.urls import path

from .views import (
    user_follow_view,
    profile_detail_view,
)

urlpatterns = [
    path('<str:username>/follow', user_follow_view),
    path('<str:username>/', profile_detail_view),
    
]