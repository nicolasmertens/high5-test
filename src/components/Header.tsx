import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import { trackCTAClicked } from "../utils/analytics";
import type { Language } from "../i18n";
import { LogoIcon } from "./LogoIcon";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const { lang, setLang, localizePath, languageNames, supportedLanguages } = useLanguage();

  const navLinks = [
    { label: t("nav.takeTest"), to: "/test" },
    { label: t("nav.pricing"), to: "/pricing" },
    { label: t("nav.blog"), to: "/blog" },
  ];

  const handleNavClick = (label: string) => {
    trackCTAClicked({ ctaText: label, ctaLocation: "intro_hero", pagePath: location.pathname });
    setMenuOpen(false);
  };

  const handleLangSwitch = (newLang: Language) => {
    setLangOpen(false);
    setMenuOpen(false);
    setLang(newLang);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to={localizePath("/")} className="header-logo" onClick={() => handleNavClick("Logo")}>
          <LogoIcon size={22} className="header-logo-icon" />
          <span className="header-logo-text">1Test</span>
        </Link>

        <nav className={`header-nav ${menuOpen ? "header-nav-open" : ""}`}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={localizePath(link.to)}
              className={`header-nav-link ${location.pathname === localizePath(link.to) ? "header-nav-active" : ""}`}
              onClick={() => handleNavClick(link.label)}
            >
              {link.label}
            </Link>
          ))}
          <div className="header-lang-switcher">
            <button
              className="lang-switcher-btn"
              onClick={() => setLangOpen(!langOpen)}
              aria-label={t("header.toggleNav")}
            >
              {languageNames[lang]}
            </button>
            {langOpen && (
              <div className="lang-switcher-dropdown">
                {supportedLanguages.filter((l) => l !== lang).map((l) => (
                  <button
                    key={l}
                    className="lang-switcher-option"
                    onClick={() => handleLangSwitch(l as Language)}
                  >
                    {languageNames[l as Language]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        <button
          className={`header-hamburger ${menuOpen ? "header-hamburger-open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={t("header.toggleNav")}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </div>
    </header>
  );
}