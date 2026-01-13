from django.db import models


class Lead(models.Model):
    """
    Contact form submission / lead model.
    Stores potential customer inquiries from the contact page.
    """
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(
        max_length=20,
        blank=True,
        help_text="Optional phone number"
    )
    goal = models.CharField(
        max_length=200,
        help_text="What the user wants to achieve (e.g., 'Lose weight', 'Build muscle')"
    )
    message = models.TextField(
        help_text="Additional message or details"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    is_contacted = models.BooleanField(
        default=False,
        help_text="Has this lead been contacted?"
    )
    notes = models.TextField(
        blank=True,
        help_text="Admin notes about this lead"
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Lead'
        verbose_name_plural = 'Leads'

    def __str__(self):
        return f"{self.name} - {self.email}"
