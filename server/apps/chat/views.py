from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import ChatSession, ChatMessage
from .serializers import (
    ChatSessionSerializer,
    ChatMessageSerializer,
    CreateSessionSerializer
)


# ============== PUBLIC ENDPOINTS ==============

@api_view(['POST'])
@permission_classes([AllowAny])
def create_or_get_session(request):
    """
    Create a new chat session or retrieve existing one.
    If session_id is provided and valid, returns existing session.
    Otherwise creates a new session.
    """
    serializer = CreateSessionSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    session_id = serializer.validated_data.get('session_id')
    visitor_name = serializer.validated_data.get('visitor_name', 'Visitor')

    if session_id:
        # Try to get existing session
        try:
            session = ChatSession.objects.get(session_id=session_id)
            return Response(ChatSessionSerializer(session).data)
        except ChatSession.DoesNotExist:
            pass

    # Create new session
    session = ChatSession.objects.create(visitor_name=visitor_name)
    return Response(
        ChatSessionSerializer(session).data,
        status=status.HTTP_201_CREATED
    )


@api_view(['GET'])
@permission_classes([AllowAny])
def get_session_messages(request, session_id):
    """
    Get messages for a specific session (public - visitor can read own history).
    """
    session = get_object_or_404(ChatSession, session_id=session_id)
    messages = session.messages.all()
    serializer = ChatMessageSerializer(messages, many=True)
    return Response(serializer.data)


# ============== ADMIN ENDPOINTS ==============

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_session_list(request):
    """
    List all chat sessions (admin only).
    Returns sessions with unread count and last message preview.
    """
    if not request.user.is_superuser:
        return Response(
            {'error': 'Admin access required'},
            status=status.HTTP_403_FORBIDDEN
        )

    sessions = ChatSession.objects.all()
    serializer = ChatSessionSerializer(sessions, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_session_messages(request, session_id):
    """
    Get all messages for a specific session (admin only).
    Also marks visitor messages as read.
    """
    if not request.user.is_superuser:
        return Response(
            {'error': 'Admin access required'},
            status=status.HTTP_403_FORBIDDEN
        )

    session = get_object_or_404(ChatSession, session_id=session_id)

    # Mark visitor messages as read
    session.messages.filter(sender_type='visitor', is_read=False).update(is_read=True)

    messages = session.messages.all()
    serializer = ChatMessageSerializer(messages, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def admin_close_session(request, session_id):
    """
    Close a chat session (admin only).
    """
    if not request.user.is_superuser:
        return Response(
            {'error': 'Admin access required'},
            status=status.HTTP_403_FORBIDDEN
        )

    session = get_object_or_404(ChatSession, session_id=session_id)
    session.status = 'closed'
    session.save()

    return Response(ChatSessionSerializer(session).data)
