import { useState } from "react";
import { api } from "../../services/api";

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const faqs = [
    {
      question: "How long does shipping take in Morocco?",
      answer: "For major cities like Oujda, Casablanca, and Rabat, shipping takes 24-48 hours. Other regions may take 3-5 business days via our partner carriers."
    },
    {
      question: "Can I place a special order for books not in stock?",
      answer: "Absolutely! Use our 'Special Order' page to provide details (ISBN, Title, Author). We will source the item and notify you of the price and availability within 48 hours."
    },
    {
      question: "Do you offer discounts for school partnerships?",
      answer: "Yes, Library BOUGDIM provides special pricing for schools and educational institutions. Please contact us through our 'Contact' page for more details."
    },
    {
      question: "What is your return policy?",
      answer: "Items can be returned within 7 days of delivery, provided they are in their original condition and packaging. Textbooks must be unmarked."
    },
    {
      question: "Do you provide bulk office supplies for companies?",
      answer: "Yes, we handle bulk orders for office supplies, stationery, and equipment. We can provide invoices (Factures) for your accounting needs."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSupportSubmit(event) {
    event.preventDefault();
    setSending(true);
    setNotice("");
    setError("");

    try {
      await api.post("/contact-messages", {
        type: "support",
        name: form.name,
        email: form.email,
        category: "support",
        subject: "New support request",
        message: form.message,
      });
      setNotice("Support request sent to support@bougdim.com.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send your support request.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="faq-page">
      <main className="faq-wrapper">
        <header className="faq-header">
          <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '2px', color: '#888' }}>
            HELP CENTER
          </span>
          <h1>Common Questions</h1>
          <p style={{ color: '#888' }}>Everything you need to know about Library BOUGDIM.</p>
        </header>

        <section className="faq-container">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            >
              <button className="faq-question" onClick={() => toggleFAQ(index)}>
                <h3>{faq.question}</h3>
                <span>+</span>
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </section>

        <div style={{ textAlign: 'center', marginTop: '60px', padding: '40px', background: '#f9f9f9', borderRadius: '15px' }}>
          <h3>Still have questions?</h3>
          <p style={{ color: '#666', margin: '15px 0' }}>We're here to help you find what you need.</p>
          <form onSubmit={handleSupportSubmit} style={{ display: "grid", gap: "14px", maxWidth: "560px", margin: "24px auto 0", textAlign: "left" }}>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ padding: "14px", border: "1px solid #eee", borderRadius: "10px" }}
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              style={{ padding: "14px", border: "1px solid #eee", borderRadius: "10px" }}
            />
            <textarea
              name="message"
              rows="4"
              placeholder="How can support help?"
              value={form.message}
              onChange={handleChange}
              required
              style={{ padding: "14px", border: "1px solid #eee", borderRadius: "10px", resize: "vertical" }}
            />
            {notice ? <p className="form-alert form-alert-success">{notice}</p> : null}
            {error ? <p className="form-alert form-alert-error">{error}</p> : null}
            <button type="submit" className="btn-send" disabled={sending}>
              {sending ? "Sending..." : "Contact Support"}
            </button>
          </form>
          <a href="mailto:support@bougdim.com" style={{ color: '#1a1a1a', fontWeight: '700', textDecoration: 'underline', display: "inline-block", marginTop: "18px" }}>
            support@bougdim.com
          </a>
        </div>
      </main>
    </div>
  );
}

export default FAQ;
