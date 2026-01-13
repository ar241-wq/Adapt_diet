from django.urls import path
from . import views

urlpatterns = [
    # Public endpoint
    path('', views.create_lead, name='lead-create'),

    # Admin endpoints
    path('admin/', views.admin_lead_list, name='admin-lead-list'),
    path('admin/<int:pk>/', views.admin_lead_update, name='admin-lead-update'),
]
