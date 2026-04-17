import type { CareerPath } from "../careerPathLibrary";

const CAREER_PATHS: CareerPath[] = [
  {
    id: "ux_researcher",
    title: "UX Researcher / Design Strategist",
    fitScore: 91,
    description: "Uncover human needs and translate them into designs that resonate. Your empathy and creativity are your research superpower.",
    whyItMatches: "ENFPs thrive in roles that combine curiosity about people with creative problem-solving. UX research rewards both.",
    strengthsUsed: ["Empathic understanding", "Creative ideation", "Human-centered thinking"],
    growthTip: "Build your analytical muscle — the best researchers combine empathy with rigorous methodology.",
    networkingStrategy: "Share research case studies on LinkedIn and at local design meetups. Your enthusiasm is magnetic in person.",
  },
  {
    id: "brand_strategist",
    title: "Brand Strategist / Creative Director",
    fitScore: 86,
    description: "Shape how brands connect with people emotionally. Your intuitive understanding of what resonates is rare and valuable.",
    whyItMatches: "ENFPs naturally understand emotional undertones and can synthesize brand stories that feel authentic to audiences.",
    strengthsUsed: ["Creative intuition", "Emotional intelligence", "Storytelling"],
    growthTip: "Brand strategy isn't just creative — learn the business metrics that connect brand decisions to revenue.",
    networkingStrategy: "Build a portfolio of brand positioning work. Create side projects that showcase your thinking, not just your aesthetics.",
  },
  {
    id: "community_builder",
    title: "Community Manager / People Operations Lead",
    fitScore: 79,
    description: "Build and nurture communities, cultures, and teams. Your warmth and enthusiasm make people feel genuinely welcome.",
    whyItMatches: "ENFPs are natural connectors. You make others feel heard and valued, which is the foundation of any thriving community.",
    strengthsUsed: ["Interpersonal warmth", "Enthusiasm", "Inclusive thinking"],
    growthTip: "Community roles require structure too. Build systems that scale your warmth — personal touch alone doesn't scale.",
    networkingStrategy: "You ARE the network. Host events, create spaces, and introduce people. Your network grows when you give first.",
  },
];

const SKILL_GAPS = [
  { skill: "Project management", currentLevel: 30, requiredLevel: 65, gap: 35, developmentTip: "ENFPs resist structure, but your best ideas die without it. Use lightweight frameworks (Kanban, timers) — not rigid systems that kill your energy." },
  { skill: "Time management", currentLevel: 25, requiredLevel: 60, gap: 35, developmentTip: "Block your creative hours and protect them. Schedule follow-through time for ideas you've already committed to." },
  { skill: "Written communication", currentLevel: 45, requiredLevel: 65, gap: 20, developmentTip: "Your verbal energy is magnetic. Translate that same enthusiasm into clear, concise writing that reaches people who aren't in the room." },
];

export default {
  headline: "Your enthusiasm is your entry point",
  summary: "As an ENFP university student, you connect with people and ideas faster than most. Use that energy to explore broadly before you commit deeply.",
  careerPaths: CAREER_PATHS,
  skillGaps: SKILL_GAPS,
  interviewTip: "Your warmth is an interview superpower. Channel your enthusiasm into structured stories: challenge → action → result. Don't let excitement replace clarity.",
  coverLetterTip: "Open with a story that shows how you connect ideas. Don't just list what you've done — show how your energy transformed a situation.",
  nextSteps: [
    "Pursue internships where you can observe and interact with people — research, design, community, or social impact roles",
    "Build a portfolio of projects that show your creative process, not just finished products",
    "Find mentors who share your values but complement your blind spots in execution and follow-through",
  ],
};