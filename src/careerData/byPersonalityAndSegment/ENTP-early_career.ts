import type { CareerPath } from "../careerPathLibrary";

const CAREER_PATHS: CareerPath[] = [
  {
    id: "product_leader",
    title: "Product Leader / VP Product",
    fitScore: 91,
    description: "Define product vision and strategy at scale — balancing user needs, business goals, and engineering reality.",
    whyItMatches: "ENTPs in early career have learned enough about how things work to want to change them. Product leadership lets you do that with authority.",
    strengthsUsed: ["Strategic vision", "Rapid iteration", "Cross-functional influence"],
    growthTip: "Product leadership at scale is about saying no. Your biggest growth is learning which of your great ideas to kill.",
    networkingStrategy: "Speak at product conferences and write about trade-offs you've made. ENTPs are compelling when they share reasoning, not just results.",
  },
  {
    id: "founder_cto",
    title: "Technical Founder / CTO",
    fitScore: 86,
    description: "Build and lead the technical side of a new venture, from architecture to hiring to fund-raising.",
    whyItMatches: "ENTPs excel at rapidly learning new domains and building solutions that haven't existed before. Startups reward exactly this.",
    strengthsUsed: ["Rapid learning", "Vision articulation", "Technical adaptability"],
    growthTip: "Technical founders fail when they over-architect. Ship v1 fast, learn from users, iterate. Your bias is toward complexity — fight it.",
    networkingStrategy: "Y Combinator and similar programs are designed for ENTP energy. Apply. Even if you don't get in, the application process sharpens your thinking.",
  },
  {
    id: "design_thinker",
    title: "Design Thinking Facilitator / Innovation Consultant",
    fitScore: 79,
    description: "Lead organizations through innovation sprints, helping teams discover solutions they couldn't see on their own.",
    whyItMatches: "ENTPs are natural facilitators who can see possibilities and challenge assumptions — exactly what design thinking sessions need.",
    strengthsUsed: ["Facilitation energy", "Pattern recognition", "Reframing problems"],
    growthTip: "Facilitation is a craft, not just personality. Invest in formal methods (Design Sprint, Jobs To Be Done) to give your talent structure.",
    networkingStrategy: "Offer to run innovation workshops at companies you admire. One great session creates more opportunities than 100 LinkedIn posts.",
  },
];

const SKILL_GAPS = [
  { skill: "Follow-through", currentLevel: 30, requiredLevel: 70, gap: 40, developmentTip: "ENTPs' biggest career risk is being known as a starter, not a finisher. Use commitment devices: public goals, accountability partners, project intervals." },
  { skill: "Delegation", currentLevel: 35, requiredLevel: 65, gap: 30, developmentTip: "You think you can do everything faster. You might be right — but you can't do everything simultaneously. Delegate for parallel progress." },
  { skill: "Stakeholder communication", currentLevel: 55, requiredLevel: 70, gap: 15, developmentTip: "You're persuasive but sometimes too clever. Simplify your arguments — the best stakeholder communication makes complex ideas feel obvious." },
];

export default {
  headline: "Stop starting. Start finishing.",
  summary: "As an ENTP in early career, you've proven you're smart. The market doesn't reward smart — it rewards smart AND reliable. Here's how to build that track record.",
  careerPaths: CAREER_PATHS,
  skillGaps: SKILL_GAPS,
  nextSteps: [
    "Close your top 3 unfinished projects this quarter. No new starts until all 3 ship.",
    "Find one role model who's an ENTP that ships. Study what they do differently from you.",
    "Ask for feedback from 3 people: 'What's one thing I could improve about how I follow through?'",
  ],
};