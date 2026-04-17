import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import { LogoIcon } from "./LogoIcon";

export function Footer() {
  const { t } = useTranslation();
  const { localizePath } = useLanguage();

  const tests = [
    { label: t("footerTests.personalities"), to: "/free-personality-test" },
    { label: t("footerTests.disc"), to: "/free-disc-test" },
    { label: t("footerTests.enneagram"), to: "/free-enneagram-test" },
    { label: t("footerTests.strengths"), to: "/free-strengths-test" },
  ];

  const learn = [
    { label: t("footer.pricing"), to: "/pricing" },
    { label: t("footer.blog"), to: "/blog" },
    { label: t("footer.home"), to: "/" },
  ];

  const legal = [
    { label: t("footer.privacy"), to: "/privacy" },
    { label: t("footer.terms"), to: "/terms" },
  ];

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <LogoIcon size={24} className="footer-logo" />
        <span className="footer-name">1Test</span>
      </div>

      <nav className="footer-links">
        <div className="footer-col">
          <h4 className="footer-heading">{t("footer.testsHeading")}</h4>
          {tests.map((t_item) => (
            <Link key={t_item.to} to={localizePath(t_item.to)} className="footer-link">
              {t_item.label}
            </Link>
          ))}
        </div>
        <div className="footer-col">
          <h4 className="footer-heading">{t("footer.learnHeading")}</h4>
          {learn.map((l) => (
            <Link key={l.to} to={localizePath(l.to)} className="footer-link">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="footer-col">
          <h4 className="footer-heading">{t("footer.legalHeading")}</h4>
          {legal.map((l) => (
            <Link key={l.to} to={localizePath(l.to)} className="footer-link">
              {l.label}
            </Link>
          ))}
        </div>
      </nav>

      <p className="footer-copy">
        &copy; {new Date().getFullYear()} 1Test. All rights reserved.
      </p>
    </footer>
  );
}