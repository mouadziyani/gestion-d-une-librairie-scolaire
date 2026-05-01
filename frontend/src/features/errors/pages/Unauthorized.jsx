import React from "react";
import { Link } from "react-router-dom";
import { useUiPreferences } from "@/shared/context/UIContext";

function Unauthorized() {
  const { t } = useUiPreferences();

  return (
    <div className="unauthorized-wrapper">
      <div className="unauthorized-card">
        <span className="lock-icon">🔒</span>
        <span className="error-page-eyebrow">{t("errorPages.unauthorizedEyebrow")}</span>
        <h1>{t("errorPages.unauthorizedTitle")}</h1>
        <p>{t("errorPages.unauthorizedDescription")}</p>

        <Link to="/" className="btn-restricted">
          {t("errorPages.returnPublic")}
        </Link>

        <div className="error-page-footer-link">
          <Link to="/login" className="error-page-inline-link">
            {t("errorPages.loginAdmin")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
