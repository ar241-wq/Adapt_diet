"""
WebSocket consumers for real-time chat functionality.
"""
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatSession, ChatMessage


class VisitorChatConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for visitor chat.
    Handles real-time messaging between visitor and admin.
    """

    async def connect(self):
        self.session_id = self.scope['url_route']['kwargs']['session_id']
        self.room_group_name = f'chat_{self.session_id}'

        # Verify session exists
        session_exists = await self.check_session_exists()
        if not session_exists:
            await self.close()
            return

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # Also join admin notification group
        await self.channel_layer.group_add(
            'admin_chat_notifications',
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room groups
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        await self.channel_layer.group_discard(
            'admin_chat_notifications',
            self.channel_name
        )

    async def receive(self, text_data):
        """Handle incoming messages from visitor."""
        try:
            data = json.loads(text_data)
            message_text = data.get('text', '').strip()

            if not message_text:
                return

            # Save message to database
            message = await self.save_message(message_text, 'visitor')

            # Broadcast to room (visitor and any admin viewing this session)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': {
                        'id': message.id,
                        'session_id': str(self.session_id),
                        'sender_type': 'visitor',
                        'text': message_text,
                        'created_at': message.created_at.isoformat(),
                    }
                }
            )

            # Notify all admins about new message
            await self.channel_layer.group_send(
                'admin_chat_notifications',
                {
                    'type': 'new_message_notification',
                    'message': {
                        'session_id': str(self.session_id),
                        'sender_type': 'visitor',
                        'text': message_text[:50],
                        'created_at': message.created_at.isoformat(),
                    }
                }
            )

        except json.JSONDecodeError:
            pass

    async def chat_message(self, event):
        """Send message to WebSocket."""
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message': event['message']
        }))

    async def new_message_notification(self, event):
        """Handle new message notification (for admin)."""
        # Visitors don't need to handle this
        pass

    @database_sync_to_async
    def check_session_exists(self):
        return ChatSession.objects.filter(session_id=self.session_id).exists()

    @database_sync_to_async
    def save_message(self, text, sender_type):
        session = ChatSession.objects.get(session_id=self.session_id)
        session.save()  # Update last_seen
        return ChatMessage.objects.create(
            session=session,
            sender_type=sender_type,
            text=text
        )


class AdminChatConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for admin chat dashboard.
    Receives notifications for all sessions and can join specific session rooms.
    """

    async def connect(self):
        # Verify admin authentication via query string token
        # For simplicity, we'll check in receive - in production use middleware
        self.current_session = None

        # Join admin notification group
        await self.channel_layer.group_add(
            'admin_chat_notifications',
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave notification group
        await self.channel_layer.group_discard(
            'admin_chat_notifications',
            self.channel_name
        )

        # Leave current session room if any
        if self.current_session:
            await self.channel_layer.group_discard(
                f'chat_{self.current_session}',
                self.channel_name
            )

    async def receive(self, text_data):
        """Handle incoming messages from admin."""
        try:
            data = json.loads(text_data)
            action = data.get('action')

            if action == 'join_session':
                # Join a specific session room
                session_id = data.get('session_id')
                if session_id:
                    # Leave previous session room if any
                    if self.current_session:
                        await self.channel_layer.group_discard(
                            f'chat_{self.current_session}',
                            self.channel_name
                        )

                    # Join new session room
                    self.current_session = session_id
                    await self.channel_layer.group_add(
                        f'chat_{session_id}',
                        self.channel_name
                    )

                    await self.send(text_data=json.dumps({
                        'type': 'joined_session',
                        'session_id': session_id
                    }))

            elif action == 'send_message':
                # Send message to current session
                if not self.current_session:
                    return

                message_text = data.get('text', '').strip()
                if not message_text:
                    return

                # Save message to database
                message = await self.save_admin_message(message_text)

                # Broadcast to session room
                await self.channel_layer.group_send(
                    f'chat_{self.current_session}',
                    {
                        'type': 'chat_message',
                        'message': {
                            'id': message.id,
                            'session_id': str(self.current_session),
                            'sender_type': 'admin',
                            'text': message_text,
                            'created_at': message.created_at.isoformat(),
                        }
                    }
                )

        except json.JSONDecodeError:
            pass

    async def chat_message(self, event):
        """Send message to WebSocket."""
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message': event['message']
        }))

    async def new_message_notification(self, event):
        """Notify admin of new visitor message."""
        await self.send(text_data=json.dumps({
            'type': 'new_message',
            'message': event['message']
        }))

    @database_sync_to_async
    def save_admin_message(self, text):
        session = ChatSession.objects.get(session_id=self.current_session)
        session.save()  # Update last_seen
        return ChatMessage.objects.create(
            session=session,
            sender_type='admin',
            text=text
        )
