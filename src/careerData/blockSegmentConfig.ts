import type { IntakeAnswers } from "./segmentConfig";

// Segment-configurable content block IDs (reorderable per audience)
export type BlockId = "books" | "careers" | "famous" | "stress" | "leadership" | "communities";

// Full set of content block IDs rendered inside the results page
export type ContentBlockId =
  | BlockId
  | "communication"  // paid-only: DISC communication guide
  | "blind_spots"    // paid-only: bottom-5 strengths
  | "bonus";         // paid-only: segment-specific bonus content

// Internal routing key — maps spec segment names to stable identifiers
export type SegmentKey =
  | "default"
  | "university"
  | "early_career"
  | "plateaued"
  | "career_changer"
  | "senior"
  | "solopreneur";

// Derive a segment routing key from intake answers.
// ageRange "55+" takes precedence over careerStage — those users get the
// "senior" block layout regardless of what stage they selected.
export function getBlockSegment(answers: IntakeAnswers | null): SegmentKey {
  if (!answers) return "default";
  if (answers.ageRange === "55+") return "senior";
  switch (answers.careerStage) {
    case "university": return "university";
    case "early_career": return "early_career";
    case "plateaued": return "plateaued";
    case "career_changer": return "career_changer";
    // return_to_work is the closest current intake value for solopreneur
    case "return_to_work": return "solopreneur";
    default: return "default";
  }
}

// Ordered list of promotable block IDs per segment.
// Communication/blind-spots (paid) and share/invite are fixed; only these 6
// slots are reordered.
export const BLOCK_ORDER: Record<SegmentKey, BlockId[]> = {
  default:       ["books", "careers", "famous", "stress", "leadership", "communities"],
  university:    ["books", "careers", "famous", "stress", "leadership", "communities"],
  early_career:  ["books", "careers", "famous", "stress", "leadership", "communities"],
  plateaued:     ["books", "careers", "leadership", "famous", "stress", "communities"],
  career_changer: ["careers", "books", "famous", "stress", "leadership", "communities"],
  senior:        ["careers", "books", "communities", "famous", "stress", "leadership"],
  solopreneur:   ["books", "careers", "famous", "communities", "stress", "leadership"],
};

export interface BlockOverride {
  title?: string;
  subtitle?: string;
}

// Per-segment, per-block overrides for title and/or subtitle.
export const BLOCK_OVERRIDES: Partial<Record<SegmentKey, Partial<Record<BlockId, BlockOverride>>>> = {
  early_career: {
    careers: { subtitle: "Matched to your current level — and where to grow next." },
  },
  career_changer: {
    books: { title: "Books for Your Reinvention" },
  },
  senior: {
    books: { title: "Books for Your Next Chapter" },
  },
  solopreneur: {
    communities: { subtitle: "Find Your People" },
  },
};

// Returns the ordered content block IDs for the results page.
// Free users get only the segment-ordered promotable blocks.
// Paid users also get paid-only blocks prepended and the bonus block appended.
export function getContentBlockIds(isPaid: boolean, segment: SegmentKey): ContentBlockId[] {
  const segmentOrdered = BLOCK_ORDER[segment] as ContentBlockId[];
  if (isPaid) {
    return ["communication", "blind_spots", ...segmentOrdered, "bonus"];
  }
  return segmentOrdered;
}

// Overrides for the AI Playbook block title in ResultsScreen.
export const AI_PLAYBOOK_TITLE: Partial<Record<SegmentKey, string>> = {
  career_changer: "Your Reinvention Playbook",
  solopreneur: "Your Founder's Blind Spot Report",
};
