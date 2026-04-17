import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SEOHead } from "./SEOHead";
import { trackCTAClicked, trackHomepageView, trackHeroCTAClick, trackFrameworkCardClick } from "../utils/analytics";
import { useLanguage } from "../contexts/LanguageContext";

const FRAMEWORK_ICONS = [
  { key: "strengths", icon: "&#9733;", color: "#f59e0b" },
  { key: "personality", icon: "&#9632;", color: "#6366f1" },
  { key: "disc", icon: "&#9650;", color: "#e53e3e" },
  { key: "enneagram", icon: "&#9675;", color: "#10b981" },
];

export function HomePage() {
  const { t } = useTranslation();
  const { localizePath } = useLanguage();

  useEffect(() => {
    trackHomepageView();
  }, []);

  const handleHeroCTA = () => {
    trackHeroCTAClick(t("homepage.heroCta"));
    trackCTAClicked({ ctaText: t("homepage.heroCta"), ctaLocation: "intro_hero", pagePath: "/" });
  };

  const handleSecondaryCTA = () => {
    trackHeroCTAClick(t("homepage.heroCtaSecondary"));
    trackCTAClicked({ ctaText: t("homepage.heroCtaSecondary"), ctaLocation: "intro_hero", pagePath: "/" });
  };

  const handleFrameworkCardClick = (fw: string) => {
    trackFrameworkCardClick(fw);
  };

  const steps = [
    { number: "1", title: t("homepage.step1Title"), body: t("homepage.step1Body") },
    { number: "2", title: t("homepage.step2Title"), body: t("homepage.step2Body") },
    { number: "3", title: t("homepage.step3Title"), body: t("homepage.step3Body") },
  ];

  const freeFeatures = [
    t("homepage.comparisonFreeFeatures.f1"),
    t("homepage.comparisonFreeFeatures.f2"),
    t("homepage.comparisonFreeFeatures.f3"),
    t("homepage.comparisonFreeFeatures.f4"),
    t("homepage.comparisonFreeFeatures.f5"),
    t("homepage.comparisonFreeFeatures.f6"),
  ];

  const paidFeatures = [
    t("homepage.comparisonPaidFeatures.f1"),
    t("homepage.comparisonPaidFeatures.f2"),
    t("homepage.comparisonPaidFeatures.f3"),
    t("homepage.comparisonPaidFeatures.f4"),
    t("homepage.comparisonPaidFeatures.f5"),
    t("homepage.comparisonPaidFeatures.f6"),
  ];

  return (
    <div className="homepage">
      <SEOHead
        title={t("app.title")}
        description={t("app.description")}
        canonicalUrl="https://1test.me/"
      />

      <section className="hero">
        <h1 className="hero-headline">{t("homepage.heroHeadline")}</h1>
        <p className="hero-subtitle">{t("homepage.heroSubtitle")}</p>
        <div className="hero-ctas">
          <Link to={localizePath("/test")} className="btn-start hero-cta-primary" onClick={handleHeroCTA}>
            {t("homepage.heroCta")}
          </Link>
          <a href="#how-it-works" className="hero-cta-secondary" onClick={handleSecondaryCTA}>
            {t("homepage.heroCtaSecondary")}
          </a>
        </div>
        <div className="trust-bar">
          <span className="trust-item">&#9989; {t("homepage.trustFree")}</span>
          <span className="trust-item">&#128274; {t("homepage.trustPrivate")}</span>
          <span className="trust-item">&#127891; {t("homepage.trustResearch")}</span>
          <span className="trust-item">{t("homepage.trustFrameworks")}</span>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works">
        <h2 className="section-headline">{t("homepage.howItWorksHeadline")}</h2>
        <div className="steps">
          {steps.map((step) => (
            <div key={step.number} className="step">
              <span className="step-number">{step.number}</span>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-body">{step.body}</p>
            </div>
          ))}
        </div>
        <div className="section-cta">
          <Link to={localizePath("/test")} className="btn-start" onClick={handleHeroCTA}>
            {t("homepage.startCta")}
          </Link>
        </div>
      </section>

      <section className="framework-cards-section">
        <h2 className="section-headline">{t("homepage.frameworksHeadline")}</h2>
        <div className="framework-cards-grid">
          {FRAMEWORK_ICONS.map((fw) => (
            <div key={fw.key} className="fw-card" onClick={() => handleFrameworkCardClick(t(`homepage.${fw.key}Name`))} style={{ cursor: "pointer" }}>
              <span className="fw-card-icon" style={{ color: fw.color }} dangerouslySetInnerHTML={{ __html: fw.icon }} />
              <h3 className="fw-card-name">{t(`homepage.${fw.key}Name`)}</h3>
              <p className="fw-card-desc">{t(`homepage.${fw.key}Desc`)}</p>
            </div>
          ))}
        </div>
        <p className="framework-cards-footer">
          {t("homepage.frameworksFooter")}
        </p>
      </section>

      <section className="comparison-section">
        <h2 className="section-headline">{t("homepage.comparisonHeadline")}</h2>
        <div className="comparison-grid">
          <div className="comparison-col comparison-free">
            <h3 className="comparison-tier">{t("homepage.comparisonFree")}</h3>
            <ul className="comparison-features">
              {freeFeatures.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <Link to={localizePath("/test")} className="btn-start comparison-cta" onClick={handleHeroCTA}>
              {t("homepage.comparisonFreeCta")}
            </Link>
          </div>
          <div className="comparison-col comparison-paid">
            <span className="comparison-badge">{t("homepage.comparisonBadge")}</span>
            <h3 className="comparison-tier">{t("homepage.comparisonPaid")}</h3>
            <p className="comparison-paid-note">{t("homepage.comparisonPaidNote")}</p>
            <ul className="comparison-features">
              {paidFeatures.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <Link to={localizePath("/pricing")} className="btn-start comparison-cta" onClick={() => trackCTAClicked({ ctaText: t("homepage.comparisonPaidCta"), ctaLocation: "intro_hero", pagePath: "/" })}>
              {t("homepage.comparisonPaidCta")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}