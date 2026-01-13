"""
URL configuration for Adapt Diet project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('django-admin/', admin.site.urls),  # Keep but won't use
    path('api/auth/', include('apps.accounts.urls')),
    path('api/plans/', include('apps.plans.urls')),
    path('api/leads/', include('apps.leads.urls')),
    path('api/chat/', include('apps.chat.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
