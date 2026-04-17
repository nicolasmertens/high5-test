import type { CareerPath } from "../careerPathLibrary";

const CAREER_PATHS: CareerPath[] = [
  {
    id: "quant_analyst",
    title: "Quantitative Analyst / Data Scientist",
    fitScore: 92,
    description: "Apply deep analytical thinking to model complex systems and extract insights from data at scale.",
    whyItMatches: "Your INTJ love of systems and independent thinking maps directly to roles that reward depth over breadth.",
    strengthsUsed: ["Strategic thinking", "Pattern recognition", "Independent analysis"],
    growthTip: "Develop communication skills to translate your insights for non-technical decision-makers.",
    networkingStrategy: "Publish on arXiv or Medium. Your work speaks for itself — let it create inbound connections.",
  },
  {
    id: "product_architect",
    title: "Product Architect / Technical Strategist",
    fitScore: 87,
    description: "Design the technical vision and long-term architecture for products that shape industries.",
    whyItMatches: "INTJs excel at seeing the full system and making decisions others can't yet see are necessary.",
    strengthsUsed: ["Systems thinking", "Long-range planning", "Decisive analysis"],
    growthTip: "Practice social influence — the best architecture is the one others actually adopt.",
    networkingStrategy: "Contribute to open-source projects and speak at technical conferences about architecture decisions.",
  },
  {
    id: "management_consultant",
    title: "Management Consultant / Strategy Advisor",
    fitScore: 82,
    description: "Help organizations solve their hardest strategic problems by applying structured analysis and creative frameworks.",
    whyItMatches: "Your natural inclination to understand systems and optimize makes you valuable in environments others find chaotic.",
    strengthsUsed: ["Analytical rigor", "Strategic vision", "Independent judgment"],
    growthTip: "Consulting rewards stamina and client management as much as analysis — build your stamina for ambiguity.",
    networkingStrategy: "Write case studies and thought pieces. INTJs build networks through demonstrated expertise, not social events.",
  },
];

const SKILL_GAPS = [
  { skill: "Stakeholder communication", currentLevel: 30, requiredLevel: 65, gap: 35, developmentTip: "INTJs often think the work should speak for itself. Learn to narrate your reasoning — stakeholders buy understanding, not just answers." },
  { skill: "Networking", currentLevel: 25, requiredLevel: 55, gap: 30, developmentTip: "Focus on one strategic relationship per month. Quality over quantity aligns with your natural style." },
  { skill: "Public speaking", currentLevel: 35, requiredLevel: 60, gap: 25, developmentTip: "Prepare thoroughly and present on topics you've mastered. Your depth is an advantage on stage." },
];

export default {
  headline: "Your analytical edge is your career superpower",
  summary: "As an INTJ university student, you think in systems while others think in steps. Use that advantage to skip the line in research-heavy and strategy-focused fields.",
  careerPaths: CAREER_PATHS,
  skillGaps: SKILL_GAPS,
  interviewTip: "Frame your answers around your ability to see the big picture. INTJs stand out in interviews when they show they've already thought three steps ahead of the problem.",
  coverLetterTip: "Lead with results and frameworks. Don't describe what you did — describe the system you improved and the measurable outcome.",
  nextSteps: [
    "Seek research assistant positions with professors doing systems-level work",
    "Build a portfolio of side projects that demonstrate your ability to architect solutions",
    "Practice explaining complex ideas simply — it's the skill that will unlock management trust",
  ],
};