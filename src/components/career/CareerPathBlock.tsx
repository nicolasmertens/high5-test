import { useState, useEffect, useRef, useCallback } from "react";
import type { StrengthScore } from "../../hooks/useAssessment";
import type { PersonalityResult } from "../../data/derivations";
import type { IntakeAnswers } from "../../careerData/segmentConfig";
import { usePayment } from "../../contexts/PaymentContext";
import { trackBlockViewed, trackCTAClicked, trackUpsellClick, trackUpsellView } from "../../utils/analytics";
import { IntakeQuestions } from "./IntakeQuestions";
import { useSegmentRouter } from "./SegmentRouter";
import { CareerTeaser } from "./CareerTeaser";
import { CareerAdvice } from "./CareerAdvice";

interface Props {
  results: StrengthScore[];
  personality: PersonalityResult;
}

export function CareerPathBlock({ results, personality }: Props) {
  const { isPaid } = usePayment();
  const [intakeAnswers, setIntakeAnswers] = useState<IntakeAnswers | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const viewed = useRef(false);

  useEffect(() => {
    if (!viewed.current) {
      viewed.current = true;
      trackBlockViewed("career_block_viewed", isPaid);
    }
  }, [isPaid]);

  const segmentData = useSegmentRouter(intakeAnswers, personality, results);

  const handleIntakeComplete = useCallback((answers: IntakeAnswers) => {
    setIntakeAnswers(answers);
  }, []);

  const handleShowRoadmap = () => {
    trackCTAClicked({
      ctaText: "See your roadmap",
      ctaLocation: "career_teaser",
    });
    trackUpsellClick({ tier: "full_profile", sourceSection: "career_teaser" });
    trackUpsellView({
      sourceSection: "career_upsell",
      tier: "full_profile",
    });
    setShowUpgrade(true);
  };

  if (!intakeAnswers) {
    return <IntakeQuestions onComplete={handleIntakeComplete} personalityType={personality.type} />;
  }

  if (!segmentData) return null;

  const { content, skillGaps, segment } = segmentData;

  if (isPaid) {
    return (
      <CareerAdvice
        content={content}
        skillGaps={skillGaps}
        segmentId={segment.id}
      />
    );
  }

  return (
    <>
      <CareerTeaser
        answers={intakeAnswers}
        content={content}
        personality={personality}
        results={results}
        onSeeRoadmap={handleShowRoadmap}
      />
      {showUpgrade && (
        <div className="career-upgrade-overlay" onClick={() => setShowUpgrade(false)}>
          <div className="career-upgrade-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Unlock Your Full Career Roadmap</h3>
            <p>Get all {content.careerPaths.length} career paths, skill gap analysis, and personalized tips for your segment — included in the Full Profile.</p>
            <button
              className="btn-start btn-upgrade"
              onClick={() => {
                trackCTAClicked({
                  ctaText: "Get Full Profile",
                  ctaLocation: "career_upsell_modal",
                });
                const checkoutRes = fetch("/api/create-checkout-session", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ tier: "full_profile" }),
                });
                checkoutRes
                  .then((r) => r.ok ? r.json() : null)
                  .then((data) => {
                    if (data?.url) window.location.href = data.url;
                  })
                  .catch(() => {});
              }}
            >
              Get Full Profile
            </button>
            <button className="btn-link career-upgrade-close" onClick={() => setShowUpgrade(false)}>
              Maybe later
            </button>
          </div>
        </div>
      )}
    </>
  );
}