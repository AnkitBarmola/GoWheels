from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Bike, Booking, UserProfile, OTPVerification

# Existing serializers...
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


# Registration serializer (creates Django user)
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

# NEW: UserProfile Serializer
class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    aadhaar_card = serializers.SerializerMethodField()

    def get_aadhaar_card(self, obj):
        if obj.aadhaar_card:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.aadhaar_card.url) if request else obj.aadhaar_card.url
        return None

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'phone_number', 'phone_verified',
                  'aadhaar_card', 'aadhaar_verified', 'created_at']
        read_only_fields = ['phone_verified', 'aadhaar_verified']

# UPDATED: Bike Serializer with verification fields
class BikeSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    image = serializers.SerializerMethodField()
    number_plate_image = serializers.SerializerMethodField()

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None

    def get_number_plate_image(self, obj):
        if obj.number_plate_image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.number_plate_image.url) if request else obj.number_plate_image.url
        return None

    class Meta:
        model = Bike
        fields = ['id', 'owner', 'title', 'description', 'bike_type',
                  'price_per_day', 'location', 'image', 'available',
                  'number_plate', 'number_plate_image', 'is_verified',
                  'verification_status', 'created_at', 'updated_at']
        read_only_fields = ['owner', 'is_verified', 'verification_status']

class BookingSerializer(serializers.ModelSerializer):
    bike = BikeSerializer(read_only=True)
    renter = UserSerializer(read_only=True)
    
    class Meta:
        model = Booking
        fields = ['id', 'bike', 'renter', 'start_date', 'end_date', 
                  'total_price', 'status', 'created_at']
        read_only_fields = ['renter', 'status']