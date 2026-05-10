import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import enCommon from "@/i18n/locales/en/common.json";
import frCommon from "@/i18n/locales/fr/common.json";
import arCommon from "@/i18n/locales/ar/common.json";

export const LANGUAGE_STORAGE_KEY = "bougdim-language";
export const DEFAULT_LANGUAGE = "en";
export const SUPPORTED_LANGUAGES = ["en", "fr", "ar"];

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

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { common: enCommon },
        fr: { common: frCommon },
        ar: { common: arCommon },
      },
      fallbackLng: DEFAULT_LANGUAGE,
      supportedLngs: SUPPORTED_LANGUAGES,
      ns: ["common"],
      defaultNS: "common",
      load: "languageOnly",
      cleanCode: true,
      nonExplicitSupportedLngs: true,
      interpolation: {
        escapeValue: false,
        prefix: "{",
        suffix: "}",
      },
      detection: {
        order: ["localStorage", "navigator"],
        lookupLocalStorage: LANGUAGE_STORAGE_KEY,
        caches: ["localStorage"],
      },
      returnNull: false,
    });
}

applyDocumentPreferences(i18n.resolvedLanguage || DEFAULT_LANGUAGE);
i18n.on("languageChanged", applyDocumentPreferences);

export default i18n;
