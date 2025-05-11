import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './pages/Home/Home';
import ZipcodeGame from './components/ZipcodeGame/ZipcodeGame';
import TechTest from './components/TechTest/TechTest';
import Logout from './components/Logout';
import SignUpPage from './pages/Home/SignUpPage';
import './App.css';

const clientId = "590270213154-8a2hnnu2o7kctm3fnnsb1l0v3c0t4n0a.apps.googleusercontent.com";

const NavBar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '/home';
  const isZipcodeGame = location.pathname === '/zipcode-game';
  const isTechTest = location.pathname === '/tech-test';
  
  if (isHome) {
    return null;
  }

  return (
    <nav className="nav-bar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {isZipcodeGame && (
          <li>
            <Link to="/tech-test">Tech Zone Test</Link>
          </li>
        )}
        {isTechTest && (
          <li>
            <Link to="/zipcode-game">ZipCoder</Link>
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
                <Navigate to="/zipcode-game" /> : 
                <SignUpPage onLoginSuccess={handleLoginSuccess} />
              } 
            />
            <Route 
              path="/zipcode-game" 
              element={
                isLoggedIn ? 
                <ZipcodeGame /> : 
                <Navigate to="/signup" />
              } 
            />
            <Route 
              path="/tech-test" 
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
