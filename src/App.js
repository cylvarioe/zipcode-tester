import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './pages/Home/Home';
import ZipcodeTest from './components/ZipcodeTest/ZipcodeTest';
import TechTest from './components/ZoneTest/ZoneTest';
import Logout from './components/Logout';
import SignUpPage from './pages/Home/SignUpPage';
import './App.css';

const clientId = "590270213154-8a2hnnu2o7kctm3fnnsb1l0v3c0t4n0a.apps.googleusercontent.com";

const NavBar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '/home';
  const isZipcodeTest = location.pathname === '/zipcode-test';
  const isTechTest = location.pathname === '/zone-test';
  
  if (isHome) {
    return null;
  }

  return (
    <nav className="nav-bar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {isZipcodeTest && (
          <li>
            <Link to="/zone-test">Zone Tester</Link>
          </li>
        )}
        {isTechTest && (
          <li>
            <Link to="/zipcode-test">Zipcode Tester</Link>
          </li>
        )}
        <li>
          <Logout />
        </li>
      </ul>
    </nav>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check localStorage on initial load
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <div className="App">
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route 
              path="/signup" 
              element={
                isLoggedIn ? 
                <Navigate to="/zipcode-test" /> : 
                <SignUpPage onLoginSuccess={handleLoginSuccess} />
              } 
            />
            <Route 
              path="/zipcode-test" 
              element={
                isLoggedIn ? 
                <ZipcodeTest /> : 
                <Navigate to="/signup" />
              } 
            />
            <Route 
              path="/zone-test" 
              element={
                isLoggedIn ? 
                <TechTest /> : 
                <Navigate to="/signup" />
              } 
            />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
