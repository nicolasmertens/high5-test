import { type StrengthScore } from "../hooks/useAssessment";
import {
  type MBTIResult,
  type EnneagramResult,
  type DISCResult,
} from "../data/derivations";
import { domainColors, domainLabels } from "../data/strengths";

interface Props {
  results: StrengthScore[];
  mbti: MBTIResult;
  enneagram: EnneagramResult;
  disc: DISCResult;
  onBack: () => void;
}

const discColors: Record<string, string> = {
  D: "#e53e3e",
  I: "#f6ad55",
  S: "#48bb78",
  C: "#4299e1",
};

export function DetailedResults({
  results,
  mbti,
  enneagram,
  disc,
  onBack,
}: Props) {
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
                        background: isRight
                          ? "var(--accent)"
                          : "var(--thinking)",
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

      {/* DISC Section */}
      <section className="detail-section disc-section">
        <div className="section-header">
          <h2>Your DISC Profile</h2>
          <span className="confidence-badge">
            {disc.confidence}% confidence
          </span>
        </div>

        <div className="disc-hero">
          <div className="disc-style-display">
            <span
              className="disc-primary-letter"
              style={{ color: discColors[disc.primary.code] }}
            >
              {disc.primary.code}
            </span>
            <span
              className="disc-secondary-letter"
              style={{ color: discColors[disc.secondary.code] }}
            >
              {disc.secondary.code.toLowerCase()}
            </span>
          </div>
          <h3 className="disc-style-label">
            {disc.primary.name} / {disc.secondary.name}
          </h3>
          <p className="disc-style-desc">{disc.primary.description}</p>
        </div>

        <div className="disc-dimensions">
          {disc.dimensions.map((dim) => (
            <div key={dim.code} className="disc-dim-row">
              <div className="disc-dim-header">
                <span
                  className="disc-dim-code"
                  style={{ background: discColors[dim.code] }}
                >
                  {dim.code}
                </span>
                <span className="disc-dim-name">{dim.name}</span>
                <span className="disc-dim-score">{dim.score}%</span>
              </div>
              <div className="disc-dim-track">
                <div
                  className="disc-dim-fill"
                  style={{
                    width: `${dim.score}%`,
                    background: discColors[dim.code],
                  }}
                />
              </div>
              <div className="disc-traits">
                {dim.traits.map((t) => (
                  <span key={t} className="disc-trait">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mbti-note">
          <strong>How this was derived:</strong> DISC measures behavioral style
          in four dimensions. Your strength scores were mapped: Commander +
          Self-Believer + Winner signal high Dominance; Storyteller + Chameleon
          + Optimist signal high Influence; Peacekeeper + Deliverer signal
          Steadiness; Analyst + Time Keeper signal Conscientiousness.
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

      {/* Unified Synthesis */}
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
            <h4>16 Personalities</h4>
            <div className="synth-big">{mbti.type}</div>
            <p className="synth-sublabel">{mbti.label}</p>
          </div>

          <div className="synth-card">
            <h4>DISC Style</h4>
            <div className="synth-big" style={{ color: discColors[disc.primary.code] }}>
              {disc.style}
            </div>
            <p className="synth-sublabel">{disc.primary.name}</p>
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
            Four frameworks, one assessment. Your <strong>strengths</strong>{" "}
            reveal <em>what you do best</em>. Your{" "}
            <strong>personality type</strong> ({mbti.type}) shows{" "}
            <em>how you process the world</em>. Your{" "}
            <strong>DISC profile</strong> ({disc.style}) captures{" "}
            <em>how you behave with others</em>. And your{" "}
            <strong>Enneagram</strong> ({enneagram.wingLabel}) uncovers{" "}
            <em>why you do what you do</em>. Together they create a richer,
            more actionable profile than any single framework alone.
          </p>
        </div>
      </section>
    </div>
  );
}
