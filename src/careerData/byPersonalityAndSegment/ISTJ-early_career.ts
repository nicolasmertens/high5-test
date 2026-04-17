import type { CareerPath } from "../careerPathLibrary";

const CAREER_PATHS: CareerPath[] = [
  {
    id: "operations_director",
    title: "Operations Director / VP Operations",
    fitScore: 92,
    description: "Lead the systems that keep organizations running — from process design to team execution and scaling.",
    whyItMatches: "ISTJs in early career have usually proven their reliability. Operations leadership rewards exactly the consistency and systems-thinking you bring.",
    strengthsUsed: ["Process optimization", "Team coordination", "Dependable execution"],
    growthTip: "Operations leaders need strategic vision too. Push yourself to articulate WHY processes exist, not just HOW to follow them.",
    networkingStrategy: "ISTJs build networks through delivery. Leave every role with people who'd hire you again — that's your best networking strategy.",
  },
  {
    id: "project_manager",
    title: "Senior Project Manager / PMO Lead",
    fitScore: 87,
    description: "Orchestrate complex projects from planning through delivery, keeping teams aligned and stakeholders informed.",
    whyItMatches: "Your natural ability to track details, maintain schedules, and enforce accountability makes project management feel like second nature.",
    strengthsUsed: ["Detailed planning", "Timeline management", "Accountability tracking"],
    growthTip: "Move from managing tasks to managing stakeholder expectations. The real project management skill is people, not just Gantt charts.",
    networkingStrategy: "Join PMI and seek PMP certification. ISTJs benefit from the structured networking that professional certifications provide.",
  },
  {
    id: "data_analyst",
    title: "Data Analyst / Business Intelligence Lead",
    fitScore: 81,
    description: "Transform raw data into actionable intelligence that drives decision-making across the organization.",
    whyItMatches: "Your methodical approach and attention to detail are perfect for data work. ISTJs don't skip steps — and data rewards that discipline.",
    strengthsUsed: ["Analytical precision", "Systematic reporting", "Pattern recognition in data"],
    growthTip: "The best analysts don't just find patterns — they tell the story behind them. Invest in data visualization and communication skills.",
    networkingStrategy: "Share dashboards and reports publicly. Build a portfolio of analyses that demonstrate your rigor and clarity.",
  },
];

const SKILL_GAPS = [
  { skill: "Strategic thinking", currentLevel: 50, requiredLevel: 70, gap: 20, developmentTip: "Practice connecting your detailed work to the bigger picture. Before every project, ask: 'What business objective does this serve?'" },
  { skill: "Networking", currentLevel: 25, requiredLevel: 55, gap: 30, developmentTip: "Schedule one coffee chat per month with someone outside your team. Purpose-driven conversations play to your ISTJ strengths." },
  { skill: "Adaptability", currentLevel: 35, requiredLevel: 60, gap: 25, developmentTip: "Volunteer for one cross-functional project per quarter. Structured exposure to ambiguity builds resilience." },
];

export default {
  headline: "Turn your consistency into career currency",
  summary: "As an ISTJ in early career, your reliability is rare and valuable. Most people can't do what you do day after day. Time to make sure the market values that properly.",
  careerPaths: CAREER_PATHS,
  skillGaps: SKILL_GAPS,
  nextSteps: [
    "Document your track record — ISTJs often undersell consistent excellence",
    "Seek a manager who values process AND trusts you to improve it",
    "Choose your next role based on impact potential, not just stability",
  ],
};