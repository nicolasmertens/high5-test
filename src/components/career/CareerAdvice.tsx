import type { SegmentContent } from "../../careerData/careerPathLibrary";
import type { SkillGap } from "../../careerData/careerPathLibrary";
import { CareerPathCard } from "./CareerPathCard";
import { SkillGapRadar } from "./SkillGapRadar";
import { InterviewTipCard } from "./InterviewTipCard";
import type { CareerStage } from "../../careerData/segmentConfig";

interface Props {
  content: SegmentContent;
  skillGaps: SkillGap[];
  segmentId: CareerStage;
}

export function CareerAdvice({ content, skillGaps, segmentId }: Props) {
  return (
    <>
      <section className="branch-card career-advice-section">
        <div className="branch-icon">🧭</div>
        <h3>{content.headline}</h3>
        <p className="branch-desc">{content.summary}</p>
        <div className="career-paths-list">
          {content.careerPaths.map((path, i) => (
            <CareerPathCard key={path.id} path={path} index={i} />
          ))}
        </div>
      </section>

      <SkillGapRadar gaps={skillGaps} />

      {content.interviewTip && (
        <InterviewTipCard
          tip={content.interviewTip}
          coverLetterTip={content.coverLetterTip}
          segment={segmentId}
        />
      )}

      {content.nextSteps && content.nextSteps.length > 0 && (
        <section className="branch-card career-next-steps">
          <div className="branch-icon">🚀</div>
          <h3>Your Next Steps</h3>
          <ol className="career-next-steps-list">
            {content.nextSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}