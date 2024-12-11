import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirect
import axios from 'axios';  // Axios for making HTTP requests
import './AdminAuth.css';  // Assuming you have a CSS file for styling

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState(''); // State to store error messages
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword, fullname, phoneNumber } = formData;

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    // Prepare the signup data
    const data = {
      fullname,
      email,
      phoneNumber,
      password,
    };

    try {
      // Send the signup request to the backend (adjusted API endpoint)
      const response = await axios.post('http://localhost:8000/api/v1/user/admin/signup', data, {
        withCredentials: true, // If you're using cookies
      });

      if (response.data.success) {
        // If signup is successful, redirect to Admin Dashboard
        navigate('/admin/dashboard');  // Redirect to Admin Dashboard
      } else {
        setErrorMessage(response.data.message);  // Display error message from backend
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('An error occurred. Please try again.');  // Show general error
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Admin Signup</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;
