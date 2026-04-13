import React from "react";
import styloBleu from "../../../assets/products/stylo-a-bille-bleu-bic-cristal.jpg";

function ProductDetailsAdmin() {
  return (
    <div className="admin-detail-wrapper">
      <header style={{ marginBottom: '30px' }}>
        <p style={{ fontSize: '12px', letterSpacing: '2px', color: '#888' }}>ADMIN / INVENTORY / DETAILS</p>
        <h1 style={{ fontFamily: 'Fraunces, serif' }}>Manage Product</h1>
      </header>

      <div className="admin-card">
        
        <div className="admin-product-side">
          <div className="admin-product-img">
            <img src={styloBleu} alt="Stylo BIC" />
          </div>
          <button style={{ width: '100%', marginTop: '15px', padding: '10px', fontSize: '12px', cursor: 'pointer' }}>
            Change Image
          </button>
        </div>

        
        <div className="admin-detail-content">
          <div className="admin-stats-strip">
            <div className="stat-item">
              <span>Current Stock</span>
              <strong>124 Units</strong>
            </div>
            <div className="stat-item">
              <span>Total Sold</span>
              <strong>1,450 DH</strong>
            </div>
            <div className="stat-item">
              <span>Status</span>
              <strong style={{ color: '#0ca678' }}>Active</strong>
            </div>
          </div>

          <form>
            <div className="admin-form-group">
              <label>Product Name</label>
              <input type="text" defaultValue="Stylo à bille Bleu - BIC Cristal" />
            </div>
            
            <div className="admin-form-group">
              <label>Description</label>
              <textarea rows="4" defaultValue="Detailed description of the iconic BIC pen for school use."></textarea>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="admin-form-group">
                <label>Price (DH)</label>
                <input type="number" defaultValue="1.50" step="0.1" />
              </div>
              <div className="admin-form-group">
                <label>Category</label>
                <select style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #eee' }}>
                  <option>Supplies</option>
                  <option>Textbooks</option>
                  <option>Equipment</option>
                </select>
              </div>
            </div>

            <div className="admin-actions-bar">
              <button type="button" className="btn-save">Save Changes</button>
              <button type="button" className="btn-archive">Archive Product</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsAdmin;
