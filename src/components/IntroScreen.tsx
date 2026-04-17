import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import { trackCTAClicked } from "../utils/analytics";

interface Props {
  onStart: () => void;
  onResume?: () => void;
  hasSavedProgress: boolean;
}

export function IntroScreen({ onStart, onResume, hasSavedProgress }: Props) {
  const { t } = useTranslation();
  const { localizePath } = useLanguage();

  const handleStart = () => {
    trackCTAClicked({
      ctaText: hasSavedProgress ? t("intro.startOver") : t("intro.startFree"),
      ctaLocation: "intro_hero",
    });
    onStart();
  };

  const handleResume = () => {
    trackCTAClicked({
      ctaText: t("intro.continueWhere"),
      ctaLocation: "intro_resume",
    });
    onResume?.();
  };

  return (
    <div className="intro">
      <div className="intro-inner">
      <div className="intro-logo">
        <svg viewBox="0 0 24 24" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2L4.5 13.5H11.5L10.5 22L19.5 10.5H12.5L13 2Z" fill="white" stroke="white" strokeWidth="1" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className="beta-badge">BETA</span>
      <h1>{t("intro.headline")}</h1>
      <p className="intro-subtitle">
        {t("intro.subtitle")}
      </p>

      <div className="trust-bar">
        <span className="trust-item">&#9989; {t("intro.trustFree")}</span>
        <span className="trust-item">&#128274; {t("intro.trustPrivate")}</span>
        <span className="trust-item">&#127891; {t("intro.trustResearch")}</span>
      </div>

      <div className="usp-section">
        <div className="framework-cards">
          <div className="framework-card">
            <span className="fw-icon" style={{ color: "#f59e0b" }}>&#9733;</span>
            <span className="fw-name">{t("frameworkCards.strengths")}</span>
            <span className="fw-desc">{t("frameworkCards.strengthsDesc")}</span>
          </div>
          <div className="framework-card">
            <span className="fw-icon" style={{ color: "#6366f1" }}>&#9632;</span>
            <span className="fw-name">{t("frameworkCards.personality")}</span>
            <span className="fw-desc">{t("frameworkCards.personalityDesc")}</span>
          </div>
          <div className="framework-card">
            <span className="fw-icon" style={{ color: "#e53e3e" }}>&#9650;</span>
            <span className="fw-name">{t("frameworkCards.disc")}</span>
            <span className="fw-desc">{t("frameworkCards.discDesc")}</span>
          </div>
          <div className="framework-card">
            <span className="fw-icon" style={{ color: "#10b981" }}>&#9675;</span>
            <span className="fw-name">{t("frameworkCards.enneagram")}</span>
            <span className="fw-desc">{t("frameworkCards.enneagramDesc")}</span>
          </div>
        </div>

        <div className="intro-domains">
          <span className="domain-pill doing">{t("frameworkCards.domains.doing")}</span>
          <span className="domain-pill thinking">{t("frameworkCards.domains.thinking")}</span>
          <span className="domain-pill feeling">{t("frameworkCards.domains.feeling")}</span>
          <span className="domain-pill motivating">{t("frameworkCards.domains.motivating")}</span>
        </div>
      </div>

      <div className="intro-details">
        <div className="detail-card">
          <span className="detail-number">120</span>
          <span className="detail-label">{t("intro.questionCount")}</span>
        </div>
        <div className="detail-card">
          <span className="detail-number">4</span>
          <span className="detail-label">{t("intro.frameworksCount")}</span>
        </div>
        <div className="detail-card">
          <span className="detail-number">~15</span>
          <span className="detail-label">{t("intro.minutesLabel")}</span>
        </div>
        <div className="detail-card">
          <span className="detail-number">{t("intro.freeAlways").split("")[0]}</span>
          <span className="detail-label">{t("intro.freeAlways")}</span>
        </div>
      </div>

      <p className="intro-instruction">
        {t("intro.instruction")}
      </p>

      <p className="intro-social-proof">
        {t("intro.socialProof")}
      </p>

      <div className="intro-actions">
        {hasSavedProgress && onResume && (
          <button className="btn-start" onClick={handleResume}>
            {t("intro.continueWhere")}
          </button>
        )}
        <button
          className={hasSavedProgress ? "btn-start btn-start-secondary" : "btn-start"}
          onClick={handleStart}
        >
          {hasSavedProgress ? t("intro.startOver") : t("intro.startFree")}
        </button>
      </div>

      <p className="intro-credit">
        {t("intro.creditPrefix")}{" "}
        <a href="https://ipip.ori.org/" target="_blank" rel="noopener">
          {t("intro.creditLink")}
        </a>
        {t("intro.creditSuffix")}{" "}
        <a href={localizePath("/pricing")}>{t("intro.pricing")}</a> · <a href={localizePath("/privacy")}>{t("intro.privacy")}</a> · <a href={localizePath("/terms")}>{t("intro.terms")}</a>
      </p>

      </div>{/* end intro-inner */}
      <div className="sticky-mobile-cta">
        <button
          className="btn-start"
          onClick={hasSavedProgress ? onResume : onStart}
        >
          {hasSavedProgress ? t("intro.continueWhere") : t("intro.startAssessment")}
        </button>
      </div>
    </div>
  );
}