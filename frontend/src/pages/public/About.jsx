import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, MapPin, Phone, School, ShoppingBag } from "lucide-react";
import aboutBackground from "../../assets/background/background1.png";

function About() {
  return (
    <div className="about-page">
      <main className="about-wrapper">
        <section className="about-hero about-brand-hero">
          <div className="about-text about-hero-copy">
            <span className="eyebrow-label">Librairie BOUGDIM</span>
            <h1>Books, school supplies, and local service in one place.</h1>
            <p>
              Library BOUGDIM helps families, students, and schools prepare faster with a curated catalogue
              of textbooks, writing tools, office supplies, and special orders.
            </p>
            <div className="about-hero-actions">
              <Link to="/products" className="home-btn home-btn-primary">
                Browse products
              </Link>
              <Link to="/special-order" className="home-btn home-btn-secondary">
                Special order
              </Link>
            </div>
          </div>

          <div
            className="about-visual about-brand-panel"
            style={{ "--about-background-image": `url(${aboutBackground})` }}
            aria-label="Library BOUGDIM overview"
          />
        </section>

        <section className="about-story-band">
          <div>
            <span className="eyebrow-label">What we do</span>
            <h2>We make back-to-school shopping clear, quick, and reliable.</h2>
          </div>
          <p>
            From daily stationery to requested books, the shop connects local advice with online ordering
            so customers can find what they need without wasting time.
          </p>
        </section>

        <section className="about-service-grid" aria-label="About Library BOUGDIM services">
          <article>
            <BookOpen size={24} />
            <h3>Curated catalogue</h3>
            <p>Books and supplies organized by category for faster browsing and cleaner school lists.</p>
          </article>
          <article>
            <School size={24} />
            <h3>School support</h3>
            <p>Orders can be prepared around school needs, invoices, and classroom essentials.</p>
          </article>
          <article>
            <ShoppingBag size={24} />
            <h3>Special orders</h3>
            <p>Customers can request items that are not currently visible in the catalogue.</p>
          </article>
        </section>

        <section className="contact-info-grid about-contact-grid">
          <div className="info-block">
            <MapPin size={20} />
            <h4>Location</h4>
            <p>El Aioun Sidi Mellouk<br />Oujda, Morocco</p>
          </div>
          <div className="info-block">
            <Phone size={20} />
            <h4>Contact</h4>
            <p>contact@bougdim.com<br />+212 566 66 66 66</p>
          </div>
          <div className="info-block">
            <Clock size={20} />
            <h4>Hours</h4>
            <p>Mon - Sun<br />09:00 - 19:00</p>
          </div>
        </section>

        <section className="about-map-section">
          <div className="about-map-head">
            <span className="eyebrow-label">Find us</span>
            <h2>Visit Library BOUGDIM</h2>
          </div>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3199.2784684979056!2d-2.5058254!3d34.5834038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd77f9004e152159%3A0x9a5c486a1299502c!2zTGlicmFpcmllIEJPVUdESU0g2YXZg9iq2KjYqSDYqNmI2YPYr9mK2YU!5e1!3m2!1sfr!2sma!4v1775847154069!5m2!1sfr!2sma"
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="map"
            ></iframe>
          </div>
        </section>
      </main>
    </div>
  );
}

export default About;
