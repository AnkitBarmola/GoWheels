from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Bike, Booking

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class BikeSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    image = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = Bike
        fields = '__all__'
        read_only_fields = ['owner', 'created_at', 'updated_at']

class BookingSerializer(serializers.ModelSerializer):
    bike = BikeSerializer(read_only=True)
    renter = UserSerializer(read_only=True)
    bike_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['renter', 'created_at', 'total_price']