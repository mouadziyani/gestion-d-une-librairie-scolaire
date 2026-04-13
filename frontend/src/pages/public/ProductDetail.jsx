import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo/library.png";

import styloBleu from "../../assets/products/stylo-a-bille-bleu-bic-cristal.jpg";

function ProductDetail() {
  return (
    <div className="product-detail-page">
      <main className="detail-wrapper">
        <div className="detail-image-box">
          <img src={styloBleu} alt="Stylo BIC Bleu" />
        </div>

        
        <div className="detail-info-box">
          <span className="brand">BIC France</span>
          <h1>Stylo à bille Bleu <br/> Cristal Classic</h1>
          <span className="price-tag">1.5 DH</span>
          
          <div className="detail-description">
            <p>
              The iconic BIC Cristal pen is the world's best-selling ballpoint pen. 
              Its clear barrel lets you see the ink level, and its 1.0mm point 
              delivers a smooth writing experience. Perfect for students and professionals.
            </p>
          </div>

          <div className="detail-actions">
            <button className="btn-cart">Add to Cart</button>
            <button className="btn-wishlist">♥</button>
          </div>

          <div style={{marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px'}}>
             <p style={{fontSize: '13px', color: '#888'}}>
                <strong>SKU:</strong> BIC-001 <br/>
                <strong>Category:</strong> School Supplies <br/>
                <strong>Stock:</strong> Available in Store
             </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductDetail;