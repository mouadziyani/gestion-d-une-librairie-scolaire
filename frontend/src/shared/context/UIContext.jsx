import { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "@/translations/en";
import fr from "@/translations/fr";
import ar from "@/translations/ar";

const UIContext = createContext(null);

const LANGUAGE_STORAGE_KEY = "bougdim-language";
const DEFAULT_LANGUAGE = "en";
const translations = { en, fr, ar };

function readStoredLanguage() {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return storedLanguage === "fr" || storedLanguage === "ar" || storedLanguage === "en"
    ? storedLanguage
    : DEFAULT_LANGUAGE;
}

function getTranslationValue(language, key) {
  return key.split(".").reduce((value, segment) => value?.[segment], translations[language]);
}

function interpolate(template, replacements = {}) {
  return Object.entries(replacements).reduce((message, [token, value]) => {
    return message.replaceAll(`{${token}}`, String(value));
  }, template);
}

function applyDocumentPreferences(language) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.classList.remove("dark");
  root.setAttribute("data-theme", "light");
  root.setAttribute("lang", language);
  root.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
}

export function UIProvider({ children }) {
  const [language, setLanguage] = useState(readStoredLanguage);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    window.localStorage.removeItem("bougdim-theme");
    applyDocumentPreferences(language);
  }, [language]);

  const value = useMemo(() => {
    const isArabic = language === "ar";

    return {
      language,
      direction: isArabic ? "rtl" : "ltr",
      isArabic,
      setLanguage,
      t(key, replacements) {
        const translated =
          getTranslationValue(language, key) ??
          getTranslationValue(DEFAULT_LANGUAGE, key) ??
          key;

        return typeof translated === "string" ? interpolate(translated, replacements) : translated;
      },
    };
  }, [language]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUiPreferences() {
  const context = useContext(UIContext);

  if (!context) {
    throw new Error("useUiPreferences must be used within UIProvider");
  }

  return context;
}
