from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import PlanProgram
from .serializers import PlanListSerializer, PlanDetailSerializer, AdminPlanSerializer


# ============== PUBLIC ENDPOINTS ==============

@api_view(['GET'])
@permission_classes([AllowAny])
def public_plan_list(request):
    """
    List all active plans (public).
    Returns plans with basic info for card display.
    """
    plans = PlanProgram.objects.filter(is_active=True)
    serializer = PlanListSerializer(plans, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def public_plan_detail(request, slug):
    """
    Get single plan by slug (public).
    Returns full plan details.
    """
    plan = get_object_or_404(PlanProgram, slug=slug, is_active=True)
    serializer = PlanDetailSerializer(plan, context={'request': request})
    return Response(serializer.data)


# ============== ADMIN ENDPOINTS ==============

def check_admin(user):
    """Check if user is superuser."""
    return user.is_authenticated and user.is_superuser


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_plan_list(request):
    """
    List all plans for admin (including inactive).
    """
    if not check_admin(request.user):
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)

    plans = PlanProgram.objects.all()
    serializer = AdminPlanSerializer(plans, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def admin_plan_create(request):
    """
    Create a new plan (admin only).
    Accepts multipart form data for image upload.
    """
    if not check_admin(request.user):
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)

    serializer = AdminPlanSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_plan_detail(request, pk):
    """
    Get single plan by ID for admin.
    """
    if not check_admin(request.user):
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)

    plan = get_object_or_404(PlanProgram, pk=pk)
    serializer = AdminPlanSerializer(plan, context={'request': request})
    return Response(serializer.data)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def admin_plan_update(request, pk):
    """
    Update an existing plan (admin only).
    Supports both PUT (full update) and PATCH (partial update).
    """
    if not check_admin(request.user):
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)

    plan = get_object_or_404(PlanProgram, pk=pk)
    partial = request.method == 'PATCH'
    serializer = AdminPlanSerializer(
        plan,
        data=request.data,
        partial=partial,
        context={'request': request}
    )
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def admin_plan_delete(request, pk):
    """
    Delete a plan (admin only).
    """
    if not check_admin(request.user):
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)

    plan = get_object_or_404(PlanProgram, pk=pk)
    plan.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# ============== DIET PLAN GENERATOR ==============

@api_view(['POST'])
@permission_classes([AllowAny])
def generate_diet_plan(request):
    """
    Generate a personalized 7-day diet plan based on user input.

    Request body:
    {
        "height": 175,        # cm (required)
        "weight": 70,         # kg (required)
        "allergies": ["nuts", "dairy"],  # optional
        "goal": "maintain",   # lose, maintain, gain (default: maintain)
        "age": 30,            # optional (default: 30)
        "gender": "male",     # male, female (default: male)
        "activity_level": "moderate"  # sedentary, light, moderate, active, very_active
    }
    """
    from .diet_generator import generate_weekly_plan

    # Validate required fields
    height = request.data.get('height')
    weight = request.data.get('weight')

    if not height or not weight:
        return Response(
            {'error': 'Height and weight are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        height = float(height)
        weight = float(weight)
    except (ValueError, TypeError):
        return Response(
            {'error': 'Height and weight must be numbers'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate ranges
    if height < 100 or height > 250:
        return Response(
            {'error': 'Height must be between 100 and 250 cm'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if weight < 30 or weight > 300:
        return Response(
            {'error': 'Weight must be between 30 and 300 kg'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Get optional fields
    allergies = request.data.get('allergies', [])
    if isinstance(allergies, str):
        allergies = [a.strip() for a in allergies.split(',') if a.strip()]

    goal = request.data.get('goal', 'maintain')
    if goal not in ['lose', 'maintain', 'gain']:
        goal = 'maintain'

    age = request.data.get('age', 30)
    try:
        age = int(age)
        if age < 18 or age > 100:
            age = 30
    except (ValueError, TypeError):
        age = 30

    gender = request.data.get('gender', 'male')
    if gender not in ['male', 'female']:
        gender = 'male'

    activity_level = request.data.get('activity_level', 'moderate')
    valid_levels = ['sedentary', 'light', 'moderate', 'active', 'very_active']
    if activity_level not in valid_levels:
        activity_level = 'moderate'

    # Generate the plan
    plan = generate_weekly_plan(
        height=height,
        weight=weight,
        allergies=allergies,
        goal=goal,
        age=age,
        gender=gender,
        activity_level=activity_level
    )

    return Response(plan)
