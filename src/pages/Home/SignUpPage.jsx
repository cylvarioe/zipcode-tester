import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google'; // Google login
import { useNavigate } from 'react-router-dom'; // To handle navigation
import './SignUpPage.css';


const SignUpPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    // Handle your email sign-up logic here (e.g., send data to API)
    console.log("User signed up with email:", email);
    // Call onLoginSuccess and redirect
    onLoginSuccess();
    navigate('/zipcode-game');
  };

  const handleGoogleLogin = (response) => {
    console.log("Google login success:", response);
    // Handle your Google login logic here
    onLoginSuccess();
    navigate('/zipcode-game');
  };

  const handleGoogleFailure = (error) => {
    console.log("Google login failed:", error);
  };

  return (
    <div className="signup-container">
      <div className="gradient-background">
        <div className="signup-content-wrapper">
          <h2 className="title">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              className="input-field"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="input-field"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              className="input-field"
              placeholder="Re-enter Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" className="cta-button">Sign Up</button>
          </form>

          <div className="or-text">or</div>

          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={handleGoogleFailure}
            useOneTap
            theme="filled_blue"
            shape="rectangular"
            text="signin_with"
            size="large"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
