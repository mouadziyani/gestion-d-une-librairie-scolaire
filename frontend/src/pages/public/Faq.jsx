import React, { useState } from "react";

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

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
          <a href="/contact" style={{ color: '#1a1a1a', fontWeight: '700', textDecoration: 'underline' }}>
            Contact Support
          </a>
        </div>
      </main>
    </div>
  );
}

export default FAQ;