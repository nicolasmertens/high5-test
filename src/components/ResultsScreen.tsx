import { type StrengthScore } from "../hooks/useAssessment";
import { domainColors, domainLabels } from "../data/strengths";

interface Props {
  results: StrengthScore[];
  onRestart: () => void;
}

export function ResultsScreen({ results, onRestart }: Props) {
  const top5 = results.slice(0, 5);

  // Domain distribution for top 5
  const domainCounts: Record<string, number> = {};
  for (const r of top5) {
    const d = r.strength.domain;
    domainCounts[d] = (domainCounts[d] || 0) + 1;
  }

  return (
    <div className="results">
      <h1>Your Top 5 Strengths</h1>
      <p className="results-subtitle">
        Your unique combination out of 1,860,480 possible sequences
      </p>

      <div className="top5">
        {top5.map((r, i) => (
          <div
            key={r.strength.id}
            className="top5-card"
            style={{
              borderLeftColor: domainColors[r.strength.domain],
            }}
          >
            <div className="top5-rank">#{i + 1}</div>
            <div className="top5-content">
              <div className="top5-header">
                <h2>{r.strength.name}</h2>
                <span
                  className="domain-badge"
                  style={{
                    background: domainColors[r.strength.domain],
                  }}
                >
                  {domainLabels[r.strength.domain]}
                </span>
                <span className="score-badge">{r.score}%</span>
              </div>
              <p className="top5-desc">{r.strength.description}</p>
              <div className="top5-energy">
                <div className="energy-item energized">
                  <strong>Energized by:</strong> {r.strength.energized}
                </div>
                <div className="energy-item drained">
                  <strong>Drained by:</strong> {r.strength.drained}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="domain-summary">
        <h3>Domain Distribution</h3>
        <div className="domain-bars">
          {Object.entries(domainLabels).map(([key, label]) => (
            <div key={key} className="domain-bar-row">
              <span
                className="domain-bar-label"
                style={{ color: domainColors[key] }}
              >
                {label}
              </span>
              <div className="domain-bar-track">
                <div
                  className="domain-bar-fill"
                  style={{
                    width: `${((domainCounts[key] || 0) / 5) * 100}%`,
                    background: domainColors[key],
                  }}
                />
              </div>
              <span className="domain-bar-count">
                {domainCounts[key] || 0}/5
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="full-ranking">
        <h3>Full Ranking (All 20 Strengths)</h3>
        <div className="ranking-list">
          {results.map((r) => (
            <div key={r.strength.id} className="ranking-row">
              <span className="ranking-rank">#{r.rank}</span>
              <span className="ranking-name">{r.strength.name}</span>
              <span
                className="ranking-domain"
                style={{ color: domainColors[r.strength.domain] }}
              >
                {domainLabels[r.strength.domain]}
              </span>
              <div className="ranking-bar-track">
                <div
                  className="ranking-bar-fill"
                  style={{
                    width: `${r.score}%`,
                    background:
                      r.rank <= 5
                        ? domainColors[r.strength.domain]
                        : "#64748b",
                  }}
                />
              </div>
              <span className="ranking-score">{r.score}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="scoring-explanation">
        <h3>How Scoring Works</h3>
        <p>
          Each of the 20 strengths is measured by 6 statements. Your slider
          position (0-100) is recorded for each statement. Reversed items are
          flipped (100 - value). The average of your 6 responses becomes
          your score for that strength. All 20 scores are then ranked to
          produce your unique strength sequence. Your top 5 are your
          signature strengths.
        </p>
      </div>

      <button className="btn-start" onClick={onRestart}>
        Retake Assessment
      </button>
    </div>
  );
}
