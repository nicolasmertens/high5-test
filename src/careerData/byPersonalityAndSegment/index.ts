import type { SegmentContent } from "../careerPathLibrary";
import type { CareerStage } from "../segmentConfig";

import INTJ_university from "./INTJ-university";
import INTJ_early_career from "./INTJ-early_career";
import INTJ_plateaued from "./INTJ-plateaued";
import ENFP_university from "./ENFP-university";
import ENFP_early_career from "./ENFP-early_career";
import ENFP_plateaued from "./ENFP-plateaued";
import ISTJ_university from "./ISTJ-university";
import ISTJ_early_career from "./ISTJ-early_career";
import ISTJ_plateaued from "./ISTJ-plateaued";
import ENTP_university from "./ENTP-university";
import ENTP_early_career from "./ENTP-early_career";
import ENTP_plateaued from "./ENTP-plateaued";

const variants: Record<string, SegmentContent> = {
  "INTJ-university": INTJ_university,
  "INTJ-early_career": INTJ_early_career,
  "INTJ-plateaued": INTJ_plateaued,
  "ENFP-university": ENFP_university,
  "ENFP-early_career": ENFP_early_career,
  "ENFP-plateaued": ENFP_plateaued,
  "ISTJ-university": ISTJ_university,
  "ISTJ-early_career": ISTJ_early_career,
  "ISTJ-plateaued": ISTJ_plateaued,
  "ENTP-university": ENTP_university,
  "ENTP-early_career": ENTP_early_career,
  "ENTP-plateaued": ENTP_plateaued,
};

export function getVariantContent(
  personalityType: string,
  segment: CareerStage,
): SegmentContent | null {
  const key = `${personalityType}-${segment}`;
  return variants[key] ?? null;
}