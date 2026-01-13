"""
WebSocket URL routing for chat app.
"""
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<session_id>[0-9a-f-]+)/$', consumers.VisitorChatConsumer.as_asgi()),
    re_path(r'ws/admin/chat/$', consumers.AdminChatConsumer.as_asgi()),
]
