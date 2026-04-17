export type AgeRange = "18-24" | "25-34" | "35-44" | "45-54" | "55+";
export type CareerStage = "university" | "early_career" | "mid_career" | "career_changer" | "plateaued" | "return_to_work";
export type TestReason = "career_guidance" | "self_discovery" | "team_building" | "curiosity" | "academic_requirement";

export interface IntakeAnswers {
  ageRange: AgeRange;
  careerStage: CareerStage;
  testReason: TestReason;
}

export interface SegmentDefinition {
  id: CareerStage;
  label: string;
  description: string;
  ageRanges: AgeRange[];
  defaultReasons: TestReason[];
}

export const SEGMENTS: SegmentDefinition[] = [
  {
    id: "university",
    label: "University Student",
    description: "You're still studying or recently graduated, figuring out your first career direction.",
    ageRanges: ["18-24", "25-34"],
    defaultReasons: ["career_guidance", "academic_requirement", "self_discovery"],
  },
  {
    id: "early_career",
    label: "Early Career",
    description: "You have a few years of experience and want to make sure you're on the right track.",
    ageRanges: ["25-34", "35-44"],
    defaultReasons: ["career_guidance", "self_discovery"],
  },
  {
    id: "mid_career",
    label: "Mid-Career Growth",
    description: "You're established in your career and looking for the next level of impact.",
    ageRanges: ["35-44", "45-54"],
    defaultReasons: ["career_guidance", "team_building"],
  },
  {
    id: "career_changer",
    label: "Career Changer",
    description: "You're considering a significant shift in your career direction.",
    ageRanges: ["25-34", "35-44", "45-54"],
    defaultReasons: ["career_guidance", "self_discovery"],
  },
  {
    id: "plateaued",
    label: "Plateaued Professional",
    description: "You're experienced but feeling stuck, unfulfilled, or uncertain about what comes next.",
    ageRanges: ["35-44", "45-54", "55+"],
    defaultReasons: ["career_guidance", "self_discovery"],
  },
  {
    id: "return_to_work",
    label: "Returning to Work",
    description: "You're re-entering the workforce after a break and need to position your strengths.",
    ageRanges: ["25-34", "35-44", "45-54"],
    defaultReasons: ["career_guidance", "self_discovery"],
  },
];

export const AGE_RANGES: { value: AgeRange; label: string }[] = [
  { value: "18-24", label: "18–24" },
  { value: "25-34", label: "25–34" },
  { value: "35-44", label: "35–44" },
  { value: "45-54", label: "45–54" },
  { value: "55+", label: "55+" },
];

export const CAREER_STAGES: { value: CareerStage; label: string }[] = [
  { value: "university", label: "University student / recent grad" },
  { value: "early_career", label: "Early career (1–5 years experience)" },
  { value: "mid_career", label: "Mid-career, looking to grow" },
  { value: "career_changer", label: "Considering a career change" },
  { value: "plateaued", label: "Established but feeling stuck" },
  { value: "return_to_work", label: "Returning to work after a break" },
];

export const TEST_REASONS: { value: TestReason; label: string }[] = [
  { value: "career_guidance", label: "Career guidance" },
  { value: "self_discovery", label: "Self-discovery" },
  { value: "team_building", label: "Team building at work" },
  { value: "curiosity", label: "Just curious" },
  { value: "academic_requirement", label: "School or course requirement" },
];

export function resolveSegment(answers: IntakeAnswers): SegmentDefinition {
  const match = SEGMENTS.find((s) => s.id === answers.careerStage);
  return match || SEGMENTS[1];
}

const INTAKE_STORAGE_KEY = "1test_career_intake";

export function saveIntakeAnswers(answers: IntakeAnswers): void {
  try {
    localStorage.setItem(INTAKE_STORAGE_KEY, JSON.stringify(answers));
  } catch {
    // storage unavailable
  }
  try {
    fetch("/api/career-intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers),
    }).catch(() => {
      // network error — best effort
    });
  } catch {
    // fetch unavailable
  }
}

export function loadIntakeAnswers(): IntakeAnswers | null {
  try {
    const stored = localStorage.getItem(INTAKE_STORAGE_KEY);
    if (stored) return JSON.parse(stored) as IntakeAnswers;
  } catch {
    // storage unavailable
  }
  return null;
}