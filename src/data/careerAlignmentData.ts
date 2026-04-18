// Career alignment scoring tables used by CareerAlignmentBlock.

// Industries grouped by how well they fit each primary DISC style.
// A user's industry gets scored based on how many of their DISC styles appear here.
export const DISC_INDUSTRY_FIT: Record<string, string[]> = {
  D: ["technology", "finance", "consulting", "startup", "venture capital", "law", "executive", "sales", "real estate", "military", "construction", "logistics"],
  I: ["marketing", "advertising", "public relations", "media", "entertainment", "education", "nonprofit", "hr", "human resources", "coaching", "hospitality", "retail", "events"],
  S: ["healthcare", "nursing", "education", "social services", "hr", "human resources", "customer service", "nonprofit", "administration", "counseling", "government"],
  C: ["engineering", "finance", "accounting", "science", "research", "it", "software", "data", "quality", "compliance", "architecture", "analytics", "audit"],
};

// Role keyword → category mapping for job title parsing.
export type RoleCategory = "technical" | "leadership" | "creative" | "people" | "sales" | "operations" | "research" | "other";

export const ROLE_KEYWORDS: Record<RoleCategory, string[]> = {
  technical: ["engineer", "developer", "architect", "programmer", "devops", "sysadmin", "it ", "data ", "scientist", "analyst", "security", "cto", "tech lead"],
  leadership: ["manager", "director", "vp", "vice president", "president", "ceo", "coo", "cfo", "head of", "chief", "lead", "principal", "senior manager", "general manager"],
  creative: ["designer", "writer", "artist", "creative", "content", "brand", "ux", "ui", "filmmaker", "photographer", "editor", "producer", "copywriter", "art director"],
  people: ["hr", "human resources", "recruiter", "coach", "therapist", "counselor", "consultant", "trainer", "teacher", "professor", "educator", "social worker", "nurse", "doctor"],
  sales: ["sales", "account executive", "account manager", "business development", "growth", "marketing", "partnerships", "customer success"],
  operations: ["operations", "project manager", "product manager", "program manager", "supply chain", "logistics", "scrum", "agile", "coordinator", "administrator"],
  research: ["researcher", "scientist", "analyst", "academic", "professor", "phd", "postdoc", "investigator", "auditor", "compliance"],
  other: [],
};

// Which role categories align with each DISC style.
export const DISC_ROLE_FIT: Record<string, RoleCategory[]> = {
  D: ["leadership", "sales", "operations"],
  I: ["sales", "creative", "people"],
  S: ["people", "operations", "research"],
  C: ["technical", "research", "operations"],
};

// DISC + current role category → suggested pivot roles (3 adjacent options).
export const PIVOT_SUGGESTIONS: Record<string, Partial<Record<RoleCategory, string[]>>> = {
  D: {
    technical: ["Product Manager", "Engineering Manager", "Technical Co-founder"],
    creative: ["Creative Director", "Brand Strategist", "Head of Marketing"],
    people: ["Chief People Officer", "Director of Talent", "Executive Coach"],
    research: ["Strategy Consultant", "Market Intelligence Lead", "Venture Analyst"],
    sales: ["VP of Sales", "Chief Revenue Officer", "Business Development Director"],
    operations: ["COO", "VP of Operations", "Chief of Staff"],
    leadership: ["CEO / Founder", "Managing Director", "Executive Consultant"],
    other: ["General Manager", "Strategy Director", "Operations Lead"],
  },
  I: {
    technical: ["Developer Advocate", "Product Designer", "UX Lead"],
    creative: ["Content Strategist", "Creative Director", "Brand Lead"],
    people: ["Head of Culture", "Talent Brand Manager", "People Operations Lead"],
    research: ["UX Researcher", "Brand Consultant", "Market Researcher"],
    sales: ["VP of Marketing", "Community Lead", "Head of Partnerships"],
    operations: ["Program Manager", "Events Manager", "Community Operations"],
    leadership: ["Chief Marketing Officer", "Chief People Officer", "Startup Founder"],
    other: ["Brand Ambassador", "Growth Lead", "Communications Manager"],
  },
  S: {
    technical: ["Engineering Manager", "QA Lead", "Implementation Consultant"],
    creative: ["Art Director", "Curriculum Designer", "Instructional Designer"],
    people: ["HR Business Partner", "Director of People", "Organizational Development"],
    research: ["Clinical Researcher", "Policy Analyst", "Program Evaluator"],
    sales: ["Customer Success Manager", "Account Manager", "Client Relations Lead"],
    operations: ["Project Manager", "Operations Coordinator", "Chief of Staff"],
    leadership: ["Director of HR", "Head of Customer Experience", "VP of People"],
    other: ["Patient Advocate", "Social Impact Manager", "Community Relations"],
  },
  C: {
    technical: ["Staff Engineer", "Solutions Architect", "Principal Data Scientist"],
    creative: ["Technical Writer", "UX Researcher", "Information Architect"],
    people: ["Learning & Development Lead", "HR Analytics", "Organizational Effectiveness"],
    research: ["Research Director", "Senior Analyst", "Scientific Advisor"],
    sales: ["Sales Engineer", "Technical Account Manager", "Pre-Sales Consultant"],
    operations: ["Process Improvement Manager", "BI Lead", "Quality Director"],
    leadership: ["CTO", "Chief Compliance Officer", "VP of Engineering"],
    other: ["Risk Manager", "Data Governance Lead", "Audit Director"],
  },
};

