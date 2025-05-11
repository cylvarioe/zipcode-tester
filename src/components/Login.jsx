import React from 'react';
import styled from 'styled-components';
import { GoogleLogin } from '@react-oauth/google';

const LoginContainer = styled.div`
  margin: 20px 0;
`;

const Login = () => {
  const onSuccess = (response) => {
    console.log("Login Success:", response);
    // Handle the login response (e.g., send the token to your backend)
  };

  const onFailure = (error) => {
    console.log("Login Failed:", error);
  };

  return (
    <LoginContainer>
      <GoogleLogin
        onSuccess={onSuccess}      // Handle success
        onError={onFailure}        // Handle failure
        useOneTap                  // Optional: enables one-tap login
        theme="filled_blue"        // Customize the theme of the button
        shape="rectangular"        // Customize the shape of the button
        text="signin_with"         // Customize button text
        size="large"               // Customize the size of the button
      />
    </LoginContainer>
  );
};

export default Login;
