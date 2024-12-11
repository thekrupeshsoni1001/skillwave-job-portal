import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector to get the loading state from Redux
import { useNavigate } from 'react-router-dom';
import { setLoading, setUser } from '../../redux/authSlice'; // Import actions
import { Loader2 } from 'lucide-react'; // For loading spinner

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // To display error messages
  const dispatch = useDispatch(); // Redux dispatch function
  const navigate = useNavigate(); // React Router's hook to navigate
  const isLoading = useSelector((state) => state.auth.isLoading); // Get loading state from Redux

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reset previous error message
    dispatch(setLoading(true)); // Set loading to true while the login request is being made
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in both fields.');
      dispatch(setLoading(false));
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(setUser(data.user)); // Store the authenticated user in Redux
        dispatch(setLoading(false)); // Set loading to false after the login request

        // Redirect to the admin dashboard after successful login
        navigate('/admin/dashboard');  
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed'); // Show the error message from the backend
        dispatch(setLoading(false)); // Set loading to false if login fails
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('An error occurred. Please try again later.'); // Display a general error message
      dispatch(setLoading(false)); // Set loading to false if there's an error
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        {/* Admin Login Label */}
        <h2 className="login-label">Admin Login</h2>
  
        {/* Email field */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        
        {/* Password field */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        
        {/* Display error message */}
        {error && <p className="error-message">{error}</p>}
  
        {/* Login button with loading state */}
        <button type="submit" className="login-btn">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Login'}
        </button>
      </form>
      
      {/* Correct way to include inline styles */}
      <style> {`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f7fafc;
        }
  
        .login-form {
          background-color: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }
  
        .login-label {
          text-align: center;
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
        }
  
        .input-field {
          width: 100%;
          padding: 10px;
          margin: 8px 0;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }
  
        .input-field:focus {
          border-color: #4b9bff;
          outline: none;
        }
  
        .login-btn {
          width: 100%;
          padding: 10px;
          background-color: #4b9bff;
          color: white;
          font-size: 1.1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
  
        .login-btn:hover {
          background-color: #3577d8;
        }
  
        .error-message {
          color: red;
          font-size: 0.9rem;
          text-align: center;
          margin-top: 10px;
        }
      `} </style>
    </div>
  );
  
};

export default AdminLogin;
