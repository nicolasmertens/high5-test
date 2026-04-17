import { forwardRef } from "react";
import { type StrengthScore } from "../hooks/useAssessment";
import {
  type PersonalityResult,
  type EnneagramResult,
  type DISCResult,
} from "../data/derivations";
import { domainColors, domainLabels } from "../data/strengths";
import { getShareCopy, type Segment } from "../data/share-copy";

interface Props {
  results: StrengthScore[];
  personality: PersonalityResult;
  enneagram: EnneagramResult;
  disc: DISCResult;
  isPaid: boolean;
  segment?: Segment | null;
}

export const ShareCard = forwardRef<HTMLDivElement, Props>(
  function ShareCard({ results, personality, enneagram, disc, isPaid, segment = null }, ref) {
    const top5 = results.slice(0, 5);
    const { cardSubtitle } = getShareCopy(segment ?? null);

    return (
      <div className="share-card" ref={ref}>
        <div className="share-card-inner">
          <div className="share-card-header">
            <div className="share-card-brand">
              <span className="share-card-logo">1T</span>
              <span className="share-card-brandname">1Test</span>
            </div>
            <span className="share-card-tagline">{cardSubtitle}</span>
          </div>

          <div className="share-card-body">
            <div className="share-card-top5">
              {top5.map((r, i) => (
                <div key={r.strength.id} className="share-card-strength">
                  <span
                    className="share-card-strength-rank"
                    style={{ color: domainColors[r.strength.domain] }}
                  >
                    #{i + 1}
                  </span>
                  <span className="share-card-strength-name">
                    {r.strength.name}
                  </span>
                  <span
                    className="share-card-strength-domain"
                    style={{ background: domainColors[r.strength.domain] }}
                  >
                    {domainLabels[r.strength.domain]}
                  </span>
                </div>
              ))}
            </div>

            <div className="share-card-types">
              <div className="share-card-type">
                <span className="share-card-type-label">16 Personalities</span>
                <span className="share-card-type-value">{personality.type}</span>
                <span className="share-card-type-sub">{personality.label}</span>
              </div>
              <div className="share-card-type">
                <span className="share-card-type-label">DISC</span>
                <span className="share-card-type-value">{disc.style}</span>
                <span className="share-card-type-sub">{disc.primary.name}</span>
              </div>
              <div className="share-card-type">
                <span className="share-card-type-label">Enneagram</span>
                <span className="share-card-type-value">{enneagram.wingLabel}</span>
                <span className="share-card-type-sub">{enneagram.primary.name}</span>
              </div>
            </div>
          </div>

          <div className="share-card-footer">
            <div className="share-card-cta">
              {isPaid
                ? "See your full profile at"
                : "Discover your strengths at"}
            </div>
            <div className="share-card-url">1test.me</div>
          </div>
        </div>
      </div>
    );
  },
);