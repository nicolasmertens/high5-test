import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { usePayment } from "../contexts/PaymentContext";
import { trackCheckoutStarted, trackCTAClicked, trackUpsellClick, trackUpsellView, trackNurtureEnroll } from "../utils/analytics";
import { useABTest } from "../hooks/useABTest";

type Tier = "full_profile" | "ai_playbook" | "team_monthly";

const NURTURE_EMAIL_KEY = "1test_nurture_email";
const NURTURE_ENROLLED_KEY = "1test_nurture_enrolled";

interface TierInfo {
  id: Tier;
  name: string;
  price: string;
  description: string;
  features: string[];
  mode: "payment" | "subscription";
}

const TIERS: TierInfo[] = [
  {
    id: "full_profile",
    name: "Full Profile",
    price: "$12",
    description: "All 20 strengths ranked + detailed personality type, DISC profile, Enneagram with wing & tritype, career paths, and growth insights.",
    features: [
      "All 20 strengths ranked with detailed insights",
      "Full personality type breakdown with dimension scores",
      "Complete DISC profile with traits and communication tips",
      "Enneagram wing, tritype, and stress/growth patterns",
      "Career paths, book recommendations, stress patterns",
      "Unified profile combining all four frameworks",
    ],
    mode: "payment",
  },
  {
    id: "ai_playbook",
    name: "AI Playbook",
    price: "$19",
    description: "Personalized career paths, growth plan, book recommendations, and communication guide — AI-generated per your profile.",
    features: [
      "Career paths matched to your unique profile",
      "Personalized growth plan with actionable steps",
      "Book and course recommendations per your strengths",
      "Communication guide based on your personality type",
      "Includes everything in the Full Profile",
    ],
    mode: "payment",
  },
];

