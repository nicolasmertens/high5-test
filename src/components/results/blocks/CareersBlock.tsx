import { useEffect, useRef } from "react";
import { type StrengthScore } from "../../../hooks/useAssessment";
import { type PersonalityResult } from "../../../data/derivations";
import { getCareerSuggestions } from "../../../data/profileContent";
import { trackBlockViewed } from "../../../utils/analytics";
import { type BlockOverride } from "../../../careerData/blockSegmentConfig";

interface Props {
  results: StrengthScore[];
  personality: PersonalityResult;
  isPaid: boolean;
  override?: BlockOverride;
}

export function CareersBlock({ results, personality, isPaid, override }: Props) {
  const top5 = results.slice(0, 5);
  const tracked = useRef(false);

  useEffect(() => {
    if (!isPaid && !tracked.current) {
      tracked.current = true;
      trackBlockViewed("careers", false);
    }
  }, [isPaid]);

  return (
    <section className="branch-card">
      <div className="branch-icon">💼</div>
      <h3>{override?.title ?? "Career Paths That Fit You"}</h3>
      <p className="branch-desc">
        {override?.subtitle ??
          `Based on your ${personality.type} personality and top strengths (${top5.map((r) => r.strength.name).join(", ")}), these career directions naturally align with how you're wired.`}
      </p>
      <div className="branch-preview">
        <div className="career-tags">
          {getCareerSuggestions(personality.type, top5).map((career) => (
            <span key={career} className="career-tag">
              {career}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
