import React, { useState, useEffect } from 'react';
import { getBikes } from '../services/api';
import { useNavigate } from 'react-router-dom';

function BikesList() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('access_token');

  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      const response = await getBikes();
      setBikes(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load bikes. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading bikes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="grid-container">
      {bikes.length === 0 ? (
        <div className="no-bikes">
          <h3>No bikes available yet</h3>
          <p>Be the first to list your bike!</p>
        </div>
      ) : (
        bikes.map((bike) => (
          <div key={bike.id} className="card">
            <img 
              src={bike.image || 'https://placehold.co/400x250/34D399/ffffff?text=Bike'} 
              alt={bike.title} 
              className="card-image" 
            />
            <div className="card-content">
              <div className="card-info">
                <h3 className="card-title">{bike.title}</h3>
                <p className="card-location">{bike.location}</p>
                <p className="card-description">{bike.description.substring(0, 80)}...</p>
              </div>
              <div className="card-footer">
                <span className="price-text">
                  ₹{bike.price_per_day}
                  <span className="price-unit">/day</span>
                </span>
                <button
                  onClick={() => {
                    if (isLoggedIn) {
                      alert(`Viewing ${bike.title} - Details page coming soon!`);
                    } else {
                      navigate('/login');
                    }
                  }}
                  className="btn btn-secondary"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default BikesList;