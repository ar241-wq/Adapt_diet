import uuid
from django.db import models


class ChatSession(models.Model):
    """
    Chat session for a visitor.
    Each visitor gets a unique session identified by UUID.
    """
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
    ]

    session_id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    created_at = models.DateTimeField(auto_now_add=True)
    last_seen = models.DateTimeField(auto_now=True)
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='open'
    )
    visitor_name = models.CharField(
        max_length=100,
        blank=True,
        default='Visitor',
        help_text="Optional visitor name"
    )

    class Meta:
        ordering = ['-last_seen']
        verbose_name = 'Chat Session'
        verbose_name_plural = 'Chat Sessions'

    def __str__(self):
        return f"Session {self.session_id} - {self.visitor_name}"

    @property
    def unread_count(self):
        """Count of unread messages from visitor."""
        return self.messages.filter(sender_type='visitor', is_read=False).count()


class ChatMessage(models.Model):
    """
    Individual chat message within a session.
    """
    SENDER_CHOICES = [
        ('visitor', 'Visitor'),
        ('admin', 'Admin'),
    ]

    session = models.ForeignKey(
        ChatSession,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    sender_type = models.CharField(
        max_length=10,
        choices=SENDER_CHOICES
    )
    text = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        verbose_name = 'Chat Message'
        verbose_name_plural = 'Chat Messages'

    def __str__(self):
        return f"[{self.sender_type}] {self.text[:50]}"
