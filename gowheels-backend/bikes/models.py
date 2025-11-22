from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Bike(models.Model):
    BIKE_TYPES = [
        ('mountain', 'Mountain Bike'),
        ('road', 'Road Bike'),
        ('electric', 'Electric Bike'),
        ('cruiser', 'Cruiser'),
        ('hybrid', 'Hybrid'),
    ]
    
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bikes')
    title = models.CharField(max_length=200)
    description = models.TextField()
    bike_type = models.CharField(max_length=20, choices=BIKE_TYPES)
    price_per_day = models.DecimalField(max_digits=8, decimal_places=2)
    location = models.CharField(max_length=200)
    image = models.ImageField(upload_to='bikes/', blank=True, null=True)
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    
    bike = models.ForeignKey(Bike, on_delete=models.CASCADE, related_name='bookings')
    renter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    start_date = models.DateField()
    end_date = models.DateField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.renter.username} - {self.bike.title}"