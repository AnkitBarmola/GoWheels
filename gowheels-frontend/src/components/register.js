import React, { useState } from 'react';
import { register, sendOTP, verifyOTP } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

function Register() {
  const [step, setStep] = useState('account'); // 'account', 'phone', 'otp'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitAccount = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await register(formData);
      setUserId(response.data.user.id);
      setStep('phone'); // Move to phone verification step
    } catch (err) {
      setError(JSON.stringify(err.response?.data) || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!phoneNumber || phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      await sendOTP(phoneNumber);
      setStep('otp'); // Move to OTP verification step
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await verifyOTP(phoneNumber, otp, userId);
      alert('✅ Registration and phone verification successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card auth-card-large">
        <div className="auth-header">
          <h1 className="auth-title">Join GoWheels!</h1>
          <p className="auth-subtitle">
            {step === 'account' && 'Create your account'}
            {step === 'phone' && 'Verify your phone number'}
            {step === 'otp' && 'Enter the OTP sent to your phone'}
          </p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Step 1: Account Registration */}
        {step === 'account' && (
          <form onSubmit={handleSubmitAccount} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="John"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                placeholder="johndoe"
                required
              />         
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Create a strong password"
                required
              />
            </div>

            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Continue to Phone Verification'}
            </button>
          </form>
        )}

        {/* Step 2: Phone Number */}
        {step === 'phone' && (
          <form onSubmit={handleSendOTP} className="auth-form">
            <div className="form-group">
              <label className="form-label">Phone Number (10 digits)</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="form-input"
                placeholder="9876543210"
                maxLength="10"
                required
              />
              <small style={{ color: '#6b7280', marginTop: '0.5rem', display: 'block' }}>
                We'll send an OTP to verify your phone number
              </small>
            </div>

            <button 
              type="submit" 
              className="auth-button"
              disabled={loading || phoneNumber.length !== 10}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>

            <button 
              type="button" 
              className="auth-button-secondary"
              onClick={() => setStep('account')}
            >
              ← Back
            </button>
          </form>
        )}

        {/* Step 3: OTP Verification */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="auth-form">
            <div className="form-group">
              <label className="form-label">Enter OTP (6 digits)</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="form-input"
                placeholder="000000"
                maxLength="6"
                style={{ fontSize: '1.5rem', letterSpacing: '0.5rem', textAlign: 'center' }}
                required
              />
              <small style={{ color: '#6b7280', marginTop: '0.5rem', display: 'block' }}>
                Check your phone for the 6-digit code (valid for 10 minutes)
              </small>
            </div>

            <button 
              type="submit" 
              className="auth-button"
              disabled={loading || otp.length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify & Complete Registration'}
            </button>

            <button 
              type="button" 
              className="auth-button-secondary"
              onClick={() => {
                setStep('phone');
                setOtp('');
              }}
            >
              ← Back
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login" className="auth-link">Login here</Link>
          </p>
        </div>

        <div className="auth-back">
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;