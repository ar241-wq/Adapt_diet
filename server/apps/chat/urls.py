from django.urls import path
from . import views

urlpatterns = [
    # Public endpoints
    path('session/', views.create_or_get_session, name='chat-session'),
    path('session/<uuid:session_id>/messages/', views.get_session_messages, name='chat-messages'),

    # Admin endpoints
    path('admin/sessions/', views.admin_session_list, name='admin-chat-sessions'),
    path('admin/sessions/<uuid:session_id>/messages/', views.admin_session_messages, name='admin-chat-messages'),
    path('admin/sessions/<uuid:session_id>/close/', views.admin_close_session, name='admin-close-session'),
]
