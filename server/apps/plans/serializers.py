from rest_framework import serializers
from .models import PlanProgram


class PlanListSerializer(serializers.ModelSerializer):
    """Serializer for plan list view (public)."""
    tags_list = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = PlanProgram
        fields = [
            'id', 'title', 'slug', 'short_description',
            'price', 'tags', 'tags_list', 'image', 'image_url'
        ]

    def get_tags_list(self, obj):
        return obj.get_tags_list()

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


class PlanDetailSerializer(serializers.ModelSerializer):
    """Serializer for plan detail view (public)."""
    tags_list = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = PlanProgram
        fields = [
            'id', 'title', 'slug', 'short_description', 'full_description',
            'price', 'tags', 'tags_list', 'image', 'image_url',
            'created_at', 'updated_at'
        ]

    def get_tags_list(self, obj):
        return obj.get_tags_list()

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


class AdminPlanSerializer(serializers.ModelSerializer):
    """Serializer for admin plan management (full CRUD)."""
    tags_list = serializers.SerializerMethodField(read_only=True)
    image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PlanProgram
        fields = [
            'id', 'title', 'slug', 'short_description', 'full_description',
            'price', 'tags', 'tags_list', 'image', 'image_url',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']

    def get_tags_list(self, obj):
        return obj.get_tags_list()

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

    def validate_image(self, value):
        """Validate uploaded image."""
        if value:
            from .utils import validate_image
            is_valid, error = validate_image(value)
            if not is_valid:
                raise serializers.ValidationError(error)
        return value
