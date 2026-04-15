import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo/library.png";

function About() {
  return (
    <div className="about-page">
      <main className="about-wrapper">
        <section className="about-hero">
          <div className="about-text">
            <h1>Our <br/> Story.</h1>
            <p>
              Library BOUGDIM is more than just a store. We are a partner in your educational journey, 
              providing quality textbooks and supplies to schools and families since 2026.
            </p>
            <p style={{fontSize: '1rem', color: '#888'}}>
               Digitalizing the way you access knowledge, from El Aïoun Sidi Mellouk to your doorstep.
            </p>
          </div>
          
          <div className="about-visual">
             <div style={{width: '100%', height: '400px', backgroundColor: '#f0f0f0', borderRadius: '20px'}}></div>
          </div>
        </section>

        <section className="contact-info-grid">
           <div className="info-block">
              <h4>Location</h4>
              <p>El Aïoun Sidi Mellouk  <br/>Oujda, Morocco</p>
           </div>
           <div className="info-block">
              <h4>Contact</h4>
              <p>contact@bougdim.com <br/> +212 5XX XX XX XX</p>
           </div>
           <div className="info-block">
              <h4>Hours</h4>
              <p>Mon - Sun: 09:00 - 19:00 </p>
           </div>
        </section>

        <section className="map-container">
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
        </section>
      </main>
    </div>
  );
}

export default About;