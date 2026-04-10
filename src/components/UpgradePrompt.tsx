import { useState } from "react";
import { usePayment } from "../contexts/PaymentContext";

const PRICE_DISPLAY = "$12";

export function UpgradePrompt({ variant }: { variant: "full" | "teaser" }) {
  const { isLoading } = usePayment();
  const [redirecting, setRedirecting] = useState(false);

  if (isLoading) return null;

  const handleUpgrade = async () => {
    setRedirecting(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Checkout session failed");
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setRedirecting(false);
    }
  };

  if (variant === "teaser") {
    return (
      <div className="upgrade-teaser">
        <div className="upgrade-teaser-lock">&#128274;</div>
        <h3>Unlock Your Full Profile</h3>
        <p>
          Your Top 5 Strengths are just the beginning. Get your complete results
          across all four frameworks — detailed personality type, DISC profile,
          Enneagram with wing & tritype, plus career paths and growth insights.
        </p>
        <ul className="upgrade-features">
          <li>All 20 strengths ranked with detailed insights</li>
          <li>Full personality type breakdown with dimension scores</li>
          <li>Complete DISC profile with traits and communication tips</li>
          <li>Enneagram wing, tritype, and stress/growth patterns</li>
          <li>Career paths, book recommendations, stress patterns</li>
          <li>Unified profile combining all four frameworks</li>
        </ul>
        <button
          className="btn-start btn-upgrade"
          onClick={handleUpgrade}
          disabled={redirecting}
        >
          {redirecting ? "Redirecting to checkout..." : `Unlock Full Profile — ${PRICE_DISPLAY}`}
        </button>
        <p className="upgrade-subtitle">
          One-time purchase. Instant access. No subscription.
        </p>
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
      <button
        className="btn-start btn-upgrade"
        onClick={handleUpgrade}
        disabled={redirecting}
      >
        {redirecting ? "Redirecting..." : `Unlock Full Profile — ${PRICE_DISPLAY}`}
      </button>
      <p className="upgrade-subtitle">
        One-time purchase. SSL-encrypted payment via Stripe.
      </p>
    </div>
  );
}