import type { CareerPath } from "../careerPathLibrary";

const CAREER_PATHS: CareerPath[] = [
  {
    id: "startup_founder",
    title: "Startup Founder / Entrepreneur",
    fitScore: 90,
    description: "Identify market gaps, build products from scratch, and persuade others to join your vision — before the data proves you right.",
    whyItMatches: "ENTPs are natural entrepreneurs. You see possibilities others miss and have the intellectual confidence to act on them.",
    strengthsUsed: ["Innovation", "Rapid ideation", "Persuasive arguments"],
    growthTip: "The biggest risk isn't a bad idea — it's never finishing a good one. Build execution discipline alongside your ideation.",
    networkingStrategy: "ENTPs attract people naturally. Channel that: host brainstorming dinners, join founder communities, and share half-baked ideas to attract co-conspirators.",
  },
  {
    id: "product_manager",
    title: "Product Manager / Innovation PM",
    fitScore: 86,
    description: "Navigate ambiguity and cross-functional complexity to ship products that change how people work or live.",
    whyItMatches: "You thrive in ambiguity,connect disparate ideas, and can argue any side — exactly what PM roles demand when requirements are unclear.",
    strengthsUsed: ["Systems thinking", "Debate skills", "Rapid prototyping mindset"],
    growthTip: "Great PMs prioritize ruthlessly. Your challenge isn't finding good ideas — it's killing the ones that aren't great.",
    networkingStrategy: "Ship side projects and write about product decisions. ENTPs build credibility through visible, opinionated work.",
  },
  {
    id: "strategy_consultant",
    title: "Strategy Consultant / Innovation Advisor",
    fitScore: 80,
    description: "Help organizations find new paths by challenging assumptions and connecting dots across industries.",
    whyItMatches: "ENTPs are built for consulting: fast learning, comfortable with ambiguity, excellent at finding leverage points in systems.",
    strengthsUsed: ["Rapid pattern matching", "Persuasive communication", "Cross-domain thinking"],
    growthTip: "Consulting requires follow-through too. The best consultants don't just diagnose — they stay to ensure implementation.",
    networkingStrategy: "Write provocative articles about industry trends. Your unconventional takes will attract the right clients and opportunities.",
  },
];

const SKILL_GAPS = [
  { skill: "Project management", currentLevel: 25, requiredLevel: 65, gap: 40, developmentTip: "ENTPs love starting, hate finishing. Use time-boxing and accountability partners to push projects to completion." },
  { skill: "Time management", currentLevel: 30, requiredLevel: 60, gap: 30, developmentTip: "Set artificial deadlines that are 20% earlier than real ones. Your brain treats flexible deadlines as suggestions." },
  { skill: "Written communication", currentLevel: 45, requiredLevel: 65, gap: 20, developmentTip: "Your verbal energy is unmatched. Learn to channel it into concise writing that reaches people who won't sit through your pitch." },
];

export default {
  headline: "Your ideas outpace everyone else — time to make them real",
  summary: "As an ENTP university student, you've probably changed your mind about your major three times and have ten startup ideas before breakfast. Here's how to focus that energy.",
  careerPaths: CAREER_PATHS,
  skillGaps: SKILL_GAPS,
  interviewTip: "ENTPs tend to riff in interviews. Turn that into a strength: prepare structured answers, but don't be afraid to think out loud. Interviewers love your energy — just land on concrete examples.",
  coverLetterTip: "Don't just show you're smart (they know). Show you can commit. Highlight one project you saw through from idea to outcome.",
  nextSteps: [
    "Pick ONE idea and commit to it for 90 days. No pivoting. Execution is your growth edge.",
    "Find a co-founder or accountability partner who complements your strengths with follow-through",
    "Apply to roles with high ambiguity — structured environments will frustrate you",
  ],
};