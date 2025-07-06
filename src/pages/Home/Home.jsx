import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="gradient-background">
        <div className="content-wrapper">
          <h1 className="title">Welcome to Zipcode Tester</h1>
          <p className="subtitle">The Ultimate Zipcode Training Tool for Dispatchers
          <br></br>
          Built to make dispatchers extraordinarily efficient
          </p>
          </div>
          <Link to="/zipcode-test" className="cta-button">
            <span className="windows-icon">🎮</span>
            START TRAINING
          </Link>
          <div className="features-container">
          <div className="features-grid">
            <Link to="/zipcode-test" className="feature-card">
              <h3>🎯 Memory Training</h3>
              <p>Enhance your spatial memory of delivery zones through interactive gameplay</p>
            </Link>
            <Link to="/zone-test" className="feature-card">
              <h3>👨‍💻 Zone Tester</h3>
              <p>Master area coverage and improve dispatch efficiency</p>
            </Link>
            <div className="feature-card">
              <h3>⚡ Real-time Practice</h3>
              <p>Test your knowledge with our time-based challenges</p>
            </div>
            <div className="feature-card">
              <h3>🗺️ Zone Mastery</h3>
              <p>Learn to instantly recognize zones and their corresponding zipcodes</p>
            </div>
          </div>
          <div className="coverage-section">
            <h2>Coverage Area</h2>
            <div className="coverage-content">
              <p>Currently serving Arizona</p>
              <ul>
                <li>Phoenix Metropolitan Area</li>
                <li>Mesa</li>
                <li>Scottsdale</li>
                <li>Tempe</li>
                <li>Chandler</li>
                <li>Gilbert</li>
                <li>Glendale</li>
              </ul>
              <p className="expansion-note">More areas coming soon!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 