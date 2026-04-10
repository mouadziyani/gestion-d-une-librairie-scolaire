import React from "react";

function AddProductAdmin() {
  return (
    <div className="add-admin-wrapper">
      <header style={{ marginBottom: '40px' }}>
        <span style={{ fontSize: '11px', letterSpacing: '2px', color: '#888', fontWeight: 'bold' }}>
          ADMIN / INVENTORY / NEW
        </span>
      </header>

      <div className="add-card">
        <h2>Add New Product</h2>
        
        <form action="#">
          <div className="form-grid">
            {/* Name */}
            <div className="input-group full-row">
              <label htmlFor="name">Product Title</label>
              <input type="text" id="name" name="name" placeholder="e.g. Oxford English Dictionary" required />
            </div>

            {/* Price (Fiksina l-input type) */}
            <div className="input-group">
              <label htmlFor="price">Price (DH)</label>
              <input type="number" id="price" name="price" placeholder="0.00" step="0.01" required />
            </div>

            {/* CodeBar */}
            <div className="input-group">
              <label htmlFor="code">CodeBar / SKU</label>
              <input type="text" id="code" name="code" placeholder="Scan or enter code" required />
            </div>

            {/* Category (Zdna hada bach t-naddem s-sel3a) */}
            <div className="input-group">
              <label htmlFor="category">Category</label>
              <select id="category" name="category">
                <option value="textbooks">Textbooks</option>
                <option value="supplies">School Supplies</option>
                <option value="equipment">Scientific Equipment</option>
              </select>
            </div>

            {/* Status */}
            <div className="input-group">
              <label htmlFor="status">Initial Status</label>
              <select id="status" name="status">
                <option value="active">Active</option>
                <option value="inactive">Draft / Inactive</option>
              </select>
            </div>

            {/* Pics (Rddinaha File Upload) */}
            <div className="input-group full-row">
              <label htmlFor="pics">Product Image</label>
              <input type="file" id="pics" name="pics" accept="image/*" required />
              <p style={{fontSize: '10px', color: '#aaa', marginTop: '5px'}}>Recommended size: 800x1000px (JPG/PNG)</p>
            </div>

            <button type="submit" className="btn-create">Create Product</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductAdmin;