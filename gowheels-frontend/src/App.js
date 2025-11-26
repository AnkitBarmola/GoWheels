import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import AddBike from './components/AddBike';
import BikesList from './components/BikesList';
import './App.css';
import BikeDetails from './components/BikeDetails';
// --- Icon Components ---

const BikeIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5.5" cy="17.5" r="3.5" />
    <circle cx="18.5" cy="17.5" r="3.5" />
    <path d="M15 17.5h-5.5l-2.07-5.09 3.32-1.66 2.25 2.25 5-5-2-3-3.43 3.43" />
    <path d="M5.5 14l3.5-7 3.5 7" />
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const BikeRaceIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="18" r="3" />
    <path d="M18.5 15l-3-3.5 3.5-6.5-5.5 4-3-3.5-3.5 8" />
    <path d="M6.5 15H9" />
  </svg>
);

const ListIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const DollarSignIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

// --- Mock Data ---

const mockBikeData = [
  {
    id: 1,
    title: 'City Commuter',
    location: 'San Francisco, CA',
    price: 15,
    imageUrl: 'https://placehold.co/400x250/34D399/ffffff?text=City+Bike',
  },
  {
    id: 2,
    title: 'Mountain Trailblazer',
    location: 'Marin, CA',
    price: 25,
    imageUrl: 'https://placehold.co/400x250/34D399/ffffff?text=Mountain+Bike',
  },
  {
    id: 3,
    title: 'Beach Cruiser',
    location: 'Santa Monica, CA',
    price: 18,
    imageUrl: 'https://placehold.co/400x250/34D399/ffffff?text=Beach+Cruiser',
  },
  {
    id: 4,
    title: 'Speedy Road Bike',
    location: 'New York, NY',
    price: 30,
    imageUrl: 'https://placehold.co/400x250/34D399/ffffff?text=Road+Bike',
  },
  {
    id: 5,
    title: 'Kid\'s First Bike',
    location: 'Brooklyn, NY',
    price: 10,
    imageUrl: 'https://placehold.co/400x250/34D399/ffffff?text=Kid%27s+Bike',
  },
  {
    id: 6,
    title: 'Electric Assist',
    location: 'Austin, TX',
    price: 45,
    imageUrl: 'https://placehold.co/400x250/34D399/ffffff?text=E-Bike',
  },
];

// --- Home Component ---
function Home() {
  const [bikes] = useState(mockBikeData);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('access_token');

  const handleActionClick = (action, bikeId = null) => {
    if (bikeId) {
      console.log(`${action} for bike ID: ${bikeId}`);
    } else {
      console.log(`Action: ${action}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    alert('Logged out successfully!');
    window.location.reload();
  };

  return (
    <div className="app-container">
      {/* Header - YOUR ORIGINAL with working buttons */}
      <header className="app-header">
        <nav className="container navbar">
          <div className="logo-section">
            <BikeIcon className="icon-large text-primary" />
            <span className="logo-text">GoWheels</span>
          </div>
          <div className="desktop-menu">
            <button onClick={() => navigate('/')} className="nav-link">
              Rent a Bike
            </button>
           <button onClick={() => {
             if (isLoggedIn) {
              navigate('/add-bike');  // ← Changed to navigate to add-bike page
            } else {
               navigate('/login');
              }
             }} className="nav-link">
                   List Your Bike
              </button>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="btn btn-primary">
                Logout
              </button>
            ) : (
              <button onClick={() => navigate('/login')} className="btn btn-primary">
                Sign In / Up
              </button>
            )}
          </div>
          <div className="mobile-menu-btn">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon-medium" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container text-center">
            <h1 className="hero-title">
              Find Your Next Ride,
              <br />
              or <span className="text-primary">Earn with Yours.</span>
            </h1>
            <p className="hero-subtitle">
              The friendly peer-to-peer platform for bike rentals.
            </p>
            <button
              onClick={() => {
                if (isLoggedIn) {
                  // Scroll to bikes section
                  document.getElementById('rent').scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate('/register');
                }
              }}
              className="btn btn-large btn-primary mt-8"
            >
              Start Your Adventure
            </button>
          </div>
        </section>

        {/* Bike Listing Section */}
        {/* Bike Listing Section */}
         <section id="rent" className="section bg-gray">
           <div className="container">
               <h2 className="section-title">
                  Available Bikes Near You
                 </h2>
                <BikesList />
           </div>
 </section>

        {/* How It Works Section */}
        <section id="how" className="section bg-white">
          <div className="container">
            <h2 className="section-title">
              How GoWheels Works
            </h2>
            <div className="grid-split">
              {/* Renting */}
              <div className="info-box bg-gray">
                <h3 className="info-title text-primary">
                  For Renters
                </h3>
                <div className="steps-container">
                  <div className="step-item">
                    <div className="step-icon bg-primary-light">
                      <SearchIcon className="icon-small text-primary" />
                    </div>
                    <div>
                      <h4 className="step-heading">1. Search</h4>
                      <p className="step-desc">Find the perfect bike from thousands of local listings.</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <div className="step-icon bg-primary-light">
                      <CalendarIcon className="icon-small text-primary" />
                    </div>
                    <div>
                      <h4 className="step-heading">2. Book</h4>
                      <p className="step-desc">Book your dates securely and message the owner.</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <div className="step-icon bg-primary-light">
                      <BikeRaceIcon className="icon-small text-primary" />
                    </div>
                    <div>
                      <h4 className="step-heading">3. Ride</h4>
                      <p className="step-desc">Meet up, grab your bike, and enjoy the ride!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lending */}
              <div className="info-box bg-gray">
                <h3 className="info-title text-indigo">
                  For Lenders
                </h3>
                <div className="steps-container">
                  <div className="step-item">
                    <div className="step-icon bg-indigo-light">
                      <ListIcon className="icon-small text-indigo" />
                    </div>
                    <div>
                      <h4 className="step-heading">1. List</h4>
                      <p className="step-desc">List your bike for free. Set your own price and availability.</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <div className="step-icon bg-indigo-light">
                      <CheckIcon className="icon-small text-indigo" />
                    </div>
                    <div>
                      <h4 className="step-heading">2. Approve</h4>
                      <p className="step-desc">Review and approve rental requests from other users.</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <div className="step-icon bg-indigo-light">
                      <DollarSignIcon className="icon-small text-indigo" />
                    </div>
                    <div>
                      <h4 className="step-heading">3. Earn</h4>
                      <p className="step-desc">Get paid securely after a successful rental.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="container footer-content">
          <p className="footer-text">
            &copy; 2024 GoWheels. All rights reserved.
          </p>
          <div className="footer-links">
            <button onClick={() => alert('Privacy Policy coming soon!')} className="footer-link">
              Privacy
            </button>
            <button onClick={() => alert('Terms & Conditions coming soon!')} className="footer-link">
              Terms
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- Main App with Router ---
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-bike" element={<AddBike />} />
        <Route path="/bike/:id" element={<BikeDetails />} />
      </Routes>
    </Router>
  );
}