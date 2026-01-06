import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth functions
export const register = (userData) => api.post('/auth/register/', userData);
export const login = (credentials) => api.post('/auth/login/', credentials);
export const getUserProfile = () => api.get('/auth/profile/');

// NEW: OTP & Verification functions
export const sendOTP = (phoneNumber) => api.post('/send-otp/', { phone_number: phoneNumber });
export const verifyOTP = (phoneNumber, otp, userId) => api.post('/verify-otp/', { 
  phone_number: phoneNumber, 
  otp: otp,
  user_id: userId 
});
export const uploadAadhaar = (formData) => api.post('/upload-aadhaar/', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getUserVerificationStatus = () => api.get('/user-profile/');

// Bike functions
export const getBikes = () => api.get('/bikes/');
export const getBike = (id) => api.get(`/bikes/${id}/`);
export const createBike = (bikeData) => {
  // bikeData should be FormData for file uploads
  return api.post('/bikes/', bikeData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
export const getMyBikes = () => api.get('/bikes/my_bikes/');
export const deleteBike = (id) => api.delete(`/bikes/${id}/`);

// Booking functions
export const createBooking = (bookingData) => api.post('/bookings/', bookingData);
export const getMyBookings = () => api.get('/bookings/my_bookings/');
export const getMyRentals = () => api.get('/bookings/my_rentals/');

export default api;