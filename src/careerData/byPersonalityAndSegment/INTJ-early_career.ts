import type { CareerPath } from "../careerPathLibrary";

const CAREER_PATHS: CareerPath[] = [
  {
    id: "strategy_director",
    title: "Strategy Director / Head of Product Strategy",
    fitScore: 93,
    description: "Set long-term direction for organizations by synthesizing market data, internal capabilities, and emerging trends.",
    whyItMatches: "Your combination of analytical depth and strategic vision makes you the rare person who can both diagnose and prescribe.",
    strengthsUsed: ["Strategic thinking", "Systems-level analysis", "Independent judgment"],
    growthTip: "The jump from analyst to strategist is political, not intellectual. Learn to build coalitions around your ideas.",
    networkingStrategy: "Write strategic memos and share them internally. INTJs influence through written clarity, not meeting charisma.",
  },
  {
    id: "chief_architect",
    title: "Chief Architect / VP Engineering",
    fitScore: 88,
    description: "Lead technical direction for an entire organization, making org-level decisions about platforms, teams, and trade-offs.",
    whyItMatches: "INTJs naturally see the system others are building inside of, which makes you invaluable at the architecture level.",
    strengthsUsed: ["Systems thinking", "Technical depth", "Long-range planning"],
    growthTip: "Management requires empathy as much as intellect. Your biggest growth edge is navigating human resistance to change.",
    networkingStrategy: "Mentor emerging technical leaders. Your reputation compounds when your direct reports become leaders.",
  },
  {
    id: "independent_consultant",
    title: "Independent Consultant / Advisor",
    fitScore: 80,
    description: "Choose your clients, set your terms, and apply your expertise where it creates the most impact.",
    whyItMatches: "INTJs thrive in self-directed environments where competence is the currency. Independence and depth are your natural state.",
    strengthsUsed: ["Self-direction", "Deep expertise", "Strategic problem-solving"],
    growthTip: "The hardest part isn't the work — it's building the pipeline. Invest 20% of your time in business development.",
    networkingStrategy: "A strong LinkedIn presence and published frameworks will attract the right clients. Don't network — publish.",
  },
];

const SKILL_GAPS = [
  { skill: "Executive presence", currentLevel: 45, requiredLevel: 75, gap: 30, developmentTip: "Presence isn't about volume — it's about pause. INTJs gain presence by slowing down and delivering compressed insights." },
  { skill: "Cross-functional leadership", currentLevel: 40, requiredLevel: 70, gap: 30, developmentTip: "Map each stakeholder's incentives. Leading across functions starts with understanding what each team optimizes for." },
  { skill: "Delegation", currentLevel: 35, requiredLevel: 65, gap: 30, developmentTip: "Delegate outcomes, not tasks. Define what success looks like and trust the process you've architected." },
];

export default {
  headline: "Your depth is your differentiator",
  summary: "As an INTJ in early career, you've likely already noticed you see patterns others miss. Now it's time to turn that perception into professional leverage.",
  careerPaths: CAREER_PATHS,
  skillGaps: SKILL_GAPS,
  nextSteps: [
    "Seek roles where you can own strategy, not just execute someone else's plan",
    "Build a reputation for one area of deep expertise before going broad",
    "Practice translating your vision into language that resonates with non-analytical stakeholders",
  ],
};