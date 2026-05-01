import { useState } from "react";
import { api } from "@/shared/services/api";
import { useUiPreferences } from "@/shared/context/UIContext";

function Contact() {
  const { t } = useUiPreferences();
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
        subject: t("contactPage.contactSubject"),
        message: form.message,
      });
      setNotice(t("contactPage.sentNotice"));
      setForm({ name: "", email: "", category: "general", message: "" });
    } catch (err) {
      setError(err?.response?.data?.message || t("contactPage.failedSend"));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page">
      <main className="contact-wrapper">
        
        <section className="contact-info-side">
          <span className="contact-eyebrow">
            {t("contactPage.eyebrow")}
          </span>
          <h1>{t("contactPage.title")}</h1>
          <p className="contact-subtitle">{t("contactPage.subtitle")}</p>

          <div className="contact-details">
            <div className="contact-item">
              <h4>{t("contactPage.emailUs")}</h4>
              <p><a href="mailto:contact@bougdim.com">contact@bougdim.com</a></p>
            </div>
            <div className="contact-item">
              <h4>{t("contactPage.visitUs")}</h4>
              <p>El Aïoun Sidi Mellouk <br /> Morocco</p>
            </div>
            <div className="contact-item">
              <h4>{t("contactPage.callUs")}</h4>
              <p>+212 536 66 66 66</p>
            </div>
          </div>
        </section>

        
        <section className="contact-form-side">
          <div className="contact-form-card">
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input name="name" type="text" placeholder={t("contactPage.fullName")} value={form.name} onChange={handleChange} required />
              </div>
              
              <div className="input-group">
                <input name="email" type="email" placeholder={t("contactPage.emailAddress")} value={form.email} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <select name="category" value={form.category} onChange={handleChange} className="contact-category-select">
                  <option value="general">{t("contactPage.generalInquiry")}</option>
                  <option value="order">{t("contactPage.orderSupport")}</option>
                  <option value="school">{t("contactPage.schoolPartnership")}</option>
                  <option value="other">{t("contactPage.other")}</option>
                </select>
              </div>

              <div className="input-group">
                <textarea name="message" rows="4" placeholder={t("contactPage.helpPlaceholder")} value={form.message} onChange={handleChange} required></textarea>
              </div>

              {notice ? <p className="form-alert form-alert-success">{notice}</p> : null}
              {error ? <p className="form-alert form-alert-error">{error}</p> : null}

              <button type="submit" className="btn-send" disabled={sending}>
                {sending ? t("contactPage.sending") : t("contactPage.sendMessage")}
              </button>
            </form>
          </div>
        </section>

      </main>
    </div>
  );
}

export default Contact;
