import { useState } from "react";
import { trackEmailCaptured } from "../utils/analytics";

const NURTURE_EMAIL_KEY = "1test_nurture_email";

interface EmailCaptureProps {
  frameworkName: string;
  frameworkType: string;
  oneSentenceTraitSummary: string;
  captureLocation?: string;
  onSuccess?: (email: string) => void;
}

export function EmailCapture({ frameworkName, frameworkType, oneSentenceTraitSummary, captureLocation = "results_page", onSuccess }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const firstName = normalizedEmail.split("@")[0].split(/[._-]/)[0];
      const capitalizedName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          firstName: capitalizedName,
          frameworkName,
          frameworkType,
          oneSentenceTraitSummary,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      try { sessionStorage.setItem(NURTURE_EMAIL_KEY, normalizedEmail); } catch { /* storage unavailable */ }
      setStatus("success");
      trackEmailCaptured(captureLocation, frameworkName);
      onSuccess?.(normalizedEmail);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="email-capture email-capture-success">
        <div className="email-capture-icon">&#10003;</div>
        <h3>You're in!</h3>
        <p>
          Your personalized results are on the way to your inbox. Check your email
          for insights tailored to your {frameworkType} profile.
        </p>
      </div>
    );
  }

  return (
    <div className="email-capture">
      <h3>Get your results by email</h3>
      <p>
        We'll send you personalized insights based on your{" "}
        <strong>{frameworkType}</strong> profile — including tips, career paths,
        and growth strategies.
      </p>
      <form onSubmit={handleSubmit} className="email-capture-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === "loading"}
          className="email-capture-input"
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={status === "loading" || !email.trim()}
          className="btn-start btn-email-capture"
        >
          {status === "loading" ? "Sending..." : "Send me my results"}
        </button>
      </form>
      {status === "error" && (
        <p className="email-capture-error">{errorMessage}</p>
      )}
      <p className="email-capture-disclaimer">
        No spam. Unsubscribe anytime. We respect your privacy.
      </p>
    </div>
  );
}