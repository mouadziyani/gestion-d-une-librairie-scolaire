import React from "react";

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! We will contact you soon.");
  };

  return (
    <div className="contact-page">
      <main className="contact-wrapper">
        
        {/* Left Side: Info */}
        <section className="contact-info-side">
          <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '2px', color: '#888' }}>
            GET IN TOUCH
          </span>
          <h1>Let's start a <br /> conversation.</h1>
          <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '20px' }}>
            Questions about an order or interested in a school partnership? 
            Our team at Library BOUGDIM is here to help.
          </p>

          <div className="contact-details">
            <div className="contact-item">
              <h4>Email us</h4>
              <p>hello@bougdim.com</p>
            </div>
            <div className="contact-item">
              <h4>Visit us</h4>
              <p>Hay Al-Qods, Oujda <br /> Morocco</p>
            </div>
            <div className="contact-item">
              <h4>Call us</h4>
              <p>+212 536 XX XX XX</p>
            </div>
          </div>
        </section>

        {/* Right Side: Form */}
        <section className="contact-form-side">
          <div className="contact-form-card">
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input type="text" placeholder="Full Name" required />
              </div>
              
              <div className="input-group">
                <input type="email" placeholder="Email Address" required />
              </div>

              <div className="input-group">
                <select style={{ width: '100%', padding: '15px 0', border: 'none', borderBottom: '1px solid #eee', background: 'transparent', color: '#666' }}>
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Support</option>
                  <option value="school">School Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="input-group">
                <textarea rows="4" placeholder="How can we help you?" required></textarea>
              </div>

              <button type="submit" className="btn-send">
                Send Message
              </button>
            </form>
          </div>
        </section>

      </main>
    </div>
  );
}

export default Contact;