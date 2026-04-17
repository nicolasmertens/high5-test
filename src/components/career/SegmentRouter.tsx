import { useMemo } from "react";
import type { PersonalityResult } from "../../data/derivations";
import type { StrengthScore } from "../../hooks/useAssessment";
import type { IntakeAnswers } from "../../careerData/segmentConfig";
import { resolveSegment } from "../../careerData/segmentConfig";
import { getVariantContent } from "../../careerData/byPersonalityAndSegment";
import { getGenericContent } from "../../careerData/careerPathLibrary";
import type { SegmentContent } from "../../careerData/careerPathLibrary";
import { getSkillGaps } from "../../careerData/skillGapData";

export interface SegmentRouteResult {
  segment: ReturnType<typeof resolveSegment>;
  content: SegmentContent;
  skillGaps: ReturnType<typeof getSkillGaps>;
}

export function useSegmentRouter(
  answers: IntakeAnswers | null,
  personality: PersonalityResult,
  results: StrengthScore[],
): SegmentRouteResult | null {
  return useMemo(() => {
    if (!answers) return null;

    const segment = resolveSegment(answers);
    const variant = getVariantContent(personality.type, answers.careerStage);

    const content = variant || getGenericContent(answers.careerStage);

    const topStrengths = results.slice(0, 5).map((r) => r.strength.id);
    const bottomStrengths = results.slice(15).map((r) => r.strength.id);
    const skillGaps = getSkillGaps(topStrengths, bottomStrengths, answers.careerStage);

    return { segment, content, skillGaps };
  }, [answers, personality.type, results]);
}