import React from "react";

function UpdateStock() {
  return (
    <div className="stock-update-container">
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <span style={{ fontSize: '11px', letterSpacing: '2px', color: '#888', fontWeight: '700' }}>
          ADMIN / STOCK CONTROL
        </span>
      </header>

      <div className="stock-card">
        <h2>Update Inventory</h2>

        {/* Status indicator d s-sel3a li khtar l-admin */}
        <div className="current-stock-badge">
          <span>Currently in Stock</span>
          <strong>1,240 Units</strong>
        </div>

        <form>
          {/* Product Identification */}
          <div className="update-field-group">
            <label htmlFor="name">Item Name</label>
            <input 
              type="text" 
              id="name" 
              defaultValue="Stylo à bille Bleu - BIC Cristal" 
              disabled 
              style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
            />
          </div>

          <div className="update-field-group">
            <label htmlFor="code">Barcode / SKU</label>
            <input type="text" id="code" defaultValue="BIC-001" required />
          </div>

          {/* Stock Logic */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="update-field-group">
              <label htmlFor="quantity">Add / Remove Stock</label>
              <input type="number" id="quantity" placeholder="e.g. +50 or -10" required />
            </div>
            
            <div className="update-field-group">
              <label htmlFor="status">Availability</label>
              <select id="status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="update-field-group">
            <label htmlFor="reason">Reason for Update</label>
            <select id="reason">
              <option>New Shipment Received</option>
              <option>Sales Correction</option>
              <option>Damaged Goods</option>
              <option>Return from Customer</option>
            </select>
          </div>

          <button type="submit" className="btn-update-stock">Confirm Update</button>
        </form>
      </div>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#aaa' }}>
        Inventory logs are tracked for security.
      </p>
    </div>
  );
}

export default UpdateStock;