import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBike, deleteBike } from '../services/api';
import './BikeDetails.css';

const BikeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    fetchBikeDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchBikeDetails = async () => {
    try {
      setLoading(true);
      const response = await getBike(id);
      const data = response.data || {};
      setBike(data);

      // Check if current user is the owner (guard optional fields)
      const userId = parseInt(localStorage.getItem('user_id')) || null;
      const ownerId = data.owner?.id ?? data.owner_id;
      setIsOwner(ownerId !== undefined && userId && parseInt(ownerId) === userId);

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.message || 'Failed to load bike details');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this bike listing?')) {
      return;
    }

    try {
      await deleteBike(id);
      alert('Bike deleted successfully!');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.detail || err.response?.data?.message || 'Failed to delete bike');
    }
  };

  const handleEdit = () => {
    navigate(`/edit-bike/${id}`);
  };

  const handleBooking = () => {
    // TODO: Implement booking functionality
    alert('Booking feature coming soon!');
  };

  if (loading) {
    return (
      <div className="bike-details-container">
        <div className="details-loading">
          <div className="loading-spinner-large"></div>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Loading bike details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bike-details-container">
        <div className="details-error">
          <h2 className="error-title">Oops!</h2>
          <p className="error-message">{error}</p>
          <button className="action-button action-button-primary" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!bike) {
    return null;
  }

  const ownerName = bike.owner ? ((bike.owner.first_name || bike.owner.last_name) ? `${bike.owner.first_name || ''} ${bike.owner.last_name || ''}`.trim() : bike.owner.username) : 'Owner';
  const ownerEmail = bike.owner?.email || '';
  const ownerInitial = (ownerName && ownerName.length > 0 ? ownerName.charAt(0).toUpperCase() : '?');

  return (
    <div className="bike-details-container">
      <div className="bike-details-wrapper">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>

        <div className="bike-details-content">
          {/* Image Section */}
          <div className="bike-image-section">
            <img
              src={bike.image || bike.imageUrl || 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800'}
              alt={bike.title || bike.name || 'Bike'}
              className="bike-main-image"
            />
            <div className="bike-image-overlay">
              <span className={`bike-status-badge ${bike.available ? '' : 'unavailable'}`}>
                {bike.available ? 'Available' : 'Not Available'}
              </span>
            </div>
          </div>

          {/* Info Section */}
          <div className="bike-info-section">
            <div className="bike-header">
              <h1 className="bike-title">{bike.title || bike.name}</h1>
              
              <div className="bike-location">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {bike.location}
              </div>

              {bike.description && (
                <p className="bike-description">{bike.description}</p>
              )}
            </div>

            {/* Price Section */}
            <div className="bike-price-section">
              <div>
                <div className="bike-price-label">Rental Price</div>
                <div>
                  <span className="bike-price">₹{bike.price_per_day ?? bike.pricePerDay ?? bike.price}</span>
                  <span className="bike-price-unit">/day</span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="bike-details-grid">
              <div className="detail-item">
                <div className="detail-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                </div>
                <div className="detail-content">
                  <div className="detail-label">Status</div>
                  <div className="detail-value">{bike.available ? 'Available Now' : 'Currently Rented'}</div>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div className="detail-content">
                  <div className="detail-label">Listed By</div>
                  <div className="detail-value">{ownerName}</div>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div className="detail-content">
                  <div className="detail-label">Listed On</div>
                  <div className="detail-value">
                    {new Date(bike.created_at || bike.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div className="detail-content">
                  <div className="detail-label">Location</div>
                  <div className="detail-value">{bike.location}</div>
                </div>
              </div>
            </div>

            {/* Owner Section */}
            <div className="owner-section">
              <h3 className="owner-title">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Owner Information
              </h3>
              <div className="owner-info">
                <div className="owner-avatar">
                  {ownerInitial}
                </div>
                <div className="owner-details">
                  <div className="owner-name">{ownerName}</div>
                  <div className="owner-email">{ownerEmail}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bike-actions">
              {isOwner ? (
                <>
                  <button className="action-button action-button-secondary" onClick={handleEdit}>
                    Edit Listing
                  </button>
                  <button className="action-button action-button-danger" onClick={handleDelete}>
                    Delete Listing
                  </button>
                </>
              ) : (
                <>
                  {bike.available ? (
                    <button className="action-button action-button-primary" onClick={handleBooking}>
                      Book Now
                    </button>
                  ) : (
                    <button className="action-button action-button-primary" disabled>
                      Currently Unavailable
                    </button>
                  )}
                  <button className="action-button action-button-secondary" onClick={() => window.location.href = `mailto:${ownerEmail}`}>
                    Contact Owner
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeDetails;