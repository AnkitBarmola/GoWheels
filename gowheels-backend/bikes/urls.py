from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'bikes', views.BikeViewSet)
router.register(r'bookings', views.BookingViewSet)

urlpatterns = [
    # Authentication
    path('auth/register/', views.register, name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', views.get_user_profile, name='user_profile'),
    
    # Router URLs
    path('', include(router.urls)),
    path('', include(router.urls)),
    
    # NEW: OTP & Verification endpoints
    path('send-otp/', views.send_otp, name='send-otp'),
    path('verify-otp/', views.verify_otp, name='verify-otp'),
    path('upload-aadhaar/', views.upload_aadhaar, name='upload-aadhaar'),
    path('user-profile/', views.user_profile, name='user-profile'),
]