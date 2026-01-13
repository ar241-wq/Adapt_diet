from django.urls import path
from . import views

urlpatterns = [
    # Public endpoints
    path('', views.public_plan_list, name='plan-list'),
    path('<slug:slug>/', views.public_plan_detail, name='plan-detail'),

    # Admin endpoints
    path('admin/list/', views.admin_plan_list, name='admin-plan-list'),
    path('admin/create/', views.admin_plan_create, name='admin-plan-create'),
    path('admin/<int:pk>/', views.admin_plan_detail, name='admin-plan-detail'),
    path('admin/<int:pk>/update/', views.admin_plan_update, name='admin-plan-update'),
    path('admin/<int:pk>/delete/', views.admin_plan_delete, name='admin-plan-delete'),
]
