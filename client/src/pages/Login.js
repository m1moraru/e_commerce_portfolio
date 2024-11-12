// client/src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3000/api/users/login',
        { email, password },
        { withCredentials: true }
      );
      console.log('Logged in:', response.data);
      setIsAuthenticated(true); // Update auth state on successful login
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error.response?.data || error.message);
      alert('Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div>
        <p>Or log in using:</p>
        <button onClick={() => (window.location.href = 'http://localhost:3000/api/users/auth/google')}>
          Sign in with Google
        </button>
        <button onClick={() => (window.location.href = 'http://localhost:3000/api/users/auth/facebook')}>
          Sign in with Facebook
        </button>
      </div>
      <div>
        <p>Don't have an account? <Link to="/signup">Sign up here</Link>.</p>
      </div>
    </div>
  );
}

export default Login;
