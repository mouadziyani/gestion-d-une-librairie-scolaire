import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/logo/library.png";
import { getSitePreferences } from "@/shared/services/sitePreferencesService";
import { useUiPreferences } from "@/shared/context/UIContext";
import ar from "@/translations/ar";
import en from "@/translations/en";
import fr from "@/translations/fr";

const DEFAULT_STORE_NAMES = new Set(["Library BOUGDIM", "Librairie BOUGDIM", "مكتبة بوكديم"]);
const DEFAULT_FOOTER_DESCRIPTIONS = new Set([
  en.footer.brandDescription,
  fr.footer.brandDescription,
  ar.footer.brandDescription,
]);
const DEFAULT_FOOTER_COLUMN_LABELS = {
  explore: new Set([en.footer.explore, fr.footer.explore, ar.footer.explore]),
  support: new Set([en.footer.support, fr.footer.support, ar.footer.support]),
  office: new Set([en.footer.office, fr.footer.office, ar.footer.office]),
};

function resolveFooterCopy(value, fallback, defaults) {
  if (!value || defaults.has(value)) {
    return fallback;
  }

  return value;
}

function Footer() {
  const [preferences, setPreferences] = useState(() => getSitePreferences());
  const { t } = useUiPreferences();

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
  const resolvedBrandName =
    general.storeName && !DEFAULT_STORE_NAMES.has(general.storeName)
      ? general.storeName
      : t("common.brandName");
  const resolvedFooterBrandTitle =
    footer.brandTitle && !DEFAULT_STORE_NAMES.has(footer.brandTitle)
      ? footer.brandTitle
      : resolvedBrandName;
  const resolvedFooterDescription = resolveFooterCopy(
    footer.brandDescription,
    t("footer.brandDescription"),
    DEFAULT_FOOTER_DESCRIPTIONS,
  );
  const resolvedColumnLabels = {
    explore: resolveFooterCopy(
      columnLabels.explore,
      t("footer.explore"),
      DEFAULT_FOOTER_COLUMN_LABELS.explore,
    ),
    support: resolveFooterCopy(
      columnLabels.support,
      t("footer.support"),
      DEFAULT_FOOTER_COLUMN_LABELS.support,
    ),
    office: resolveFooterCopy(
      columnLabels.office,
      t("footer.office"),
      DEFAULT_FOOTER_COLUMN_LABELS.office,
    ),
  };

  const pageLinks = [
    { key: "home", label: t("footer.home"), to: "/" },
    { key: "products", label: t("footer.allProducts"), to: "/products" },
    { key: "categories", label: t("footer.categories"), to: "/categories" },
    { key: "specialOrder", label: t("footer.specialRequests"), to: "/special-order" },
    { key: "about", label: t("footer.ourStory"), to: "/about" },
    { key: "contact", label: t("footer.contactUs"), to: "/contact" },
    { key: "support", label: t("footer.faq"), to: "/faq" },
    { key: "login", label: t("footer.clientLogin"), to: "/login" },
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
          <Link to="/" className="footer-logo-link" aria-label={t("navbar.goHome")}>
            <img src={logo} alt={t("common.brandName")} />
          </Link>
          <h3>{resolvedFooterBrandTitle}</h3>
          <p>{resolvedFooterDescription}</p>
        </div>

        <div className="footer-links-grid">
          {footer.columns?.explore !== false ? (
            <div className="footer-col">
              <h4>{resolvedColumnLabels.explore}</h4>
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
              <h4>{resolvedColumnLabels.support}</h4>
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
              <h4>{resolvedColumnLabels.office}</h4>
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
        <p>© 2026 {resolvedBrandName}. {t("footer.rightsReserved")}</p>
        <p>
          {t("footer.createdBy")}{" "}
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
