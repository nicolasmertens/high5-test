import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { frameworkContent } from "../data/landing-content";
import { trackTestStarted, trackCTAClicked } from "../utils/analytics";
import { SEOHead, buildFAQSchema } from "./SEOHead";
import { useLanguage } from "../contexts/LanguageContext";

interface Props {
  framework: string;
}

const FRAMEWORK_COLORS: Record<string, string> = {
  disc: "#ef4444",
  enneagram: "#10b981",
  personality: "#8b5cf6",
  strengths: "#f59e0b",
  "disc-test": "#ef4444",
  "enneagram-test": "#10b981",
  "16personalities-test": "#8b5cf6",
  "strengths-test": "#f59e0b",
};

const FRAMEWORK_ICONS: Record<string, string> = {
  disc: "\u25C6",
  enneagram: "\u25CE",
  personality: "\u25A0",
  strengths: "\u2605",
  "disc-test": "\u25C6",
  "enneagram-test": "\u25CE",
  "16personalities-test": "\u25A0",
  "strengths-test": "\u2605",
};

const FRAMEWORK_LANDING_KEYS: Record<string, string> = {
  disc: "disc",
  enneagram: "enneagram",
  personality: "personality",
  strengths: "strengths",
  "disc-test": "disc-test",
  "enneagram-test": "enneagram-test",
  "16personalities-test": "16personalities-test",
  "strengths-test": "strengths-test",
};

export function LandingPage({ framework }: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { localizePath } = useLanguage();
  const fw = frameworkContent[framework];
  const landingKey = FRAMEWORK_LANDING_KEYS[framework];

  const handleCTA = useCallback((location: "landing_hero" | "landing_bottom") => {
    trackTestStarted(
      framework as "disc" | "personality" | "enneagram" | "strengths",
      `/free-${framework}-test`
    );
    trackCTAClicked({
      ctaText: location === "landing_hero" ? t(`landing.${landingKey}.cta`) : t(`landing.${landingKey}.cta`),
      ctaLocation: location,
      pagePath: `/free-${framework}-test`,
    });
    navigate(localizePath("/test"));
  }, [framework, landingKey, localizePath, navigate, t]);

  if (!fw) {
    navigate(localizePath("/test"));
    return null;
  }

  const faqSchema = buildFAQSchema(fw.faqs);

  return (
    <div className="landing">
      <SEOHead
        title={t(`landing.${landingKey}.title`)}
        description={t(`landing.${landingKey}.description`)}
        canonicalUrl={fw.canonicalUrl}
        jsonLd={[faqSchema]}
      />

      <div className="landing-hero">
        <span
          className="landing-icon"
          style={{ color: FRAMEWORK_COLORS[framework] }}
        >
          {FRAMEWORK_ICONS[framework]}
        </span>
        <h1>{t(`landing.${landingKey}.headline`)}</h1>
        <div className="landing-tagline">
          <p>{t(`landing.${landingKey}.subtitle`)}</p>
        </div>
        <div className="trust-bar">
          <span className="trust-item">{t("intro.trustFree")}</span>
          <span className="trust-item-sep">&middot;</span>
          <span className="trust-item">{t("intro.trustPrivate")}</span>
          <span className="trust-item-sep">&middot;</span>
          <span className="trust-item">{t("intro.trustResearch")}</span>
        </div>
        <button className="btn-start" onClick={() => handleCTA("landing_hero")}>
          {t(`landing.${landingKey}.cta`)} &rarr;
        </button>
      </div>

      {fw.sections.map((section, i) => (
        <section key={i} className="landing-section">
          <h2>{section.heading}</h2>
          <div
            className="content-html"
            dangerouslySetInnerHTML={{ __html: section.html }}
          />
        </section>
      ))}

      <section className="landing-section">
        <h2>Frequently Asked Questions</h2>
        <div className="landing-faqs">
          {fw.faqs.map((faq) => (
            <details key={faq.question} className="landing-faq">
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="landing-cta">
        <h2>Ready to discover your {fw.name.toLowerCase()}?</h2>
        <p>{t("intro.subtitle")}</p>
        <button className="btn-start" onClick={() => handleCTA("landing_bottom")}>
          {t(`landing.${landingKey}.cta`)} &rarr;
        </button>
      </div>

      <div className="landing-crosslinks">
        <p className="landing-crosslinks-label">
          {t("homepage.frameworksFooter")}
        </p>
        <div className="landing-crosslinks-grid">
          {fw.crossLinks.map((link) => (
            <a
              key={link.url}
              href={localizePath(link.url)}
              className="landing-crosslink-card"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <p className="intro-credit">
        {t("intro.creditPrefix")}{" "}
        <a href="https://ipip.ori.org/" target="_blank" rel="noopener">
          {t("intro.creditLink")}
        </a>
        {t("intro.creditSuffix")}{" "}
        <a href={localizePath("/privacy")}>{t("intro.privacy")}</a> &middot; <a href={localizePath("/terms")}>{t("intro.terms")}</a>
      </p>
    </div>
  );
}