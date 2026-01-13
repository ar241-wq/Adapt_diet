from rest_framework import serializers
from .models import ChatSession, ChatMessage


class ChatMessageSerializer(serializers.ModelSerializer):
    """Serializer for chat messages."""

    class Meta:
        model = ChatMessage
        fields = ['id', 'session', 'sender_type', 'text', 'is_read', 'created_at']
        read_only_fields = ['id', 'created_at']


class ChatSessionSerializer(serializers.ModelSerializer):
    """Serializer for chat sessions."""
    unread_count = serializers.IntegerField(read_only=True)
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = ChatSession
        fields = [
            'session_id', 'visitor_name', 'status',
            'created_at', 'last_seen', 'unread_count', 'last_message'
        ]
        read_only_fields = ['session_id', 'created_at', 'last_seen']

    def get_last_message(self, obj):
        last_msg = obj.messages.last()
        if last_msg:
            return {
                'text': last_msg.text[:50],
                'sender_type': last_msg.sender_type,
                'created_at': last_msg.created_at.isoformat()
            }
        return None


class CreateSessionSerializer(serializers.Serializer):
    """Serializer for creating/retrieving a chat session."""
    session_id = serializers.UUIDField(required=False, allow_null=True)
    visitor_name = serializers.CharField(max_length=100, required=False, default='Visitor')
