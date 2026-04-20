import { useState } from "react";
import { api } from "../../services/api";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "general",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    setNotice("");
    setError("");

    try {
      await api.post("/contact-messages", {
        type: "contact",
        name: form.name,
        email: form.email,
        category: form.category,
        subject: "New contact message",
        message: form.message,
      });
      setNotice("Message sent to contact@bougdim.com.");
      setForm({ name: "", email: "", category: "general", message: "" });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send your message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page">
      <main className="contact-wrapper">
        
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
              <p><a href="mailto:contact@bougdim.com">contact@bougdim.com</a></p>
            </div>
            <div className="contact-item">
              <h4>Visit us</h4>
              <p>El Aïoun Sidi Mellouk <br /> Morocco</p>
            </div>
            <div className="contact-item">
              <h4>Call us</h4>
              <p>+212 536 66 66 66</p>
            </div>
          </div>
        </section>

        
        <section className="contact-form-side">
          <div className="contact-form-card">
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input name="name" type="text" placeholder="Full Name" value={form.name} onChange={handleChange} required />
              </div>
              
              <div className="input-group">
                <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <select name="category" value={form.category} onChange={handleChange} style={{ width: '100%', padding: '15px 0', border: 'none', borderBottom: '1px solid #eee', background: 'transparent', color: '#666' }}>
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Support</option>
                  <option value="school">School Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="input-group">
                <textarea name="message" rows="4" placeholder="How can we help you?" value={form.message} onChange={handleChange} required></textarea>
              </div>

              {notice ? <p className="form-alert form-alert-success">{notice}</p> : null}
              {error ? <p className="form-alert form-alert-error">{error}</p> : null}

              <button type="submit" className="btn-send" disabled={sending}>
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </section>

      </main>
    </div>
  );
}

export default Contact;