export function UpgradePrompt({ variant }: { variant: "full" | "teaser" }) {
  const { t } = useTranslation();
  const { isLoading } = usePayment();
  const [redirecting, setRedirecting] = useState<Tier | null>(null);
  const viewTracked = useRef(false);
  const abVariant = useABTest("upsell_messaging");

  const sourceSection = variant === "teaser" ? "upgrade_teaser" : "upgrade_full";

  useEffect(() => {
    if (!isLoading && !viewTracked.current) {
      viewTracked.current = true;
      trackUpsellView({
        sourceSection,
        tier: "full_profile",
        upsellVariant: abVariant,
      });

      tryEnrollNurture();
    }
  }, [isLoading, variant, abVariant, sourceSection]);

  const tryEnrollNurture = async () => {
    try {
      const enrolled = sessionStorage.getItem(NURTURE_ENROLLED_KEY);
      if (enrolled) return;

      const email = sessionStorage.getItem(NURTURE_EMAIL_KEY);
      if (!email) return;

      const res = await fetch("/api/nurture-enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        trackNurtureEnroll({ framework: "strengths", frameworkType: "full_profile" });
        try { sessionStorage.setItem(NURTURE_ENROLLED_KEY, "true"); } catch { /* storage unavailable */ }
      }
    } catch { /* nurture enroll best-effort */ }
  };

  if (isLoading) return null;

  const handleUpgrade = async (tier: Tier) => {
    trackCheckoutStarted("strengths", tier, abVariant);
    trackUpsellClick({ tier, sourceSection, upsellVariant: abVariant });
    trackCTAClicked({
      ctaText: `Unlock ${tier === "full_profile" ? "Full Profile" : "AI Playbook"}`,
      ctaLocation: variant === "teaser" ? "upgrade_teaser" : "upgrade_full",
    });
    setRedirecting(tier);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      if (!res.ok) throw new Error("Checkout session failed");
      const data = await res.json();
      window.location.href = data.url;
    } catch {
      setRedirecting(null);
    }
  };

  if (variant === "teaser") {
    const tier = TIERS[0];
    return (
      <div className="upgrade-teaser">
        <div className="upgrade-teaser-lock">&#10024;</div>
        <h3>{t("upgradePrompt.teaserHeading")}</h3>
        {abVariant === "B" && (
          <p className="upsell-anchor">{t("upgradePrompt.anchorB")}</p>
        )}
        {abVariant === "C" && (
          <p className="upsell-anchor">{t("upgradePrompt.anchorC")}</p>
        )}
        <p>{t("upgradePrompt.teaserBody")}</p>
        <ul className="upgrade-features">
          {(["f1", "f2", "f3", "f4", "f5", "f6"] as const).map((k) => (
            <li key={k}>{t(`pricing.tiers.fullProfile.features.${k}`)}</li>
          ))}
        </ul>
        <button
          className="btn-start btn-upgrade"
          onClick={() => handleUpgrade(tier.id)}
          disabled={redirecting !== null}
        >
          {redirecting === tier.id
            ? t("upgradePrompt.redirectingCheckout")
            : t("upgradePrompt.getFullProfile", { price: tier.price })}
        </button>
        {abVariant === "B" && (
          <p className="upsell-guarantee">{t("upgradePrompt.guaranteeB")}</p>
        )}
        {abVariant === "C" && (
          <p className="upsell-guarantee">{t("upgradePrompt.guaranteeC")}</p>
        )}
        <p className="upgrade-subtitle">{t("upgradePrompt.oneTimePurchase")}</p>
        <div className="upgrade-more-tiers">
          <p>
            {t("upgradePrompt.alsoAvailable")}{" "}
            <button className="btn-link" onClick={() => handleUpgrade("ai_playbook")}>
              {t("upgradePrompt.aiPlaybookLink", { price: TIERS[1].price })}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="upgrade-full">
      <div className="upgrade-icon">&#10024;</div>
      <h2>{t("upgradePrompt.fullHeading")}</h2>
      {abVariant === "B" && (
        <p className="upsell-anchor">{t("upgradePrompt.anchorB")}</p>
      )}
      {abVariant === "C" && (
        <p className="upsell-anchor">{t("upgradePrompt.anchorC")}</p>
      )}
      <p>{t("upgradePrompt.fullBody")}</p>
      <div className="upgrade-cards">
        <div className="upgrade-card">
          <span className="upgrade-card-icon" style={{ color: "var(--fw-personality)" }}>&#9679;</span>
          <strong>{t("upgradePrompt.card16Personalities")}</strong>
          <span>{t("upgradePrompt.card16PersonalitiesDesc")}</span>
        </div>
        <div className="upgrade-card">
          <span className="upgrade-card-icon" style={{ color: "var(--fw-disc)" }}>&#9679;</span>
          <strong>{t("upgradePrompt.cardDISC")}</strong>
          <span>{t("upgradePrompt.cardDISCDesc")}</span>
        </div>
        <div className="upgrade-card">
          <span className="upgrade-card-icon" style={{ color: "var(--fw-enneagram)" }}>&#9679;</span>
          <strong>{t("upgradePrompt.cardEnneagram")}</strong>
          <span>{t("upgradePrompt.cardEnneagramDesc")}</span>
        </div>
      </div>
      <div className="upgrade-tier-buttons">
        {TIERS.map((tier) => (
          <button
            key={tier.id}
            className="btn-start btn-upgrade"
            onClick={() => handleUpgrade(tier.id)}
            disabled={redirecting !== null}
          >
            {redirecting === tier.id
              ? t("upgradePrompt.redirecting")
              : `${tier.name} — ${tier.price}${tier.mode === "subscription" ? "/mo" : ""}`}
          </button>
        ))}
      </div>
      {abVariant === "B" && (
        <p className="upsell-guarantee">{t("upgradePrompt.guaranteeB")}</p>
      )}
      {abVariant === "C" && (
        <p className="upsell-guarantee">{t("upgradePrompt.guaranteeC")}</p>
      )}
      <p className="upgrade-subtitle">{t("upgradePrompt.stripeNote")}</p>
    </div>
  );
}
