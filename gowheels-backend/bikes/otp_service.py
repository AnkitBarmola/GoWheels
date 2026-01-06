# bikes/otp_service.py
import requests
import random
from django.conf import settings

class OTPService:
    
    @staticmethod
    def generate_otp():
        """Generate 6-digit OTP"""
        return str(random.randint(100000, 999999))
    
    @staticmethod
    def send_otp_msg91(phone_number, otp):
        """Send OTP using MSG91 - FREE for India"""
        
        # FOR TESTING: Print OTP to console (remove in production)
        print(f"📱 OTP for {phone_number}: {otp}")
        
        # Uncomment below when you have MSG91 credentials
        """
        url = "https://api.msg91.com/api/v5/otp"
        
        payload = {
            "template_id": settings.MSG91_TEMPLATE_ID,
            "mobile": f"91{phone_number}",
            "authkey": settings.MSG91_AUTH_KEY,
            "otp": otp
        }
        
        headers = {"Content-Type": "application/json"}
        
        try:
            response = requests.post(url, json=payload, headers=headers)
            return response.status_code == 200
        except Exception as e:
            print(f"Error sending OTP: {e}")
            return False
        """
        
        # For testing, always return True
        return True