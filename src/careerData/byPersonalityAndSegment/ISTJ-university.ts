import type { CareerPath } from "../careerPathLibrary";

const CAREER_PATHS: CareerPath[] = [
  {
    id: "audit_compliance",
    title: "Audit & Compliance Specialist",
    fitScore: 91,
    description: "Ensure organizations meet standards and regulations through meticulous analysis and systematic verification.",
    whyItMatches: "ISTJs thrive in environments with clear rules, systematic processes, and accountability — audit is your natural habitat.",
    strengthsUsed: ["Detail precision", "Systematic execution", "Reliability"],
    growthTip: "Combine your audit skills with data analytics to move from checking compliance to preventing problems proactively.",
    networkingStrategy: "Join professional audit associations. ISTJs build networks through consistent, high-quality work over time.",
  },
  {
    id: "operations_management",
    title: "Operations Manager / Supply Chain Lead",
    fitScore: 86,
    description: "Keep complex systems running efficiently — from supply chains to organizational workflows.",
    whyItMatches: "Your ability to create order from chaos and maintain consistency under pressure makes you invaluable in operations.",
    strengthsUsed: ["Process optimization", "Consistency", "Dependability"],
    growthTip: "Operations leadership requires strategic thinking too. Learn to connect daily processes to business strategy.",
    networkingStrategy: "Operations professionals trade on reputation. Deliver consistently and word will spread through industry networks.",
  },
  {
    id: "qa_engineering",
    title: "Quality Assurance Engineer / QA Lead",
    fitScore: 79,
    description: "Ensure products meet the highest standards through systematic testing and quality frameworks.",
    whyItMatches: "ISTJs have an innate sense for what's out of place. QA rewards exactly the kind of meticulous attention you naturally bring.",
    strengthsUsed: ["Attention to detail", "Systematic thinking", "Standard enforcement"],
    growthTip: "Move from finding bugs to preventing them — QA strategy is about designing quality into the process, not just catching errors.",
    networkingStrategy: "Contribute to testing frameworks and speak at QA conferences. Your methodology becomes your professional identity.",
  },
];

const SKILL_GAPS = [
  { skill: "Public speaking", currentLevel: 30, requiredLevel: 60, gap: 30, developmentTip: "ISTJs are often underrecognized because others present weaker ideas more confidently. Start small: team updates, then internal brown bags." },
  { skill: "Networking", currentLevel: 25, requiredLevel: 55, gap: 30, developmentTip: "Focus on professional associations and structured networking events. You excel in purpose-driven conversations, not small talk." },
  { skill: "Adaptability", currentLevel: 40, requiredLevel: 60, gap: 20, developmentTip: "Practice having a Plan B for situations you normally plan rigidly. Small flexibility exercises build larger adaptability." },
];

export default {
  headline: "Your reliability is your competitive advantage",
  summary: "As an ISTJ university student, you bring dependability and precision that most teams desperately need. Position yourself where these traits create outsized value.",
  careerPaths: CAREER_PATHS,
  skillGaps: SKILL_GAPS,
  interviewTip: "ISTJs shine in structured interviews. Prepare concrete examples for each question — your precision with details gives interviewers confidence.",
  coverLetterTip: "Lead with measurable results and consistent delivery. Phrase your reliability as a business advantage: 'reduced errors by X%' over 'I'm very detail-oriented.'",
  nextSteps: [
    "Target internships in audit, operations, or quality assurance where your precision is the product",
    "Build a track record of reliability — seek projects you can own end-to-end and deliver on time",
    "Pair your natural precision with one leadership communication skill this year",
  ],
};