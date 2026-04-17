import type { CareerPath } from "../careerPathLibrary";

const CAREER_PATHS: CareerPath[] = [
  {
    id: "product_manager",
    title: "Product Manager / Innovation Lead",
    fitScore: 90,
    description: "Bridge user needs, business goals, and team dynamics to ship products that matter.",
    whyItMatches: "ENFPs in early career bring a unique combination of user empathy, creative problem-solving, and cross-functional energy that PM roles demand.",
    strengthsUsed: ["User empathy", "Creative ideation", "Cross-functional communication"],
    growthTip: "Sharpen your data literacy. Your intuition is strong — pairing it with evidence makes you unstoppable.",
    networkingStrategy: "Join product communities and ship side projects publicly. Your enthusiasm attracts collaborators organically.",
  },
  {
    id: "content_strategist",
    title: "Content Strategist / Head of Brand Voice",
    fitScore: 85,
    description: "Shape how organizations communicate — turning brand values into content strategy that resonates.",
    whyItMatches: "Your ability to understand audiences emotionally and translate that into compelling content is a rare professional skill.",
    strengthsUsed: ["Emotional intelligence", "Creative writing", "Audience understanding"],
    growthTip: "Learn the analytics side — content strategy only scales when you can connect creative decisions to business outcomes.",
    networkingStrategy: "Publish consistently on LinkedIn or Substack. Content strategists are hired based on their own content quality.",
  },
  {
    id: "hr_innovator",
    title: "People & Culture Lead / HR Innovator",
    fitScore: 78,
    description: "Reimagine how organizations attract, develop, and retain talent by putting people first.",
    whyItMatches: "ENFPs bring genuine warmth and creativity to roles that many treat as bureaucratic. You make people processes feel human.",
    strengthsUsed: ["Interpersonal warmth", "Values-driven thinking", "Creative problem-solving"],
    growthTip: "Learn organizational psychology frameworks. Your intuition needs structure to scale beyond individual relationships.",
    networkingStrategy: "Attend People & Culture conferences and contribute to HR innovation communities. Your perspective is differentiated.",
  },
];

const SKILL_GAPS = [
  { skill: "Stakeholder communication", currentLevel: 55, requiredLevel: 70, gap: 15, developmentTip: "You're naturally good here. Level up by learning to tailor your message to different decision-making styles." },
  { skill: "Project management", currentLevel: 30, requiredLevel: 65, gap: 35, developmentTip: "Use visual project tools (Trello, Notion boards) that match how your brain naturally organizes ideas." },
  { skill: "Delegation", currentLevel: 35, requiredLevel: 60, gap: 25, developmentTip: "ENFPs often do things themselves because it's faster. Invest time in teaching others so you can free up creative energy." },
];

export default {
  headline: "Your career energy is your greatest asset",
  summary: "As an ENFP in early career, you bring energy and connection that most teams desperately need. The challenge is channeling that enthusiasm into focused professional growth.",
  careerPaths: CAREER_PATHS,
  skillGaps: SKILL_GAPS,
  nextSteps: [
    "Choose roles where you can interact with diverse teams — isolation drains ENFPs",
    "Build a personal board of advisors: one strategic thinker, one operational executor, one creative",
    "Block weekly reflection time to prevent scattered energy from diluting your impact",
  ],
};