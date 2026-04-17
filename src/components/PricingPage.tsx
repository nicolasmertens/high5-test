import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SEOHead } from "./SEOHead";
import { useLanguage } from "../contexts/LanguageContext";
import { buildFAQSchema } from "./SEOHead";

const TIER_KEYS = ["free", "fullProfile", "aiPlaybook", "team"] as const;

const TIER_FEATURE_KEYS: Record<string, string[]> = {
  free: ["f1", "f2", "f3", "f4", "f5", "f6"],
  fullProfile: ["f1", "f2", "f3", "f4", "f5", "f6"],
  aiPlaybook: ["f1", "f2", "f3", "f4", "f5"],
  team: ["f1", "f2", "f3", "f4", "f5", "f6"],
};

const TIER_META: Record<string, { price: string; highlight: boolean; comingSoon?: boolean }> = {
  free: { price: "$0", highlight: false },
  fullProfile: { price: "$12", highlight: true },
  aiPlaybook: { price: "$19", highlight: false },
  team: { price: "$29", highlight: false, comingSoon: true },
};

const FAQ_KEYS = [
  "freeReal",
  "resultsQuality",
  "paidDifference",
  "dataPrivacy",
  "frameworkDifference",
  "teamPlan",
  "retake",
] as const;

export function PricingPage() {
  const { t } = useTranslation();
  const { localizePath } = useLanguage();

  const faqs = FAQ_KEYS.map((key) => ({
    question: t(`pricing.faq.${key}Title`),
    answer: t(`pricing.faq.${key}Answer`),
  }));

  return (
    <div className="pricing">
      <SEOHead
        title={t("pricing.pageTitle")}
        description={t("pricing.pageDescription")}
        canonicalUrl="https://1test.me/pricing"
        jsonLd={[buildFAQSchema(faqs)]}
      />

      <header className="pricing-header">
        <h1>{t("pricing.headline")}</h1>
        <p>{t("pricing.subtitle")}</p>
      </header>

      <div className="pricing-grid">
        {TIER_KEYS.map((tierKey) => {
          const meta = TIER_META[tierKey];
          const featureKeys = TIER_FEATURE_KEYS[tierKey];
          return (
            <div
              key={tierKey}
              className={`pricing-card ${meta.highlight ? "pricing-card-highlight" : ""}`}
            >
              {meta.highlight && (
                <span className="pricing-badge">{t("homepage.comparisonBadge")}</span>
              )}
              {meta.comingSoon && (
                <span className="pricing-badge pricing-badge-soon">{t("pricing.tiers.team.badge")}</span>
              )}
              <h2 className="pricing-tier-name">{t(`pricing.tiers.${tierKey}.name`)}</h2>
              <div className="pricing-price">
                {t(`pricing.tiers.${tierKey}.price`)}
                {meta.price !== "$0" && (
                  <span className="pricing-period">
                    {tierKey === "team" ? t("pricing.tiers.team.period") : "one-time"}
                  </span>
                )}
              </div>
              <p className="pricing-description">{t(`pricing.tiers.${tierKey}.description`)}</p>
              <ul className="pricing-features">
                {featureKeys.map((fKey) => (
                  <li key={fKey}>{t(`pricing.tiers.${tierKey}.features.${fKey}`)}</li>
                ))}
              </ul>
              <Link to={localizePath("/test")} className="btn-start pricing-cta">
                {t(`pricing.tiers.${tierKey}.cta`)}
              </Link>
            </div>
          );
        })}
      </div>

      <section className="pricing-faq">
        <h2>Frequently Asked Questions</h2>
        {faqs.map((faq, i) => (
          <details key={i} className="pricing-faq-item">
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </section>
    </div>
  );
}