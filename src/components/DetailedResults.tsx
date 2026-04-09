import { type StrengthScore } from "../hooks/useAssessment";
import { type MBTIResult, type EnneagramResult } from "../data/derivations";
import { domainColors, domainLabels } from "../data/strengths";

interface Props {
  results: StrengthScore[];
  mbti: MBTIResult;
  enneagram: EnneagramResult;
  onBack: () => void;
}

export function DetailedResults({ results, mbti, enneagram, onBack }: Props) {
  const top5 = results.slice(0, 5);

  return (
    <div className="detailed">
      <button className="btn-back" onClick={onBack}>
        &larr; Back to Overview
      </button>

      {/* MBTI Section */}
      <section className="detail-section mbti-section">
        <div className="section-header">
          <h2>Your Personality Type</h2>
          <span className="confidence-badge">
            {mbti.confidence}% confidence
          </span>
        </div>

        <div className="mbti-hero">
          <div className="mbti-type-display">
            {mbti.type.split("").map((letter, i) => (
              <span
                key={i}
                className={`mbti-letter ${mbti.dimensions[i].confidence > 30 ? "strong" : "weak"}`}
              >
                {letter}
              </span>
            ))}
          </div>
          <h3 className="mbti-label">{mbti.label}</h3>
          <p className="mbti-desc">{mbti.description}</p>
        </div>

        <div className="mbti-dimensions">
          {mbti.dimensions.map((dim) => {
            const leftPercent = 50 - dim.score / 2;
            const barWidth = Math.abs(dim.score);
            const isRight = dim.score >= 0;

            return (
              <div key={dim.label} className="dim-row">
                <span className={`dim-pole ${!isRight ? "dim-active" : ""}`}>
                  {dim.pole1Code} — {dim.pole1}
                </span>
                <div className="dim-bar-container">
                  <div className="dim-bar-track">
                    <div className="dim-center-line" />
                    <div
                      className="dim-bar-fill"
                      style={{
                        left: `${isRight ? 50 : leftPercent}%`,
                        width: `${barWidth / 2}%`,
                        background: isRight ? "var(--accent)" : "var(--thinking)",
                      }}
                    />
                  </div>
                  <span className="dim-pct">{dim.confidence}%</span>
                </div>
                <span className={`dim-pole ${isRight ? "dim-active" : ""}`}>
                  {dim.pole2Code} — {dim.pole2}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mbti-note">
          <strong>How this was derived:</strong> Your scores across 20 strengths
          were weighted against known MBTI dimension correlations. For example,
          high Commander + Storyteller scores pull toward Extraversion, while
          Thinker + Analyst pull toward Introversion. This is an{" "}
          <em>estimate</em>, not a certified assessment.
        </div>
      </section>

      {/* Enneagram Section */}
      <section className="detail-section enneagram-section">
        <div className="section-header">
          <h2>Your Enneagram Type</h2>
          <span className="confidence-badge">
            {enneagram.confidence}% confidence
          </span>
        </div>

        <div className="ennea-hero">
          <div className="ennea-type-display">
            <span className="ennea-number">{enneagram.wingLabel}</span>
          </div>
          <h3 className="ennea-name">{enneagram.primary.name}</h3>
          <p className="ennea-desc">{enneagram.primary.description}</p>

          <div className="ennea-motivations">
            <div className="motivation-card motivation-drive">
              <strong>Core Motivation</strong>
              <p>{enneagram.primary.coreMotivation}</p>
            </div>
            <div className="motivation-card motivation-fear">
              <strong>Core Fear</strong>
              <p>{enneagram.primary.coreFear}</p>
            </div>
          </div>
        </div>

        <div className="ennea-spectrum">
          <h4>Full Enneagram Spectrum</h4>
          {enneagram.allTypes.map((t) => (
            <div
              key={t.type}
              className={`ennea-bar-row ${t.type === enneagram.primary.type ? "ennea-primary" : ""}`}
            >
              <span className="ennea-bar-label">
                {t.type} — {t.name}
              </span>
              <div className="ennea-bar-track">
                <div
                  className="ennea-bar-fill"
                  style={{
                    width: `${t.score}%`,
                    background:
                      t.type === enneagram.primary.type
                        ? "var(--accent)"
                        : t.type === enneagram.wing?.type
                          ? "var(--accent-dark)"
                          : "#94a3b8",
                  }}
                />
              </div>
              <span className="ennea-bar-score">{t.score}%</span>
            </div>
          ))}
        </div>

        <div className="ennea-tritype">
          <h4>Tritype</h4>
          <p>
            Your strongest type from each intelligence center:{" "}
            <strong>{enneagram.tritype.join("-")}</strong>
          </p>
          <div className="tritype-centers">
            <span className="center-badge gut">
              Gut ({enneagram.tritype[0]})
            </span>
            <span className="center-badge heart">
              Heart ({enneagram.tritype[1]})
            </span>
            <span className="center-badge head">
              Head ({enneagram.tritype[2]})
            </span>
          </div>
        </div>

        <div className="mbti-note">
          <strong>How this was derived:</strong> Your 20 strength scores were
          weighted against Enneagram type correlations. High Winner + Deliverer
          + Storyteller scores signal Type 3 (Achiever). High Brainstormer +
          Chameleon signal Type 7 (Enthusiast). Wing is determined by the
          highest adjacent type.
        </div>
      </section>

      {/* Bridge / Synthesis Section */}
      <section className="detail-section synthesis-section">
        <div className="section-header">
          <h2>Your Unified Profile</h2>
        </div>

        <div className="synthesis-grid">
          <div className="synth-card">
            <h4>Top 5 Strengths</h4>
            <div className="synth-list">
              {top5.map((r, i) => (
                <div key={r.strength.id} className="synth-item">
                  <span className="synth-rank">#{i + 1}</span>
                  <span className="synth-name">{r.strength.name}</span>
                  <span
                    className="synth-domain"
                    style={{ color: domainColors[r.strength.domain] }}
                  >
                    {domainLabels[r.strength.domain]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="synth-card">
            <h4>Personality Type</h4>
            <div className="synth-big">{mbti.type}</div>
            <p className="synth-sublabel">{mbti.label}</p>
          </div>

          <div className="synth-card">
            <h4>Enneagram</h4>
            <div className="synth-big">{enneagram.wingLabel}</div>
            <p className="synth-sublabel">{enneagram.primary.name}</p>
          </div>
        </div>

        <div className="synthesis-narrative">
          <h4>What This Means</h4>
          <p>
            Your strengths, personality type, and Enneagram form a unified
            picture of how you think, relate, and what drives you. While each
            framework measures different aspects — strengths capture{" "}
            <em>what you do well</em>, MBTI captures{" "}
            <em>how you process the world</em>, and Enneagram captures{" "}
            <em>why you do what you do</em> — together they create a richer,
            more actionable profile than any single framework alone.
          </p>
        </div>
      </section>
    </div>
  );
}
