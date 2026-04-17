import { EmailCapture } from "./EmailCapture";

interface EmailGateProps {
  frameworkName: string;
  frameworkType: string;
  oneSentenceTraitSummary: string;
  onUnlocked: (email: string) => void;
}

export function EmailGate({ frameworkName, frameworkType, oneSentenceTraitSummary, onUnlocked }: EmailGateProps) {
  return (
    <div className="email-gate">
      <div className="email-gate-header">
        <div className="email-gate-icon">✓</div>
        <h2>Your results are ready!</h2>
        <p className="email-gate-subtitle">
          You've completed all 120 questions. Enter your email to unlock your full personality profile — Strengths, 16 Personalities, DISC, and Enneagram.
        </p>
      </div>
      <EmailCapture
        frameworkName={frameworkName}
        frameworkType={frameworkType}
        oneSentenceTraitSummary={oneSentenceTraitSummary}
        captureLocation="pre_results_gate"
        onSuccess={onUnlocked}
      />
      <p className="email-gate-skip">
        <button
          className="email-gate-skip-btn"
          onClick={() => onUnlocked("")}
          type="button"
        >
          Skip for now →
        </button>
      </p>
    </div>
  );
}
