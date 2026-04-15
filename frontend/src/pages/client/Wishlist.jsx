import React from "react";
import Button from "../../components/Button";
import { ShoppingCart, Trash2 } from "lucide-react";

function Wishlist() {
  const wishlistItems = [
    { 
      id: 1, 
      name: "The Art of Programming", 
      category: "Books", 
      price: "180.00 DH",
      image: "https://via.placeholder.com/200x300?text=Book+A" 
    },
    { 
      id: 2, 
      name: "Advanced Science Kit", 
      category: "Education", 
      price: "450.00 DH",
      image: "https://via.placeholder.com/200x300?text=Science+Kit" 
    }
  ];

  return (
    <div className="wishlist-container">
      <header>
        <p style={{ color: '#888', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>Client Area</p>
        <h2 style={{ fontFamily: 'Fraunces', fontSize: '2.5rem' }}>Your Wishlist.</h2>
      </header>

      {wishlistItems.length > 0 ? (
        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <div className="wishlist-card" key={item.id}>
              <div className="wishlist-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="wishlist-content">
                <span className="category">{item.category}</span>
                <h4>{item.name}</h4>
                <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{item.price}</p>
                
                <div className="wishlist-actions">
                  <Button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <ShoppingCart size={16} /> Move to Cart
                  </Button>
                  <button className="btn-remove" title="Remove">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <p style={{ color: '#888', fontSize: '1.2rem' }}>Your wishlist is empty.</p>
          <Button variant="outline" style={{ marginTop: '20px' }}>Explore Library</Button>
        </div>
      )}
    </div>
  );
}

export default Wishlist;