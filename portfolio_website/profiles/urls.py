from django.urls import path

from .views import profile_detail_view, profile_update_view, profile_search_view, profile_popular_view

urlpatterns = [
    path('edit', profile_update_view), #blacklisted username 'edit' to avoid errors
    path('popular/', profile_popular_view), #blacklisted
    path('<str:username>', profile_detail_view), #sets username argument to whatever string is in that place in the url
    path('search/<str:query>', profile_search_view)
]