export const INDUSTRY_OPTIONS = [
  "Technology / Software",
  "Finance / Banking",
  "Healthcare / Medicine",
  "Education",
  "Marketing / Advertising",
  "Sales / Business Development",
  "Consulting",
  "Engineering",
  "Science / Research",
  "Media / Entertainment",
  "Nonprofit / Social Impact",
  "Government / Public Sector",
  "Real Estate",
  "Legal",
  "Human Resources",
  "Startup / Entrepreneurship",
  "Other",
] as const;

export type IndustryOption = (typeof INDUSTRY_OPTIONS)[number];

export type IndustryMatch = "strong" | "partial" | "mismatch";

export interface CareerAlignmentResult {
  roleScore: number;         // 0–100
  industryMatch: IndustryMatch;
  currentCategory: RoleCategory;
  pivotRoles: string[];
  discPrimary: string;
}

// Classify job title into a role category.
export function classifyRole(jobTitle: string): RoleCategory {
  const lower = jobTitle.toLowerCase();
  for (const [cat, keywords] of Object.entries(ROLE_KEYWORDS) as [RoleCategory, string[]][]) {
    if (cat === "other") continue;
    if (keywords.some((kw) => lower.includes(kw))) return cat;
  }
  return "other";
}

// Normalize industry dropdown value to lowercase tokens for matching.
function normalizeIndustry(industry: IndustryOption): string {
  return industry.toLowerCase().replace(/[/()]/g, " ");
}

// Score how well the DISC primary style fits the given industry (0–100).
function scoreIndustry(discPrimary: string, industry: IndustryOption): IndustryMatch {
  const normalized = normalizeIndustry(industry);
  const fits = DISC_INDUSTRY_FIT[discPrimary] ?? [];
  const matchCount = fits.filter((term) => normalized.includes(term)).length;
  if (matchCount >= 2) return "strong";
  if (matchCount === 1) return "partial";
  return "mismatch";
}

// Score role fit: how well the current role category aligns with the DISC style (0–100).
function scoreRole(discPrimary: string, category: RoleCategory): number {
  const fits = DISC_ROLE_FIT[discPrimary] ?? [];
  const idx = fits.indexOf(category);
  if (idx === 0) return 88 + Math.floor(Math.random() * 8); // primary fit
  if (idx === 1) return 72 + Math.floor(Math.random() * 10);
  if (idx === 2) return 58 + Math.floor(Math.random() * 10);
  return 35 + Math.floor(Math.random() * 18); // misaligned but not zero
}

// Deterministic jitter seeded by strings (avoids hydration issues).
function stableJitter(seed: string, range: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) & 0xffff;
  return hash % range;
}

export function computeCareerAlignment(
  jobTitle: string,
  industry: IndustryOption,
  discStyle: string, // e.g. "D", "I", "S", "C", or "SC", "DI" etc.
  personalityType: string,
): CareerAlignmentResult {
  const discPrimary = discStyle[0] ?? "I";
  const category = classifyRole(jobTitle);
  const industryMatch = scoreIndustry(discPrimary, industry);

  // Base role score from DISC fit, nudged by industry match
  let roleScore = scoreRole(discPrimary, category);
  if (industryMatch === "strong") roleScore = Math.min(100, roleScore + 8);
  if (industryMatch === "mismatch") roleScore = Math.max(20, roleScore - 10);

  // Deterministic final tweak (avoids random drift on re-renders)
  const jitter = stableJitter(jobTitle + discStyle + personalityType, 6);
  roleScore = Math.min(100, roleScore + jitter - 3);

  const pivotMap = PIVOT_SUGGESTIONS[discPrimary];
  const pivotRoles = (pivotMap?.[category] ?? pivotMap?.["other"] ?? ["Career Coach", "Strategic Advisor", "Independent Consultant"]).slice(0, 3);

  return { roleScore, industryMatch, currentCategory: category, pivotRoles, discPrimary };
}
