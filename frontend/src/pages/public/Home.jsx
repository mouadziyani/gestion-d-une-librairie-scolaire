import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo/library.png";

function Home() {
  return (
    <div className="home-wrapper">
      <section className="hero-section">
        <div className="hero-content">
          <span>Librairie BOUGDIM 2026</span>
          <h1>Your Gateway <br/> to Knowledge.</h1>
          <p>
            Digitalizing the school supply experience. Order your books, 
            stationery, and special requests with a single click.
          </p>
          <div className="hero-btns">
            <Link to="/products" className="btn-filled">Browse Collection</Link>
            <Link to="/specialorder" className="btn-outline">Special Order</Link>
          </div>
        </div>
        
      </section>

      
      <section className="features-strip">
        <div className="feature-item">
          <h3>Fast Delivery</h3>
          <p>Service de livraison rapide pour toutes les écoles partenaires et les particuliers.</p>
        </div>
        <div className="feature-item">
          <h3>Special Orders</h3>
          <p>Passer une commande spéciale pour des produits non disponibles en stock.</p>
        </div>
        <div className="feature-item">
          <h3>Secure Payment</h3>
          <p>Choisissez entre paiement en ligne sécurisé ou espèces à la livraison.</p>
        </div>
        <div className="feature-item">
          <h3>School Partners</h3>
          <p>Gestion optimisée des listes scolaires pour nos établissements partenaires.</p>
        </div>
      </section>

      
      <section style={{padding: '80px 8%', background: '#f9f9f9'}}>
        <h2 style={{fontFamily: 'Fraunces, serif', fontSize: '32px', marginBottom: '40px'}}>Featured Essentials</h2>
        <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
            
            <div style={{background: '#fff', padding: '20px', flex: '1', minWidth: '250px', borderRadius: '8px'}}>
                <img src="https:
                <h4>Mathematics Grade 6</h4>
                <p style={{color: '#888'}}>120 DH</p>
            </div>
            <div style={{background: '#fff', padding: '20px', flex: '1', minWidth: '250px', borderRadius: '8px'}}>
                <img src="https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=400" alt="Supply" style={{width: '100%', marginBottom: '15px'}} />
                <h4>Science Starter Kit</h4>
                <p style={{color: '#888'}}>85 DH</p>
            </div>
        </div>
      </section>
    </div>
  );
}

export default Home;