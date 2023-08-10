from django.urls import path

from .views import (
    post_detail_view,
    post_list_view,
    post_feed_view,
    post_create_view,
    post_delete_view,
    post_action_view,
    post_report_view,
)

urlpatterns = [
    path('', post_list_view),
    path('feed/', post_feed_view),
    path('action/', post_action_view),
    path('create/', post_create_view),
    path('<int:post_id>/', post_detail_view),
    path('<int:post_id>/delete/', post_delete_view),
    path('<int:post_id>/report/', post_report_view)
    
]