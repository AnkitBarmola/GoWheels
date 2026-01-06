from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from .models import Bike, Booking, UserProfile, OTPVerification
from .serializers import BikeSerializer, BookingSerializer, UserSerializer, UserProfileSerializer
from .otp_service import OTPService

from .serializers import (
    UserSerializer, RegisterSerializer, 
    BikeSerializer, BookingSerializer
)

# Authentication Views
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'user': UserSerializer(user).data,
            'message': 'User created successfully'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

# Bike ViewSet
class BikeViewSet(viewsets.ModelViewSet):
    queryset = Bike.objects.all()
    serializer_class = BikeSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_bikes(self, request):
        bikes = Bike.objects.filter(owner=request.user)
        serializer = self.get_serializer(bikes, many=True)
        return Response(serializer.data)

# Booking ViewSet
class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        bike = Bike.objects.get(id=self.request.data['bike_id'])
        days = (serializer.validated_data['end_date'] - serializer.validated_data['start_date']).days
        total_price = bike.price_per_day * days
        serializer.save(renter=self.request.user, bike=bike, total_price=total_price)
    
    @action(detail=False, methods=['get'])
    def my_bookings(self, request):
        bookings = Booking.objects.filter(renter=request.user)
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def my_rentals(self, request):
        bookings = Booking.objects.filter(bike__owner=request.user)
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)

# NEW: OTP Views
@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp(request):
    """Send OTP to phone number"""
    phone_number = request.data.get('phone_number')
    
    if not phone_number or len(phone_number) != 10:
        return Response({
            'error': 'Valid 10-digit phone number required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if phone already registered
    if UserProfile.objects.filter(phone_number=phone_number, phone_verified=True).exists():
        return Response({
            'error': 'This phone number is already registered'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Generate OTP
    otp = OTPService.generate_otp()
    
    # Save OTP to database
    OTPVerification.objects.create(
        phone_number=phone_number,
        otp=otp
    )
    
    # Send OTP via MSG91
    sent = OTPService.send_otp_msg91(phone_number, otp)
    
    if sent:
        return Response({
            'message': 'OTP sent successfully to ' + phone_number,
            'phone_number': phone_number
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'error': 'Failed to send OTP. Please try again.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    """Verify OTP and create/update user profile"""
    phone_number = request.data.get('phone_number')
    otp = request.data.get('otp')
    user_id = request.data.get('user_id')  # Optional: if user already exists
    
    try:
        otp_record = OTPVerification.objects.filter(
            phone_number=phone_number,
            otp=otp,
            is_verified=False
        ).latest('created_at')
        
        if not otp_record.is_valid():
            return Response({
                'error': 'OTP expired. Please request a new one.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Mark as verified
        otp_record.is_verified = True
        otp_record.save()
        
        # Create or update user profile
        if user_id:
            try:
                user = User.objects.get(id=user_id)
                profile, created = UserProfile.objects.get_or_create(user=user)
                profile.phone_number = phone_number
                profile.phone_verified = True
                profile.save()
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'message': 'Phone number verified successfully! ✅',
            'verified': True
        }, status=status.HTTP_200_OK)
        
    except OTPVerification.DoesNotExist:
        return Response({
            'error': 'Invalid OTP. Please try again.'
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_aadhaar(request):
    """Upload Aadhaar Card"""
    aadhaar_image = request.FILES.get('aadhaar_card')
    
    if not aadhaar_image:
        return Response({
            'error': 'Aadhaar card image required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Get or create user profile
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    profile.aadhaar_card = aadhaar_image
    profile.aadhaar_verified = False  # Pending admin verification
    profile.save()
    
    return Response({
        'message': '✅ Aadhaar card uploaded successfully! We will verify it soon.',
        'status': 'pending_verification'
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Get user profile with verification status"""
    try:
        profile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
    except UserProfile.DoesNotExist:
        return Response({
            'message': 'Profile not complete. Please verify phone number.'
        }, status=status.HTTP_404_NOT_FOUND)