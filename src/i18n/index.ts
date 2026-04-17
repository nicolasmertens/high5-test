import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import de from "./locales/de.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import pt from "./locales/pt.json";

export const SUPPORTED_LANGUAGES = ["en", "de", "fr", "es", "pt"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = "en";

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  pt: "Português",
};

export const LANGUAGE_PATHS: Record<Language, string> = {
  en: "",
  de: "/de",
  fr: "/fr",
  es: "/es",
  pt: "/pt",
};

const SAVED_LANGUAGE_KEY = "1test_language";

function detectLanguage(): string {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;

  const pathLang = window.location.pathname.split("/").filter(Boolean)[0];
  if (SUPPORTED_LANGUAGES.includes(pathLang as Language) && pathLang !== "en") {
    return pathLang;
  }

  try {
    const saved = localStorage.getItem(SAVED_LANGUAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.includes(saved as Language)) {
      return saved;
    }
  } catch {
    // localStorage unavailable
  }

  const browserLang = navigator.language.split("-")[0];
  if (SUPPORTED_LANGUAGES.includes(browserLang as Language)) {
    return browserLang;
  }

  return DEFAULT_LANGUAGE;
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
    fr: { translation: fr },
    es: { translation: es },
    pt: { translation: pt },
  },
  lng: detectLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;