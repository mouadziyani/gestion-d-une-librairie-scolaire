import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/logo/library.png";
import { getSitePreferences } from "@/shared/services/sitePreferencesService";
import { useUiPreferences } from "@/shared/context/UIContext";
import arCommon from "@/i18n/locales/ar/common.json";
import enCommon from "@/i18n/locales/en/common.json";
import frCommon from "@/i18n/locales/fr/common.json";

const DEFAULT_STORE_NAMES = new Set([
  enCommon.common.brandName,
  frCommon.common.brandName,
  arCommon.common.brandName,
]);
const DEFAULT_FOOTER_DESCRIPTIONS = new Set([
  enCommon.footer.brandDescription,
  frCommon.footer.brandDescription,
  arCommon.footer.brandDescription,
]);
const DEFAULT_FOOTER_COLUMN_LABELS = {
  explore: new Set([enCommon.footer.explore, frCommon.footer.explore, arCommon.footer.explore]),
  support: new Set([enCommon.footer.support, frCommon.footer.support, arCommon.footer.support]),
  office: new Set([enCommon.footer.office, frCommon.footer.office, arCommon.footer.office]),
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
