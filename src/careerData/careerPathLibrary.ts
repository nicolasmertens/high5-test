export interface CareerPath {
  id: string;
  title: string;
  fitScore: number;
  description: string;
  whyItMatches: string;
  strengthsUsed: string[];
  growthTip: string;
  networkingStrategy: string;
}

export interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  developmentTip: string;
}

export interface SegmentContent {
  headline: string;
  summary: string;
  careerPaths: CareerPath[];
  skillGaps: SkillGap[];
  interviewTip?: string;
  coverLetterTip?: string;
  nextSteps: string[];
}

import type { CareerStage } from "./segmentConfig";

const GENERIC_PATHS: CareerPath[] = [
  {
    id: "strategic_advisor",
    title: "Strategic Advisor / Consultant",
    fitScore: 78,
    description: "Use your analytical strengths to help organizations solve complex problems and make better decisions.",
    whyItMatches: "Your natural ability to see patterns and connect ideas makes you effective at breaking down complex challenges.",
    strengthsUsed: ["Strategic thinking", "Pattern recognition", "Independent analysis"],
    growthTip: "Build expertise in a specific industry vertical to command higher-value engagements.",
    networkingStrategy: "Attend industry conferences and contribute thought leadership on LinkedIn.",
  },
  {
    id: "product_strategist",
    title: "Product Strategist",
    fitScore: 72,
    description: "Bridge user needs and business goals by shaping the direction of products and services.",
    whyItMatches: "Your mix of analytical rigor and creative thinking maps well to defining what to build and why.",
    strengthsUsed: ["Systems thinking", "User empathy", "Prioritization"],
    growthTip: "Learn to translate strategy into execution — product sense without shipping is just theory.",
    networkingStrategy: "Join product management communities and ship side projects to build credibility.",
  },
  {
    id: "research_lead",
    title: "Research Lead / Analyst",
    fitScore: 68,
    description: "Go deep on complex topics and produce insights that inform decisions at every level.",
    whyItMatches: "Your intellectual curiosity and depth of focus are assets in roles that reward thoroughness.",
    strengthsUsed: ["Deep focus", "Information synthesis", "Objective analysis"],
    growthTip: "Pair research depth with communication skills — the best analysts make their findings accessible.",
    networkingStrategy: "Publish analyses and build a reputation in niche communities.",
  },
];

const GENERIC_GAPS: SkillGap[] = [
  {
    skill: "Public speaking",
    currentLevel: 35,
    requiredLevel: 65,
    gap: 30,
    developmentTip: "Join a local speaking group or start by presenting to small, friendly audiences.",
  },
  {
    skill: "Networking",
    currentLevel: 40,
    requiredLevel: 70,
    gap: 30,
    developmentTip: "Set a goal to have one quality conversation per week with someone outside your usual circle.",
  },
  {
    skill: "Delegation",
    currentLevel: 45,
    requiredLevel: 70,
    gap: 25,
    developmentTip: "Start by delegating small decisions and review outcomes weekly to build trust in the process.",
  },
];

const SEGMENT_DEFAULTS: Record<CareerStage, { headline: string; summary: string; nextSteps: string[] }> = {
  university: {
    headline: "Your career starts here",
    summary: "As a student or recent grad, your personality strengths are already shaping what will feel natural and fulfilling. Here's how to use them.",
    nextSteps: [
      "Choose internships and projects that align with your top strengths",
      "Build a portfolio that demonstrates your natural approach",
      "Seek mentors who share your personality type",
    ],
  },
  early_career: {
    headline: "Make your next move count",
    summary: "You've built a foundation — now it's about aligning your trajectory with what actually energizes you.",
    nextSteps: [
      "Audit your current role: what percent of your time uses your top 3 strengths?",
      "Seek stretch assignments that align with your natural talents",
      "Start mentoring — teaching reinforces your strengths",
    ],
  },
  mid_career: {
    headline: "Level up your impact",
    summary: "You're past proving yourself — now it's about multiplying your impact through strategic positioning.",
    nextSteps: [
      "Transition from doing to enabling — your strengths scale through others",
      "Build cross-functional relationships aligned with your profile",
      "Negotiate for roles that let you play to strengths 70%+ of the time",
    ],
  },
  career_changer: {
    headline: "Your strengths travel with you",
    summary: "Changing careers doesn't start from scratch — your transferable strengths are your biggest asset.",
    nextSteps: [
      "Map your strengths to 3 target roles you haven't considered yet",
      "Translate your experience into the language of your new field",
      "Use informational interviews to test-fit before you commit",
    ],
  },
  plateaued: {
    headline: "Reignite your trajectory",
    summary: "Feeling stuck usually means your current role has stopped using your best strengths. Here's how to course-correct.",
    nextSteps: [
      "Identify which strengths are underused in your current role",
      "Explore lateral moves that energize different strengths",
      "Consider whether meaning comes from the work itself or from the impact",
    ],
  },
  return_to_work: {
    headline: "Your strengths are your re-entry advantage",
    summary: "Time away doesn't erase your strengths — it often sharpens them. Here's how to position yourself.",
    nextSteps: [
      "Lead with your personality strengths on your resume and LinkedIn",
      "Frame your break as a period of growth, not a gap",
      "Target roles where adaptability and fresh perspective are valued",
    ],
  },
};

export function getGenericContent(segment: CareerStage): SegmentContent {
  const defaults = SEGMENT_DEFAULTS[segment] || SEGMENT_DEFAULTS.early_career;
  return {
    headline: defaults.headline,
    summary: defaults.summary,
    careerPaths: GENERIC_PATHS,
    skillGaps: GENERIC_GAPS,
    nextSteps: defaults.nextSteps,
  };
}