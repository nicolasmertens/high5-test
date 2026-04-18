import { useTranslation } from "react-i18next";
import { EmailCapture } from "./EmailCapture";

interface EmailGateProps {
  frameworkName: string;
  frameworkType: string;
  oneSentenceTraitSummary: string;
  onUnlocked: (email: string) => void;
}

export function EmailGate({ frameworkName, frameworkType, oneSentenceTraitSummary, onUnlocked }: EmailGateProps) {
  const { t } = useTranslation();
  return (
    <div className="email-gate">
      <div className="email-gate-header">
        <div className="email-gate-icon">✓</div>
        <h2>{t("emailGate.title")}</h2>
        <p className="email-gate-subtitle">
          {t("emailGate.subtitle")}
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
          {t("emailGate.skip")}
        </button>
      </p>
    </div>
  );
}
