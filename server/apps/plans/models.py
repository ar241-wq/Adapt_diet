from django.db import models
from django.utils.text import slugify
from .utils import process_plan_image


class PlanProgram(models.Model):
    """
    Diet plan/program model.
    Stores plan information including processed images.
    """
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    short_description = models.TextField(
        help_text="Brief description for card display (recommended: 100-150 characters)"
    )
    full_description = models.TextField(
        help_text="Full description for detail view"
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Optional price (leave blank for 'Contact for pricing')"
    )
    tags = models.CharField(
        max_length=500,
        blank=True,
        help_text="Comma-separated tags (e.g., 'weight-loss, beginner, meal-prep')"
    )
    image = models.ImageField(
        upload_to='plans/',
        help_text="Plan image (will be resized to max 800px width)"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Only active plans are shown on the public site"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Plan/Program'
        verbose_name_plural = 'Plans/Programs'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # Auto-generate slug from title
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while PlanProgram.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug

        # Process image if it's a new upload
        if self.pk:
            try:
                old_instance = PlanProgram.objects.get(pk=self.pk)
                if old_instance.image != self.image and self.image:
                    # Image has changed, process it
                    self.image = process_plan_image(self.image)
            except PlanProgram.DoesNotExist:
                if self.image:
                    self.image = process_plan_image(self.image)
        elif self.image:
            # New instance with image
            self.image = process_plan_image(self.image)

        super().save(*args, **kwargs)

    def get_tags_list(self):
        """Return tags as a list."""
        if not self.tags:
            return []
        return [tag.strip() for tag in self.tags.split(',') if tag.strip()]
