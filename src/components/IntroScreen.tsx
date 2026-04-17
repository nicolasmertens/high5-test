import { trackCTAClicked } from "../utils/analytics";

interface Props {
  onStart: () => void;
  onResume?: () => void;
  hasSavedProgress: boolean;
}

export function IntroScreen({ onStart, onResume, hasSavedProgress }: Props) {
  const handleStart = () => {
    trackCTAClicked({
      ctaText: hasSavedProgress ? "Start Over" : "Start Free Assessment",
      ctaLocation: "intro_hero",
    });
    onStart();
  };

  const handleResume = () => {
    trackCTAClicked({
      ctaText: "Continue Where You Left Off",
      ctaLocation: "intro_resume",
    });
    onResume?.();
  };

  return (
    <div className="intro">
      <div className="intro-logo">
        <svg viewBox="0 0 24 24" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2L4.5 13.5H11.5L10.5 22L19.5 10.5H12.5L13 2Z" fill="white" stroke="white" strokeWidth="1" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className="beta-badge">BETA</span>
      <h1>Know What Makes You Tick</h1>
      <p className="intro-subtitle">
        One free test. Four personality frameworks. Actionable results you can use today.
      </p>

      <div className="trust-bar">
        <span className="trust-item">&#9989; 100% free</span>
        <span className="trust-item">&#128274; Private results</span>
        <span className="trust-item">&#127891; Research-backed</span>
      </div>

      <div className="usp-section">
        <div className="framework-cards">
          <div className="framework-card">
            <span className="fw-icon" style={{ color: "#f59e0b" }}>&#9733;</span>
            <span className="fw-name">Top 5 Strengths</span>
            <span className="fw-desc">20 strengths, 4 domains</span>
          </div>
          <div className="framework-card">
            <span className="fw-icon" style={{ color: "#6366f1" }}>&#9632;</span>
            <span className="fw-name">16 Personalities</span>
            <span className="fw-desc">Cognitive preferences</span>
          </div>
          <div className="framework-card">
            <span className="fw-icon" style={{ color: "#e53e3e" }}>&#9650;</span>
            <span className="fw-name">DISC Profile</span>
            <span className="fw-desc">Behavioral style</span>
          </div>
          <div className="framework-card">
            <span className="fw-icon" style={{ color: "#10b981" }}>&#9675;</span>
            <span className="fw-name">Enneagram</span>
            <span className="fw-desc">Core motivations</span>
          </div>
        </div>

        <div className="intro-domains">
          <span className="domain-pill doing">DOING</span>
          <span className="domain-pill thinking">THINKING</span>
          <span className="domain-pill feeling">FEELING</span>
          <span className="domain-pill motivating">MOTIVATING</span>
        </div>
      </div>

      <div className="intro-details">
        <div className="detail-card">
          <span className="detail-number">120</span>
          <span className="detail-label">Questions</span>
        </div>
        <div className="detail-card">
          <span className="detail-number">4</span>
          <span className="detail-label">Frameworks</span>
        </div>
        <div className="detail-card">
          <span className="detail-number">~15</span>
          <span className="detail-label">Minutes</span>
        </div>
        <div className="detail-card">
          <span className="detail-number">Free</span>
          <span className="detail-label">Always</span>
        </div>
      </div>

      <p className="intro-instruction">
        Rate each statement based on how well it describes you. Go with your
        first instinct — there are no right or wrong answers.
      </p>

      <div className="intro-actions">
        {hasSavedProgress && onResume && (
          <button className="btn-start" onClick={handleResume}>
            Continue Where You Left Off
          </button>
        )}
        <button
          className={hasSavedProgress ? "btn-start btn-start-secondary" : "btn-start"}
          onClick={handleStart}
        >
          {hasSavedProgress ? "Start Over" : "Start Free Assessment"}
        </button>
      </div>

      <p className="intro-credit">
        Based on public domain research from the{" "}
        <a href="https://ipip.ori.org/" target="_blank" rel="noopener">
          International Personality Item Pool
        </a>
        . Not affiliated with any trademark holder.{" "}
        <a href="/privacy-draft">Privacy</a> · <a href="/terms-draft">Terms</a>
      </p>
    </div>
  );
}
