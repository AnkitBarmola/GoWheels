from django.contrib import admin
from .models import Bike, Booking, UserProfile, OTPVerification

# NEW: UserProfile Admin
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone_number', 'phone_verified', 'aadhaar_verified', 'created_at']
    list_filter = ['phone_verified', 'aadhaar_verified', 'created_at']
    search_fields = ['user__username', 'phone_number']
    actions = ['verify_aadhaar', 'unverify_aadhaar']
    
    def verify_aadhaar(self, request, queryset):
        queryset.update(aadhaar_verified=True)
        self.message_user(request, f"{queryset.count()} Aadhaar card(s) verified!")
    verify_aadhaar.short_description = "✅ Verify Aadhaar Cards"
    
    def unverify_aadhaar(self, request, queryset):
        queryset.update(aadhaar_verified=False)
        self.message_user(request, f"{queryset.count()} Aadhaar card(s) unverified!")
    unverify_aadhaar.short_description = "❌ Unverify Aadhaar Cards"

# UPDATED: Bike Admin (with your existing + new verification fields)
@admin.register(Bike)
class BikeAdmin(admin.ModelAdmin):
    list_display = [
        'title', 
        'owner', 
        'bike_type', 
        'price_per_day', 
        'location',
        'number_plate',
        'is_verified', 
        'verification_status',
        'available',
        'created_at'
    ]
    list_filter = [
        'is_verified', 
        'verification_status', 
        'bike_type', 
        'available',
        'created_at'
    ]
    search_fields = ['title', 'owner__username', 'number_plate', 'location']
    readonly_fields = ['created_at', 'updated_at']
    actions = ['verify_bikes', 'reject_bikes', 'mark_pending']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('owner', 'title', 'description', 'bike_type', 'location')
        }),
        ('Pricing & Availability', {
            'fields': ('price_per_day', 'available')
        }),
        ('Images', {
            'fields': ('image', 'number_plate_image')
        }),
        ('Verification', {
            'fields': ('number_plate', 'is_verified', 'verification_status'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def verify_bikes(self, request, queryset):
        updated = queryset.update(is_verified=True, verification_status='verified')
        self.message_user(request, f"{updated} bike(s) verified successfully! ✅")
    verify_bikes.short_description = "✅ Verify Selected Bikes"
    
    def reject_bikes(self, request, queryset):
        updated = queryset.update(is_verified=False, verification_status='rejected')
        self.message_user(request, f"{updated} bike(s) rejected! ❌")
    reject_bikes.short_description = "❌ Reject Selected Bikes"
    
    def mark_pending(self, request, queryset):
        updated = queryset.update(is_verified=False, verification_status='pending')
        self.message_user(request, f"{updated} bike(s) marked as pending! ⏳")
    mark_pending.short_description = "⏳ Mark as Pending"

# UPDATED: Booking Admin
@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'renter', 
        'bike', 
        'start_date', 
        'end_date', 
        'total_price',
        'status',
        'created_at'
    ]
    list_filter = ['status', 'created_at', 'start_date']
    search_fields = ['renter__username', 'bike__title']
    readonly_fields = ['created_at']
    actions = ['confirm_bookings', 'cancel_bookings', 'complete_bookings']
    
    fieldsets = (
        ('Booking Details', {
            'fields': ('bike', 'renter', 'start_date', 'end_date', 'total_price')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Timestamp', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def confirm_bookings(self, request, queryset):
        updated = queryset.update(status='confirmed')
        self.message_user(request, f"{updated} booking(s) confirmed! ✅")
    confirm_bookings.short_description = "✅ Confirm Bookings"
    
    def cancel_bookings(self, request, queryset):
        updated = queryset.update(status='cancelled')
        self.message_user(request, f"{updated} booking(s) cancelled! ❌")
    cancel_bookings.short_description = "❌ Cancel Bookings"
    
    def complete_bookings(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f"{updated} booking(s) completed! 🎉")
    complete_bookings.short_description = "🎉 Mark as Completed"

# NEW: OTP Verification Admin (for debugging)
@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = ['phone_number', 'otp', 'is_verified', 'created_at']
    list_filter = ['is_verified', 'created_at']
    search_fields = ['phone_number']
    readonly_fields = ['created_at']
    ordering = ['-created_at']
    
    # Make it easier to see recent OTPs
    date_hierarchy = 'created_at'