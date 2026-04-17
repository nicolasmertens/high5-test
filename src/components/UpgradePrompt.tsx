import { useState } from "react";
import { usePayment } from "../contexts/PaymentContext";
import { trackCheckoutStarted, trackCTAClicked, trackUpsellClick } from "../utils/analytics";

type Tier = "full_profile" | "ai_playbook" | "team_monthly";

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
  const { isLoading } = usePayment();
  const [redirecting, setRedirecting] = useState<Tier | null>(null);

  if (isLoading) return null;

  const handleUpgrade = async (tier: Tier) => {
    trackCheckoutStarted("strengths", tier);
    trackUpsellClick({ tier, sourceSection: variant === "teaser" ? "upgrade_teaser" : "upgrade_full" });
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
        <h3>Go Deeper With Your Full Profile</h3>
        <p>
          You've seen your personality type and top strengths. Unlock your complete
          profile: all 20 strengths ranked, detailed breakdowns for each framework,
          career paths matched to your profile, and a PDF export to keep forever.
        </p>
        <ul className="upgrade-features">
          {tier.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <button
          className="btn-start btn-upgrade"
          onClick={() => handleUpgrade(tier.id)}
          disabled={redirecting !== null}
        >
          {redirecting === tier.id ? "Redirecting to checkout..." : `Get Full Profile — ${tier.price}`}
        </button>
        <p className="upgrade-subtitle">
          One-time purchase. Instant access. No subscription.
        </p>
        <div className="upgrade-more-tiers">
          <p>Also available: <button className="btn-link" onClick={() => handleUpgrade("ai_playbook")}>AI Playbook — $19</button></p>
        </div>
      </div>
    );
  }

  return (
    <div className="upgrade-full">
      <div className="upgrade-icon">&#10024;</div>
      <h2>Go Beyond Your Top 5</h2>
      <p>
        You&apos;ve seen your top strengths. Imagine having your complete profile
        across all four frameworks — the patterns, the blind spots, the career
        paths that match who you really are.
      </p>
      <div className="upgrade-cards">
        <div className="upgrade-card">
          <span className="upgrade-card-icon">&#9632;</span>
          <strong>16 Personalities</strong>
          <span>Your type with confidence percentages</span>
        </div>
        <div className="upgrade-card">
          <span className="upgrade-card-icon">&#9670;</span>
          <strong>DISC Profile</strong>
          <span>Behavioral style with traits</span>
        </div>
        <div className="upgrade-card">
          <span className="upgrade-card-icon">&#9675;</span>
          <strong>Enneagram</strong>
          <span>Wing, tritype, stress patterns</span>
        </div>
      </div>
      <div className="upgrade-tier-buttons">
        {TIERS.map((t) => (
          <button
            key={t.id}
            className="btn-start btn-upgrade"
            onClick={() => handleUpgrade(t.id)}
            disabled={redirecting !== null}
          >
            {redirecting === t.id ? "Redirecting..." : `${t.name} — ${t.price}${t.mode === "subscription" ? "/mo" : ""}`}
          </button>
        ))}
      </div>
      <p className="upgrade-subtitle">
        SSL-encrypted payment via Stripe. Free tier stays free forever.
      </p>
    </div>
  );
}