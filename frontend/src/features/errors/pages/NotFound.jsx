import React from "react";
import { Link } from "react-router-dom";
import { useUiPreferences } from "@/shared/context/UIContext";

function NotFound() {
  const { t } = useUiPreferences();

  return (
    <div className="error-page-wrapper">
      <div className="error-code">404</div>

      <div className="error-content">
        <span className="error-page-eyebrow">{t("errorPages.notFoundEyebrow")}</span>
        <h2>{t("errorPages.notFoundTitle")}</h2>
        <p>{t("errorPages.notFoundDescription")}</p>

        <Link to="/" className="btn-back-home">
          {t("errorPages.returnHome")}
        </Link>
      </div>

      <div className="error-page-meta">{t("errorPages.footerLocation")}</div>
    </div>
  );
}

export default NotFound;
