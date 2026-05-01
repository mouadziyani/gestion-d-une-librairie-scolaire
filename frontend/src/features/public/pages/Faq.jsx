import { useState } from "react";
import { api } from "@/shared/services/api";
import { useUiPreferences } from "@/shared/context/UIContext";

function FAQ() {
  const { t, language } = useUiPreferences();
  const [activeIndex, setActiveIndex] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const faqs = {
    en: [
      { question: "How long does shipping take in Morocco?", answer: "For major cities like Oujda, Casablanca, and Rabat, shipping takes 24-48 hours. Other regions may take 3-5 business days via our partner carriers." },
      { question: "Can I place a special order for books not in stock?", answer: "Absolutely! Use our 'Special Order' page to provide details (ISBN, Title, Author). We will source the item and notify you of the price and availability within 48 hours." },
      { question: "Do you offer discounts for school partnerships?", answer: "Yes, Library BOUGDIM provides special pricing for schools and educational institutions. Please contact us through our 'Contact' page for more details." },
      { question: "What is your return policy?", answer: "Items can be returned within 7 days of delivery, provided they are in their original condition and packaging. Textbooks must be unmarked." },
      { question: "Do you provide bulk office supplies for companies?", answer: "Yes, we handle bulk orders for office supplies, stationery, and equipment. We can provide invoices for your accounting needs." },
    ],
    fr: [
      { question: "Quel est le délai de livraison au Maroc ?", answer: "Pour les grandes villes comme Oujda, Casablanca et Rabat, la livraison prend 24 à 48 heures. Les autres régions peuvent demander 3 à 5 jours ouvrables via nos transporteurs partenaires." },
      { question: "Puis-je faire une commande spéciale pour des livres non disponibles ?", answer: "Bien sûr ! Utilisez notre page de commande spéciale pour fournir les détails (ISBN, titre, auteur). Nous rechercherons l'article et vous informerons du prix et de la disponibilité sous 48 heures." },
      { question: "Proposez-vous des réductions pour les partenariats scolaires ?", answer: "Oui, Librairie BOUGDIM propose des tarifs spéciaux pour les écoles et établissements éducatifs. Veuillez nous contacter via la page Contact pour plus de détails." },
      { question: "Quelle est votre politique de retour ?", answer: "Les articles peuvent être retournés dans les 7 jours suivant la livraison, à condition d'être dans leur état et emballage d'origine. Les manuels scolaires ne doivent pas être annotés." },
      { question: "Fournissez-vous des fournitures de bureau en gros pour les entreprises ?", answer: "Oui, nous traitons les commandes en gros de fournitures de bureau, papeterie et équipements. Nous pouvons fournir des factures pour votre comptabilité." },
    ],
    ar: [
      { question: "كم تستغرق مدة الشحن داخل المغرب؟", answer: "في المدن الكبرى مثل وجدة والدار البيضاء والرباط، يستغرق الشحن من 24 إلى 48 ساعة. أما المناطق الأخرى فقد تستغرق من 3 إلى 5 أيام عمل عبر شركات النقل الشريكة." },
      { question: "هل يمكنني تقديم طلب خاص لكتب غير متوفرة في المخزون؟", answer: "بالتأكيد. استخدم صفحة الطلب الخاص وقدم التفاصيل مثل ISBN والعنوان والمؤلف، وسنوفر العنصر ونخبرك بالسعر والتوفر خلال 48 ساعة." },
      { question: "هل تقدمون تخفيضات للشراكات المدرسية؟", answer: "نعم، توفر مكتبة بوكديم أسعارًا خاصة للمدارس والمؤسسات التعليمية. يرجى التواصل معنا عبر صفحة الاتصال لمزيد من التفاصيل." },
      { question: "ما هي سياسة الإرجاع لديكم؟", answer: "يمكن إرجاع العناصر خلال 7 أيام من التسليم بشرط أن تكون في حالتها الأصلية وبغلافها الأصلي. يجب ألا تكون الكتب المدرسية عليها علامات أو كتابات." },
      { question: "هل توفرون لوازم مكتبية بالجملة للشركات؟", answer: "نعم، نعالج الطلبات الكبيرة الخاصة باللوازم المكتبية والقرطاسية والمعدات. كما يمكننا توفير فواتير لأغراض المحاسبة." },
    ],
  }[language] || [];

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
        subject: t("faqPage.supportSubject"),
        message: form.message,
      });
      setNotice(t("faqPage.supportNotice"));
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err?.response?.data?.message || t("faqPage.supportFailed"));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="faq-page">
      <main className="faq-wrapper">
        <header className="faq-header">
          <span className="faq-eyebrow">
            {t("faqPage.eyebrow")}
          </span>
          <h1>{t("faqPage.title")}</h1>
          <p className="faq-subtitle">{t("faqPage.subtitle")}</p>
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

        <div className="faq-support-card">
          <h3>{t("faqPage.stillQuestions")}</h3>
          <p className="faq-support-copy">{t("faqPage.supportCopy")}</p>
          <form onSubmit={handleSupportSubmit} className="faq-support-form">
            <input
              name="name"
              type="text"
              placeholder={t("faqPage.fullName")}
              value={form.name}
              onChange={handleChange}
              required
              className="faq-support-input"
            />
            <input
              name="email"
              type="email"
              placeholder={t("faqPage.emailAddress")}
              value={form.email}
              onChange={handleChange}
              required
              className="faq-support-input"
            />
            <textarea
              name="message"
              rows="4"
              placeholder={t("faqPage.supportPlaceholder")}
              value={form.message}
              onChange={handleChange}
              required
              className="faq-support-input faq-support-textarea"
            />
            {notice ? <p className="form-alert form-alert-success">{notice}</p> : null}
            {error ? <p className="form-alert form-alert-error">{error}</p> : null}
            <button type="submit" className="btn-send" disabled={sending}>
              {sending ? t("faqPage.sending") : t("faqPage.contactSupport")}
            </button>
          </form>
          <a href="mailto:support@bougdim.com" className="faq-support-link">
            support@bougdim.com
          </a>
        </div>
      </main>
    </div>
  );
}

export default FAQ;
