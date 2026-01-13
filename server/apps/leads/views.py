from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Lead
from .serializers import LeadCreateSerializer, LeadListSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def create_lead(request):
    """
    Submit contact form (public).
    Creates a new lead from the contact/get-started page.
    """
    serializer = LeadCreateSerializer(data=request.data)
    if serializer.is_valid():
        lead = serializer.save()
        # TODO: Optionally send email notification here
        return Response(
            {'message': 'Thank you! We will contact you soon.', 'id': lead.id},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_lead_list(request):
    """
    List all leads (admin only).
    """
    if not request.user.is_superuser:
        return Response(
            {'error': 'Admin access required'},
            status=status.HTTP_403_FORBIDDEN
        )

    leads = Lead.objects.all()
    serializer = LeadListSerializer(leads, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def admin_lead_update(request, pk):
    """
    Update lead (mark as contacted, add notes) - admin only.
    """
    if not request.user.is_superuser:
        return Response(
            {'error': 'Admin access required'},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        lead = Lead.objects.get(pk=pk)
    except Lead.DoesNotExist:
        return Response(
            {'error': 'Lead not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = LeadListSerializer(lead, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
