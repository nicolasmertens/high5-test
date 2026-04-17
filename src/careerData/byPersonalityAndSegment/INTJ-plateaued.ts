import type { CareerPath } from "../careerPathLibrary";

const CAREER_PATHS: CareerPath[] = [
  {
    id: "chief_strategy",
    title: "Chief Strategy Officer / Strategic Advisor",
    fitScore: 94,
    description: "Shape organizational direction at the highest level, combining big-picture thinking with relentless execution.",
    whyItMatches: "Plateaued INTJs have the experience and strategic depth organizations desperately need but can't develop internally.",
    strengthsUsed: ["Strategic vision", "Systems-level thinking", "Independent judgment"],
    growthTip: "Your plateau isn't a ceiling — it's a signal that your current role underutilizes your capacity for strategic impact.",
    networkingStrategy: "Write about macro trends and strategic frameworks. Your next chapter starts with being recognized as a thought leader.",
  },
  {
    id: "board_advisor",
    title: "Board Advisor / Fractional CTO",
    fitScore: 88,
    description: "Provide high-level guidance to multiple organizations, diversifying your impact and income simultaneously.",
    whyItMatches: "INTJs at this stage have accumulated enough depth to advise across domains. The variety recharges analytical minds.",
    strengthsUsed: ["Cross-industry pattern recognition", "Technical judgment", "Long-range planning"],
    growthTip: "Transitioning from operator to advisor requires documentation. Start writing down your frameworks now.",
    networkingStrategy: "Join advisory boards and angel networks. The right connections come from demonstrating value in small engagements first.",
  },
  {
    id: "research_leadership",
    title: "Research Director / Think Tank Lead",
    fitScore: 80,
    description: "Lead research teams tackling systemic challenges, from policy to technology strategy.",
    whyItMatches: "Your ability to synthesize complex information and see where systems break down is exactly what research leadership demands.",
    strengthsUsed: ["Deep analytical capacity", "Quality standards", "Long-term focus"],
    growthTip: "Research leadership requires building teams that complement your blind spots — especially in communication and stakeholder management.",
    networkingStrategy: "Publish. Speak. Aim for niche authority — 1,000 people who deeply value your thinking beats 100,000 casual followers.",
  },
];

const SKILL_GAPS = [
  { skill: "Self-advocacy", currentLevel: 35, requiredLevel: 70, gap: 35, developmentTip: "You've likely been promoted by others recognizing your competence. At this stage, you need to advocate for the role YOU want, not the one others think fits you." },
  { skill: "Career strategy", currentLevel: 40, requiredLevel: 70, gap: 30, developmentTip: "Think of your next chapter as a strategy problem. What's the leverage point? What shifts create the most optionality?" },
  { skill: "Burnout prevention", currentLevel: 30, requiredLevel: 60, gap: 30, developmentTip: "INTJs burn out when they can't see the impact of their work. Audit what's draining you and protect 20% of your time for work that recharges your intellectual curiosity." },
  { skill: "Networking", currentLevel: 25, requiredLevel: 55, gap: 30, developmentTip: "You don't need small talk. Schedule one substantive conversation per month with someone who challenges your thinking." },
];

export default {
  headline: "Reignite your trajectory with strategic leverage",
  summary: "As a plateaued INTJ, your problem isn't competence — it's positioning. You've likely been doing work that's beneath your capability. Time to fix that.",
  careerPaths: CAREER_PATHS,
  skillGaps: SKILL_GAPS,
  nextSteps: [
    "Audit your current role: what percentage of your time uses your top 3 strengths?",
    "Identify 2-3 roles that would multiply your impact without requiring a complete reset",
    "Start writing or teaching publicly — thought leadership can unlock fractional and advisory roles",
  ],
};