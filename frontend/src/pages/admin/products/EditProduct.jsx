import React from "react";

function EditProductAdmin() {
  return (
    <div className="edit-admin-wrapper">
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <span style={{ fontSize: '12px', letterSpacing: '2px', color: '#888', fontWeight: 'bold' }}>
          LIBRARY BOUGDIM ADMIN
        </span>
      </header>

      <div className="edit-card">
        <h2>Edit Product</h2>
        
        <form action="#">
          <div className="form-grid">
            {/* Name */}
            <div className="edit-group full-row">
              <label htmlFor="name">Product Name</label>
              <input type="text" id="name" name="name" defaultValue="Stylo à bille Bleu - BIC" required />
            </div>

            {/* Image URL / Path */}
            <div className="edit-group full-row">
              <label htmlFor="Pics">Image Path / URL</label>
              <input type="text" id="Pics" name="Pics" defaultValue="../../assets/products/stylo-bleu.jpg" required />
            </div>

            {/* Price */}
            <div className="edit-group">
              <label htmlFor="Price">Price (DH)</label>
              <input type="text" id="Price" name="Price" defaultValue="1.50" required />
            </div>

            {/* CodeBar */}
            <div className="edit-group">
              <label htmlFor="code">CodeBar / SKU</label>
              <input type="text" id="code" name="code" defaultValue="BIC-CRISTAL-001" required />
            </div>

            {/* Status */}
            <div className="edit-group full-row">
              <label htmlFor="status">Availability Status</label>
              <select id="status" name="status">
                <option value="active">Active (Visible to Customers)</option>
                <option value="inactive">Inactive (Hidden)</option>
              </select>
            </div>
          </div>

          <button type="submit" className="update-btn">Save Changes</button>
        </form>
      </div>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#aaa' }}>
        Last updated: April 10, 2026
      </p>
    </div>
  );
}

export default EditProductAdmin;