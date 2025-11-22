from django.contrib import admin
from .models import Bike, Booking
# Register your models here.

@admin.register(Bike)
class BikeAdmin(admin.ModelAdmin):
    list_display = ['title', 'owner', 'bike_type', 'price_per_day', 'available', 'created_at']
    list_filter = ['bike_type', 'available']
    search_fields = ['title', 'description', 'location']

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['bike', 'renter', 'start_date', 'end_date', 'status', 'total_price']
    list_filter = ['status', 'start_date']
    search_fields = ['bike__title', 'renter__username']