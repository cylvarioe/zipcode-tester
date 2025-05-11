import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Logout.css';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear any stored authentication data
        localStorage.removeItem('isLoggedIn');
        // Redirect to home page
        navigate('/');
    };

    return (
        <button onClick={handleLogout} className="logout-button">
            Logout
        </button>
    );
};

export default Logout;
