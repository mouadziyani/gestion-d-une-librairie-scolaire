import React from "react";
import styloBic from "../../assets/products/stylo-a-bille-bleu-bic-cristal.jpg"; 

function Cart() {
  return (
    <div className="cart-page">
      <main className="cart-wrapper">
        
        {/* Left Side: Items List */}
        <section className="cart-items-section">
          <h2>Your Cart</h2>
          
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* Item 1 */}
              <tr className="cart-item-row">
                <td>
                  <div className="cart-product-info">
                    <img src={styloBic} alt="Product" className="cart-img" />
                    <div>
                      <h4 style={{ margin: 0 }}>Stylo à bille Bleu - BIC</h4>
                      <p style={{ fontSize: '12px', color: '#888', margin: '5px 0 0' }}>Ref: #001</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="qty-control">
                    <button>−</button>
                    <span>12</span>
                    <button>+</button>
                  </div>
                </td>
                <td style={{ fontWeight: '600' }}>18.00 DH</td>
                <td style={{ textAlign: 'right' }}>
                  <button style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Right Side: Summary */}
        <section className="cart-summary-side">
          <div className="cart-summary-card">
            <h3 style={{ marginBottom: '25px' }}>Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>18.00 DH</span>
            </div>
            
            <div className="summary-row">
              <span>Delivery</span>
              <span style={{ color: '#27ae60', fontWeight: '600' }}>FREE</span>
            </div>

            <div className="summary-row summary-total">
              <span>Total</span>
              <span>18.00 DH</span>
            </div>

            <button className="btn-checkout">Proceed to Checkout</button>
            
            <p style={{ textAlign: 'center', fontSize: '11px', color: '#aaa', marginTop: '15px' }}>
              Tax included. Secure payment guaranteed.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}

export default Cart;