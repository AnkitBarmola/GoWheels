import React, { useState } from 'react';
import { createBike } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import './AddBike.css';

function AddBike() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bike_type: 'mountain',
    price_per_day: '',
    location: '',
    number_plate: '',
    available: true
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [numberPlateImage, setNumberPlateImage] = useState(null);
  const [numberPlatePreview, setNumberPlatePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successBike, setSuccessBike] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNumberPlateImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNumberPlateImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setNumberPlatePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create FormData to handle file upload
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('bike_type', formData.bike_type);
      data.append('price_per_day', formData.price_per_day);
      data.append('location', formData.location);
      data.append('number_plate', formData.number_plate);
      data.append('available', formData.available);
      
      if (image) {
        data.append('image', image);
      }

      if (numberPlateImage) {
        data.append('number_plate_image', numberPlateImage);
      }

      await createBike(data);
      setSuccessBike(formData.title);
      // Auto-redirect after 5 seconds or user can click button
      setTimeout(() => {
        navigate('/');
      }, 5000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add bike. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-bike-container">
      {successBike ? (
        // Success Modal
        <div className="success-overlay">
          <div className="success-card">
            <div className="success-icon">✅</div>
            
            <h2 className="success-title">Thank You for Listing!</h2>
            
            <p className="success-message">
              Your bike "<strong>{successBike}</strong>" has been successfully listed on GoWheels.
            </p>

            <div className="verification-info">
              <h3 className="verification-title">🔐 Verification Badge Process</h3>
              <p className="verification-text">
                We're committed to maintaining a safe and trustworthy community. Your bike listing will now undergo:
              </p>
              
              <div className="verification-steps">
                <div className="step">
                  <span className="step-number">1</span>
                  <div className="step-content">
                    <strong>License Plate Verification</strong>
                    <p>Our team will verify your bike's license plate details within 24-48 hours</p>
                  </div>
                </div>

                <div className="step">
                  <span className="step-number">2</span>
                  <div className="step-content">
                    <strong>Background Check</strong>
                    <p>We'll conduct a quick background verification to ensure community safety</p>
                  </div>
                </div>

                <div className="step">
                  <span className="step-number">3</span>
                  <div className="step-content">
                    <strong>Verification Badge</strong>
                    <p>Once approved, your listing will display a verified badge ✓ to boost customer trust</p>
                  </div>
                </div>
              </div>

              <div className="verification-note">
                <p>
                  <strong>📧 What's Next?</strong><br/>
                  We'll send you an email update once the verification is complete. You can also check the status anytime in your "My Bikes" section.
                </p>
              </div>
            </div>

            <div className="success-actions">
              <button 
                onClick={() => navigate('/')}
                className="success-button success-button-primary"
              >
                Back to Home
              </button>
              <button 
                onClick={() => navigate('/my-bikes')}
                className="success-button success-button-secondary"
              >
                View My Bikes
              </button>
            </div>

            <p className="success-redirect-text">
              Redirecting to home in 5 seconds...
            </p>
          </div>
        </div>
      ) : (
        // Form
        <div className="add-bike-card">
        <div className="add-bike-header">
          <h1 className="add-bike-title">List Your Bike</h1>
          <p className="add-bike-subtitle">Share your bike and start earning!</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-bike-form">
          <div className="form-group">
            <label className="form-label">Bike Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Mountain Bike XC Pro"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Describe your bike, its condition, and any special features..."
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Bike Type *</label>
              <select
                name="bike_type"
                value={formData.bike_type}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="mountain">Mountain Bike</option>
                <option value="road">Road Bike</option>
                <option value="electric">Electric Bike</option>
                <option value="cruiser">Cruiser</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price per Day (₹) *</label>
              <input
                type="number"
                name="price_per_day"
                value={formData.price_per_day}
                onChange={handleChange}
                className="form-input"
                placeholder="25"
                min="1"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., San Francisco, CA"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">License Plate Number</label>
            <input
              type="text"
              name="number_plate"
              value={formData.number_plate}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., DL01AB1234"
            />
          </div>

          <div className="form-group">
            <label className="form-label">License Plate Photo</label>
            <div className="image-upload-container">
              <input
                type="file"
                accept="image/*"
                onChange={handleNumberPlateImageChange}
                className="file-input"
                id="license-plate-image"
              />
              <label htmlFor="license-plate-image" className="file-label">
                {numberPlatePreview ? 'Change License Plate Photo' : '📋 Upload License Plate Photo'}
              </label>
              
              {numberPlatePreview && (
                <div className="image-preview">
                  <img src={numberPlatePreview} alt="License plate preview" />
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Bike Photo</label>
            <div className="image-upload-container">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
                id="bike-image"
              />
              <label htmlFor="bike-image" className="file-label">
                {imagePreview ? 'Change Photo' : '📷 Upload Photo'}
              </label>
              
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Bike preview" />
                </div>
              )}
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
              />
              <span>Available for rent</span>
            </label>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Listing Bike...' : '🚴 List My Bike'}
          </button>
        </form>

        <div className="add-bike-back">
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </div>
      )}
    </div>
  );
}

export default AddBike;