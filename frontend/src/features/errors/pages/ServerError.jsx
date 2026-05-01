import React from "react";
import { Link } from "react-router-dom";
import { useUiPreferences } from "@/shared/context/UIContext";

function ServerError() {
  const { t } = useUiPreferences();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="server-error-wrapper">
      <div className="server-error-card">
        <span className="error-icon">⚙️</span>
        <span className="error-page-eyebrow error-page-eyebrow-danger">{t("errorPages.serverEyebrow")}</span>
        <h1>{t("errorPages.serverTitle")}</h1>
        <p>{t("errorPages.serverDescription")}</p>

        <div className="refresh-container">
          <button onClick={handleRefresh} className="btn-refresh">
            {t("errorPages.tryRefreshing")}
          </button>
          <Link to="/" className="btn-support">
            {t("errorPages.backToSafety")}
          </Link>
        </div>

        <div className="error-page-note">
          <p className="error-page-note-copy">{t("errorPages.serverNote")}</p>
        </div>
      </div>
    </div>
  );
}

export default ServerError;
