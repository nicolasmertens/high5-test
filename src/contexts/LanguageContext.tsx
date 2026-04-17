import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import i18n, { type Language, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, LANGUAGE_PATHS, LANGUAGE_NAMES } from "../i18n";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  localizePath: (path: string) => string;
  languageNames: Record<Language, string>;
  supportedLanguages: readonly Language[];
}

export const LanguageContext = createContext<LanguageContextType>({
  lang: DEFAULT_LANGUAGE,
  setLang: () => {},
  localizePath: (p) => p,
  languageNames: LANGUAGE_NAMES,
  supportedLanguages: SUPPORTED_LANGUAGES,
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function detectLanguageFromPath(pathname: string): Language {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0) {
    const first = segments[0];
    if (SUPPORTED_LANGUAGES.includes(first as Language) && first !== "en") {
      return first as Language;
    }
  }
  return DEFAULT_LANGUAGE;
}

export function getLanguageAndBasename(): { lang: Language; basename: string } {
  const lang = detectLanguageFromPath(window.location.pathname);
  const basename = LANGUAGE_PATHS[lang];
  return { lang, basename };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => detectLanguageFromPath(window.location.pathname));

  useEffect(() => {
    const currentPath = window.location.pathname;
    const detectedLang = detectLanguageFromPath(currentPath);
    if (detectedLang !== lang) {
      setLangState(detectedLang);
    }
  }, []);

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
    try {
      localStorage.setItem("1test_language", lang);
    } catch {
      // localStorage unavailable
    }

    if (typeof window !== "undefined") {
      try {
        const w = window as unknown as Record<string, Record<string, (...args: unknown[]) => void>>;
        if (w.posthog?.capture) {
          w.posthog.capture("$set", { language: lang });
        }
      } catch {
        // PostHog not initialized
      }
    }
  }, [lang]);

  const setLang = useCallback((newLang: Language) => {
    const currentPath = window.location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/(de|fr)(\/|$)/, "/");
    const newPath = newLang === "en"
      ? pathWithoutLang || "/"
      : `/${newLang}${pathWithoutLang === "/" ? "" : pathWithoutLang}`;
    i18n.changeLanguage(newLang);
    try {
      localStorage.setItem("1test_language", newLang);
    } catch {
      // localStorage unavailable
    }
    window.location.href = newPath;
  }, []);

  const localizePath = useCallback((path: string): string => path, []);

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        localizePath,
        languageNames: LANGUAGE_NAMES,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}