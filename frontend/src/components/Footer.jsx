import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <h3>BOUGDIM.</h3>
          <p>
            Your trusted library for school books, scientific equipment, 
            and office supplies. Empowering education since 2026.
          </p>
        </div>

        
        <div className="footer-col">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/specialOrder">Special Requests</Link></li>
            <li><Link to="/about">Our Story</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/login">Client Login</Link></li>
          </ul>
        </div>

        
        <div className="footer-col">
          <h4>Office</h4>
          <ul className="contact-list">
            <li>BD HASSAN II NR 07, <br /> ELAIOUN SIDI MELLOUK</li>
            <li>+212 536 XX XX XX</li>
            <li>contact@bougdim.com</li>
          </ul>
        </div>
      </div>

      
      <div className="footer-bottom">
        <p>© 2026 Library BOUGDIM. All rights reserved.</p>
        <p>
          Created by{" "}
          <a 
            href="https://www.mouadziyani.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="creator-link"
          >
            Mouad Ziyani
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;