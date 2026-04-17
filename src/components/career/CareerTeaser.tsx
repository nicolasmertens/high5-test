import { useEffect, useRef } from "react";
import type { PersonalityResult } from "../../data/derivations";
import type { StrengthScore } from "../../hooks/useAssessment";
import type { IntakeAnswers } from "../../careerData/segmentConfig";
import type { SegmentContent } from "../../careerData/careerPathLibrary";
import { usePayment } from "../../contexts/PaymentContext";
import { trackBlockViewed, trackUpsellView, trackCTAClicked, trackUpsellClick } from "../../utils/analytics";

interface Props {
  answers: IntakeAnswers;
  content: SegmentContent;
  personality: PersonalityResult;
  results: StrengthScore[];
  onSeeRoadmap: () => void;
}

export function CareerTeaser({ answers, content, personality, results, onSeeRoadmap }: Props) {
  const { isPaid } = usePayment();
  const viewed = useRef(false);

  useEffect(() => {
    if (!viewed.current) {
      viewed.current = true;
      trackBlockViewed("career_teaser", isPaid);
      trackUpsellView({
        sourceSection: "career_teaser",
        tier: "full_profile",
      });
    }
  }, [isPaid]);

  const topPath = content.careerPaths[0];
  const topStrength = results[0]?.strength;
  const segmentLabel = answers.careerStage.replace(/_/g, " ");

  const handleCTA = () => {
    trackCTAClicked({
      ctaText: "See your full roadmap",
      ctaLocation: "career_teaser",
    });
    trackUpsellClick({ tier: "full_profile", sourceSection: "career_teaser" });
    onSeeRoadmap();
  };

  return (
    <section className="branch-card career-teaser">
      <div className="branch-icon">🧭</div>
      <h3>{content.headline}</h3>
      <p className="branch-desc">{content.summary}</p>

      <div className="career-teaser-preview">
        <div className="career-teaser-path">
          <span className="career-teaser-label">Top career match</span>
          <div className="career-teaser-card">
            <span className="career-teaser-title">{topPath?.title}</span>
            <span className="career-teaser-fit">{topPath?.fitScore}% fit</span>
          </div>
          <p className="career-teaser-why">{topPath?.whyItMatches}</p>
        </div>

        <div className="career-teaser-strength">
          <span className="career-teaser-label">Your superpower</span>
          <div className="career-teaser-card">
            <span className="career-teaser-strength-name">{topStrength?.name}</span>
            <span className="career-teaser-strength-domain">{topStrength?.domain}</span>
          </div>
          <p className="career-teaser-strength-desc">
            As a {personality.type} {segmentLabel}, your {topStrength?.name?.toLowerCase()} is your career edge.
          </p>
        </div>
      </div>

      <div className="career-teaser-lock">
        <p>Unlock all {content.careerPaths.length} career paths, skill gap analysis, and personalized tips for your segment.</p>
        <button className="btn-start btn-upgrade" onClick={handleCTA}>
          See Your Full Roadmap
        </button>
        <p className="upgrade-subtitle">Included in Full Profile</p>
      </div>
    </section>
  );
}