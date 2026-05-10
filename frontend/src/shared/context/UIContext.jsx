import { createContext, useContext, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES } from "@/i18n";

const UIContext = createContext(null);

function resolveLanguage(i18n) {
  const language = (i18n.resolvedLanguage || i18n.language || DEFAULT_LANGUAGE).split("-")[0];
  return SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;
}

export function UIProvider({ children }) {
  const { t, i18n } = useTranslation();
  const language = resolveLanguage(i18n);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    window.localStorage.removeItem("bougdim-theme");
  }, [language]);

  const value = useMemo(() => {
    const isArabic = language === "ar";

    return {
      language,
      direction: isArabic ? "rtl" : "ltr",
      isArabic,
      setLanguage: i18n.changeLanguage.bind(i18n),
      t,
      i18n,
    };
  }, [i18n, language, t]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUiPreferences() {
  const context = useContext(UIContext);

  if (!context) {
    throw new Error("useUiPreferences must be used within UIProvider");
  }

  return context;
}
