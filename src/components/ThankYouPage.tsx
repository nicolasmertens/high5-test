import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePayment } from "../contexts/PaymentContext";

const TIER_LABELS: Record<string, { label: string; description: string }> = {
  full_profile: {
    label: "Full Profile",
    description: "Your complete personality profile across all four frameworks is now unlocked.",
  },
  ai_playbook: {
    label: "AI Playbook",
    description: "Your personalized growth plan and career paths are being generated.",
  },
  team_monthly: {
    label: "Team Monthly",
    description: "Your team workspace is ready. Invite colleagues to get started.",
  },
};

export function ThankYouPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkSession, email } = usePayment();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tier, setTier] = useState<string>("full_profile");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setVerifying(false);
      setError("No session found. If you completed a purchase, please check your email for confirmation.");
      return;
    }

    checkSession(sessionId).then((verified) => {
      if (verified) {
        try {
          const tierParam = searchParams.get("tier") || "full_profile";
          setTier(tierParam);
        } catch {}
      }
      setVerifying(false);
    }).catch(() => {
      setVerifying(false);
      setError("We could not verify your payment right now. If you received a confirmation email, your purchase went through.");
    });
  }, [searchParams, checkSession]);

  const tierInfo = TIER_LABELS[tier] || TIER_LABELS.full_profile;

  return (
    <div className="thank-you-page">
      <div className="thank-you-container">
        {verifying ? (
          <>
            <div className="thank-you-spinner" />
            <h1>Verifying your purchase...</h1>
            <p>Please wait while we confirm your payment.</p>
          </>
        ) : error ? (
          <>
            <h1>Almost there!</h1>
            <p className="thank-you-error">{error}</p>
            <button className="btn-start" onClick={() => navigate("/")}>
              Return to Your Results
            </button>
          </>
        ) : (
          <>
            <div className="thank-you-icon">&#10003;</div>
            <h1>Thank you!</h1>
            <p className="thank-you-tier-label">{tierInfo.label}</p>
            <p>{tierInfo.description}</p>
            {email && (
              <p className="thank-you-email">
                Confirmation sent to <strong>{email}</strong>
              </p>
            )}
            <button className="btn-start" onClick={() => navigate("/")}>
              View Your Results
            </button>
          </>
        )}
      </div>
    </div>
  );
}