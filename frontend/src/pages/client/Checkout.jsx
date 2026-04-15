import React from "react";
import Button from "../../components/Button"; // Reusable Button

function Checkout() {
  return (
    <div className="checkout-wrapper">
      {/* Left: Billing Details */}
      <section className="checkout-form-section">
        <p style={{ color: '#888', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>Client Area</p>
        <h2>Checkout.</h2>
        
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="name">Full Name / School Name</label>
            <input type="text" id="name" placeholder="Enter name" required />
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="code">Reference Code</label>
              <input type="text" id="code" placeholder="e.g. BGD-2026" required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="status">Account Status</label>
              <select id="status">
                <option value="active">Active Client</option>
                <option value="inactive">One-time Order</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
               <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                 <input type="radio" name="pay" defaultChecked /> Cash
               </label>
               <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                 <input type="radio" name="pay" /> Bank Transfer
               </label>
            </div>
          </div>

          <Button style={{ width: '100%', marginTop: '20px' }}>Complete Checkout</Button>
        </form>
      </section>

      {/* Right: Order Summary */}
      <aside className="summary-card">
        <h3 style={{ fontFamily: 'Fraunces', marginBottom: '20px' }}>Order Summary</h3>
        
        <div className="summary-row">
          <span style={{ color: '#888' }}>Subtotal (3 items)</span>
          <span>450.00 DH</span>
        </div>
        <div className="summary-row">
          <span style={{ color: '#888' }}>Shipping (El Aïoun)</span>
          <span style={{ color: '#2ecc71', fontWeight: '600' }}>Free</span>
        </div>
        <div className="summary-row">
          <span style={{ color: '#888' }}>Tax (0%)</span>
          <span>0.00 DH</span>
        </div>

        <div className="summary-total">
          <span>Total</span>
          <span style={{ fontFamily: 'Fraunces' }}>450.00 DH</span>
        </div>

        <p style={{ fontSize: '11px', color: '#bbb', marginTop: '20px', textAlign: 'center' }}>
          By completing this checkout, you agree to Library BOUGDIM's terms of service.
        </p>
      </aside>
    </div>
  );
}

export default Checkout;