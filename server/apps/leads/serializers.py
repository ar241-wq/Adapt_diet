from rest_framework import serializers
from .models import Lead


class LeadCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new lead (public contact form)."""

    class Meta:
        model = Lead
        fields = ['name', 'email', 'phone', 'goal', 'message']

    def validate_email(self, value):
        """Normalize email to lowercase."""
        return value.lower()


class LeadListSerializer(serializers.ModelSerializer):
    """Serializer for admin lead list view."""

    class Meta:
        model = Lead
        fields = [
            'id', 'name', 'email', 'phone', 'goal', 'message',
            'created_at', 'is_contacted', 'notes'
        ]
        read_only_fields = ['id', 'created_at']
