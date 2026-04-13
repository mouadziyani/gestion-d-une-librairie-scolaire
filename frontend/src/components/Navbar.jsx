import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo/library.png";

function Navbar() {
  const location = useLocation();

  
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="main-nav" aria-label="Primary Navigation">
      <div className="nav-logo">
        <Link to="/">
          <img src={logo} alt="Library BOUGDIM" />
        </Link>
      </div>

      <ul className="nav-links-container">
        <li>
          <Link to="/" style={{ opacity: isActive('/') ? 1 : 0.6 }}>Home</Link>
        </li>
        <li>
          <Link to="/products" style={{ opacity: isActive('/products') ? 1 : 0.6 }}>Shop</Link>
        </li>
        <li>
          <Link to="/specialOrder" style={{ opacity: isActive('/special-order') ? 1 : 0.6 }}>Special Order</Link>
        </li>
        <li>
          <Link to="/about" style={{ opacity: isActive('/about') ? 1 : 0.6 }}>About</Link>
        </li>
        <li>
          <Link to="/login" style={{ opacity: isActive('/login') ? 1 : 0.6 }}>Account</Link>
        </li>
        <li>
          <Link to="/cart" className="cart-link">Cart (0)</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;