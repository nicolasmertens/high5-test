interface Props {
  onStart: () => void;
  onResume?: () => void;
  hasSavedProgress: boolean;
}

export function IntroScreen({ onStart, onResume, hasSavedProgress }: Props) {
  return (
    <div className="intro">
      <div className="intro-logo">5</div>
      <span className="beta-badge">BETA</span>
      <h1>Strengths Assessment</h1>
      <p className="intro-subtitle">
        Discover your top 5 strengths across 20 dimensions
      </p>

      <div className="intro-details">
        <div className="detail-card">
          <span className="detail-number">120</span>
          <span className="detail-label">Questions</span>
        </div>
        <div className="detail-card">
          <span className="detail-number">20</span>
          <span className="detail-label">Strengths</span>
        </div>
        <div className="detail-card">
          <span className="detail-number">4</span>
          <span className="detail-label">Domains</span>
        </div>
        <div className="detail-card">
          <span className="detail-number">~15</span>
          <span className="detail-label">Minutes</span>
        </div>
      </div>

      <div className="intro-domains">
        <span className="domain-pill doing">DOING</span>
        <span className="domain-pill thinking">THINKING</span>
        <span className="domain-pill feeling">FEELING</span>
        <span className="domain-pill motivating">MOTIVATING</span>
      </div>

      <p className="intro-instruction">
        Rate each statement based on how well it describes you. Go with your
        first instinct — there are no right or wrong answers.
      </p>

      <p className="intro-credit">
        Based on public domain items from the{" "}
        <a href="https://ipip.ori.org/" target="_blank" rel="noopener">
          International Personality Item Pool
        </a>{" "}
        (IPIP-VIA), mapped to a 20-strength framework.
      </p>

      <div className="intro-actions">
        {hasSavedProgress && onResume && (
          <button className="btn-start" onClick={onResume}>
            Continue Where You Left Off
          </button>
        )}
        <button
          className={hasSavedProgress ? "btn-start btn-start-secondary" : "btn-start"}
          onClick={onStart}
        >
          {hasSavedProgress ? "Start Over" : "Start Assessment"}
        </button>
      </div>
    </div>
  );
}
