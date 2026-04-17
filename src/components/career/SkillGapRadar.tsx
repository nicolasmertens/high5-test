import type { SkillGap } from "../../careerData/careerPathLibrary";
import { usePayment } from "../../contexts/PaymentContext";

interface Props {
  gaps: SkillGap[];
}

export function SkillGapRadar({ gaps }: Props) {
  const { isPaid } = usePayment();

  if (!isPaid) return null;

  if (!gaps || gaps.length === 0) return null;

  return (
    <section className="branch-card skill-gap-radar">
      <div className="branch-icon">📊</div>
      <h3>Your Skill Gap Analysis</h3>
      <p className="branch-desc">
        Where you are now vs. where your career path needs you to be.
      </p>
      <div className="skill-gap-bars">
        {gaps.map((gap) => {
          const currentPct = Math.round(gap.currentLevel);
          const requiredPct = Math.round(gap.requiredLevel);
          const gapSize = gap.gap;
          return (
            <div key={gap.skill} className="skill-gap-row">
              <div className="skill-gap-label">
                <span className="skill-gap-name">{gap.skill}</span>
                <span className="skill-gap-numbers">
                  {currentPct}% → {requiredPct}%
                </span>
              </div>
              <div className="skill-gap-track">
                <div
                  className="skill-gap-fill skill-gap-current"
                  style={{ width: `${currentPct}%` }}
                />
                <div
                  className="skill-gap-fill skill-gap-required"
                  style={{ width: `${requiredPct}%` }}
                />
              </div>
              {gapSize > 20 && (
                <div className="skill-gap-tip">
                  <strong>Close the gap:</strong> {gap.developmentTip}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}