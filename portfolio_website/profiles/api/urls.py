from django.urls import path

from .views import (
    profile_detail_api_view,
    profile_search_api_view
)

urlpatterns = [
    path('<str:username>/follow', profile_detail_api_view),
    path('<str:username>/', profile_detail_api_view),
    path('search/<str:search_query>/', profile_search_api_view)
    
]