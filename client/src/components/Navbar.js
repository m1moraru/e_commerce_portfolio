// client/src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { ReactComponent as CartIcon } from '../assets/cartIcon.svg';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">Home</Link> | <Link to="/products">Products</Link> |
        <Link to="/man">Man</Link> | <Link to="/woman">Woman</Link> | <Link to="/kids">Kids</Link>
      </div>
      <div className="navbar-right">
        <Link to="/login">Login</Link> | 
        <Link to="/cart" className="cart-link">
          <CartIcon className="cart-icon" />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

