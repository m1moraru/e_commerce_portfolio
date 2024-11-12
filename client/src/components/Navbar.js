// client/src/components/Navbar.js
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import { ReactComponent as CartIcon } from '../assets/cartIcon.svg';

function Navbar() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated on component mount
  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const response = await axios.get('http://localhost:3000/api/users/check-auth', { withCredentials: true });
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    }
    checkAuthStatus();
  }, [setIsAuthenticated]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:3000/api/users/logout', { withCredentials: true });
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">Home</Link> | <Link to="/products">Products</Link> |
        <Link to="/man">Man</Link> | <Link to="/woman">Woman</Link> | <Link to="/kids">Kids</Link>
      </div>
      <div className="navbar-right">
        {isAuthenticated ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
        <Link to="/cart" className="cart-link">
          <CartIcon className="cart-icon" />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
