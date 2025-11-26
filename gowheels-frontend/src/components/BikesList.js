import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBikes } from '../services/api';
import { normalizeBike } from '../utils/normalizeBike';
import './BikesList.css';

const BikesList = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // use Link for navigation instead of imperative navigate

  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      setLoading(true);
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
      <div className="bikes-list-loading">
        Loading bikes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bikes-list-error">
        {error}
      </div>
    );
  }

  if (bikes.length === 0) {
    return (
      <div className="bikes-list-empty">
        No bikes available at the moment.
      </div>
    );
  }

  return (
    <div className="bikes-list-container">
      {bikes.map((raw) => {
        const b = normalizeBike(raw);
        const bikeId = b.id;
        return (
          <Link to={`/bike/${bikeId}`} key={bikeId} className="bike-card-link">
            <div className="bike-card">
              <div className="bike-image-wrapper">
                <img
                  src={b.image || 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800'}
                  alt={b.title}
                  className="bike-image"
                />
                <div className={`bike-status ${b.available ? 'available' : 'unavailable'}`}>
                  {b.available ? 'Available' : 'Not Available'}
                </div>
              </div>
              <div className="bike-info">
                <h3 className="bike-title">{b.title}</h3>
                <p className="bike-location">{b.location}</p>
                <p className="bike-price">₹{b.price_per_day} / day</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default BikesList;
