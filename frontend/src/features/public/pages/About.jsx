import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, MapPin, Phone, School, ShoppingBag } from "lucide-react";
import aboutBackground from "@/assets/background/background1.png";
import { useUiPreferences } from "@/shared/context/UIContext";

function About() {
  const { t } = useUiPreferences();
  return (
    <div className="about-page">
      <main className="about-wrapper">
        <section className="about-hero about-brand-hero">
          <div className="about-text about-hero-copy">
            <span className="eyebrow-label">{t("common.brandName")}</span>
            <h1>{t("aboutPage.title")}</h1>
            <p>{t("aboutPage.subtitle")}</p>
            <div className="about-hero-actions">
              <Link to="/products" className="home-btn home-btn-primary">
                {t("aboutPage.browseProducts")}
              </Link>
              <Link to="/special-order" className="home-btn home-btn-secondary">
                {t("aboutPage.specialOrder")}
              </Link>
            </div>
          </div>

          <div
            className="about-visual about-brand-panel"
            style={{ "--about-background-image": `url(${aboutBackground})` }}
            aria-label={t("aboutPage.overviewLabel")}
          />
        </section>

        <section className="about-story-band">
          <div>
            <span className="eyebrow-label">{t("aboutPage.whatWeDo")}</span>
            <h2>{t("aboutPage.storyTitle")}</h2>
          </div>
          <p>{t("aboutPage.storyCopy")}</p>
        </section>

        <section className="about-service-grid" aria-label={t("aboutPage.servicesLabel")}>
          <article>
            <BookOpen size={24} />
            <h3>{t("aboutPage.curatedCatalogue")}</h3>
            <p>{t("aboutPage.curatedCatalogueCopy")}</p>
          </article>
          <article>
            <School size={24} />
            <h3>{t("aboutPage.schoolSupport")}</h3>
            <p>{t("aboutPage.schoolSupportCopy")}</p>
          </article>
          <article>
            <ShoppingBag size={24} />
            <h3>{t("aboutPage.specialOrders")}</h3>
            <p>{t("aboutPage.specialOrdersCopy")}</p>
          </article>
        </section>

        <section className="contact-info-grid about-contact-grid">
          <div className="info-block">
            <MapPin size={20} />
            <h4>{t("aboutPage.location")}</h4>
            <p>El Aioun Sidi Mellouk<br />Oujda, Morocco</p>
          </div>
          <div className="info-block">
            <Phone size={20} />
            <h4>{t("aboutPage.contact")}</h4>
            <p>contact@bougdim.com<br />+212 566 66 66 66</p>
          </div>
          <div className="info-block">
            <Clock size={20} />
            <h4>{t("aboutPage.hours")}</h4>
            <p>Mon - Sun<br />09:00 - 19:00</p>
          </div>
        </section>

        <section className="about-map-section">
          <div className="about-map-head">
            <span className="eyebrow-label">{t("aboutPage.findUs")}</span>
            <h2>{t("aboutPage.visitTitle")}</h2>
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
              title={t("aboutPage.mapTitle")}
            ></iframe>
          </div>
        </section>
      </main>
    </div>
  );
}

export default About;
