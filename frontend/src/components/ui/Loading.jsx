import logo from "@/assets/logo/library.png";
import { useUiPreferences } from "@/shared/context/UIContext";

function Loading({ forceVisible = false }) {
  const { t } = useUiPreferences();

  if (!forceVisible) {
    return null;
  }

  return (
    <div className="loading-overlay" role="status" aria-live="polite" aria-label={t("common.loading")}>
      <div className="loading-card">
        <div className="loading-mark">
          <img src={logo} alt={t("common.brandName")} />
        </div>
        <p className="loading-kicker">{t("common.brandName")}</p>
        <h1>{t("loading.preparing")}</h1>
        <div className="loading-bar-container">
          <div className="loading-bar-progress" />
        </div>
        <p className="loading-caption">{t("loading.caption")}</p>
      </div>
    </div>
  );
}

export default Loading;
