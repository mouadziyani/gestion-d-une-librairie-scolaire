import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo/library.png";

function SpecialOrder() {
  return (
    <div className="special-order-page">
      <nav className="main-nav">
        <div className="nav-logo">
          <Link to="/">
            <img src={logo} alt="BOUGDIM" style={{ height: '40px' }} />
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/products">Shop</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>

      <main className="special-order-wrapper">
        <div className="special-order-header">
          <h1>Special Request</h1>
          <p>Can't find a specific book or supply? Tell us what you need and we'll source it for you.</p>
        </div>

        <form className="order-form-grid">
          {/* Product Details */}
          <div className="form-group full-width">
            <label>Item Name / Title</label>
            <input type="text" placeholder="e.g. Advanced Physics Grade 12" required />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select>
              <option>Textbook</option>
              <option>Scientific Tool</option>
              <option>Art Supplies</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input type="number" placeholder="1" min="1" />
          </div>

          {/* School Details - Context men cahier des charges */}
          <div className="form-group full-width">
            <label>Associated School (Optional)</label>
            <input type="text" placeholder="e.g. Lycée Technique Oujda" />
          </div>

          <div className="form-group full-width">
            <label>Additional Details (ISBN, Author, Edition...)</label>
            <textarea rows="4" placeholder="The more info, the faster we find it..."></textarea>
          </div>

          <button type="submit" className="btn-submit-order">Submit Special Request</button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <p style={{ fontSize: '13px', color: '#888' }}>
            * Our team will notify you via email once the item is found.
          </p>
        </div>
      </main>
    </div>
  );
}

export default SpecialOrder;