// BETA VERSION - Authentication bypassed for easier testing
// To re-enable authentication: uncomment GoogleOAuthProvider, Logout, and SignUpPage imports
// and restore the signup route and authentication logic
// import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
// Authentication imports commented out for beta - no login required
// import { GoogleOAuthProvider } from '@react-oauth/google';
// import Logout from './components/Logout';
// import SignUpPage from './pages/Home/SignUpPage';
import Home from './pages/Home/Home';
import ZipcodeTest from './components/ZipcodeTest/ZipcodeTest';
import TechTest from './components/ZoneTest/ZoneTest';
import './App.css';
import { Analytics } from '@vercel/analytics/react';

// const clientId = "590270213154-8a2hnnu2o7kctm3fnnsb1l0v3c0t4n0a.apps.googleusercontent.com";

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
        {/* Logout removed for beta - no authentication required */}
        {/* <li>
          <Logout />
        </li> */}
      </ul>
    </nav>
  );
};

function App() {
  // For beta testing, we'll bypass authentication
  // Keep the state for future use when authentication is needed
 // const [isLoggedIn, setIsLoggedIn] = useState(true); // Always true for beta

  // const handleLoginSuccess = () => {
  //   setIsLoggedIn(true);
  //   localStorage.setItem('isLoggedIn', 'true');
  // };

  return (
    // <GoogleOAuthProvider clientId={clientId}>
    <>
      <Router>
        <div className="App">
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            {/* <Route 
              path="/signup" 
              element={
                isLoggedIn ? 
                <Navigate to="/zipcode-test" /> : 
                <SignUpPage onLoginSuccess={handleLoginSuccess} />
              } 
            /> */}
            <Route path="/zipcode-test" element={<ZipcodeTest />} />
            <Route path="/zone-test" element={<TechTest />} />
          </Routes>
        </div>
      </Router>
      <Analytics />
    </>
    // </GoogleOAuthProvider>
  );
}

export default App;
