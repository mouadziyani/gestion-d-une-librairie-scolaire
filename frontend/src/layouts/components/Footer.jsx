import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/logo/library.png";
import { getSitePreferences } from "@/shared/services/sitePreferencesService";

function Footer() {
  const [preferences, setPreferences] = useState(() => getSitePreferences());

  useEffect(() => {
    function handlePreferencesChange() {
      setPreferences(getSitePreferences());
    }

    window.addEventListener("bougdim:site-preferences-changed", handlePreferencesChange);

    return () => {
      window.removeEventListener("bougdim:site-preferences-changed", handlePreferencesChange);
    };
  }, []);

  const footer = preferences.footer || {};
  const general = preferences.general || {};
  const publicPages = footer.publicPages || {};
  const columnLabels = footer.columnLabels || {};

  const pageLinks = [
    { key: "home", label: "Home", to: "/" },
    { key: "products", label: "All Products", to: "/products" },
    { key: "categories", label: "Categories", to: "/categories" },
    { key: "specialOrder", label: "Special Requests", to: "/special-order" },
    { key: "about", label: "Our Story", to: "/about" },
    { key: "contact", label: "Contact Us", to: "/contact" },
    { key: "support", label: "FAQ", to: "/faq" },
    { key: "login", label: "Client Login", to: "/login" },
  ].filter((item) => publicPages[item.key] !== false);

  const exploreLinks = pageLinks.filter((item) => ["home", "products", "categories", "specialOrder", "about"].includes(item.key));
  const supportLinks = pageLinks.filter((item) => ["contact", "support", "login"].includes(item.key));

  if (footer.enabled === false) {
    return null;
  }

  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-brand">
          <Link to="/" className="footer-logo-link" aria-label="Go to home">
            <img src={logo} alt="Library BOUGDIM" />
          </Link>
          <h3>{footer.brandTitle || general.storeName || "Library BOUGDIM"}</h3>
          <p>
            {footer.brandDescription ||
              "Your trusted library for school books, scientific equipment, and office supplies. Empowering education since 2026."}
          </p>
        </div>

        <div className="footer-links-grid">
          {footer.columns?.explore !== false ? (
            <div className="footer-col">
              <h4>{columnLabels.explore || "Explore"}</h4>
              <ul>
                {exploreLinks.map((item) => (
                  <li key={item.key}>
                    <Link to={item.to}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {footer.columns?.support !== false ? (
            <div className="footer-col">
              <h4>{columnLabels.support || "Support"}</h4>
              <ul>
                {supportLinks.map((item) => (
                  <li key={item.key}>
                    <Link to={item.to}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {footer.columns?.office !== false ? (
            <div className="footer-col footer-office">
              <h4>{columnLabels.office || "Office"}</h4>
              <ul className="contact-list">
                <li>
                  <MapPin size={16} />
                  <span>{general.address || "BD HASSAN II NR 07, ELAIOUN SIDI MELLOUK"}</span>
                </li>
                <li>
                  <Phone size={16} />
                  <span>{general.phone || "+212 536 66 66 66"}</span>
                </li>
                <li>
                  <Mail size={16} />
                  <span>{general.email || "contact@bougdim.com"}</span>
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 {general.storeName || "Library BOUGDIM"}. All rights reserved.</p>
        <p>
          Created by{" "}
          <a
            href="https://www.mouadziyani.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="creator-link"
          >
            Mouad Ziyani
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
