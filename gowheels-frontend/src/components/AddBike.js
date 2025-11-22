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
    available: true
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
      data.append('available', formData.available);
      
      if (image) {
        data.append('image', image);
      }

      await createBike(data);
      alert('Bike listed successfully!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add bike. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-bike-container">
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
    </div>
  );
}

export default AddBike;