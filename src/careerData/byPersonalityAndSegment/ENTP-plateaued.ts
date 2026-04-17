import type { CareerPath } from "../careerPathLibrary";

const CAREER_PATHS: CareerPath[] = [
  {
    id: "chief_visionary",
    title: "Chief Innovation Officer / VP Strategy",
    fitScore: 92,
    description: "Set the horizon for an organization — identifying emerging opportunities and steering teams toward them before they become obvious.",
    whyItMatches: "Plateaued ENTPs have enough experience to know which patterns are real and enough intellectual courage to act on them. That combination is rare.",
    strengthsUsed: ["Pattern recognition", "Strategic vision", "Persuasive leadership"],
    growthTip: "Innovation officers fail when they can't implement. Partner with a strong COO type who locks your visions into execution.",
    networkingStrategy: "Publish your forward-looking analyses. ENTPs at this level build networks through bold, contrarian thinking that attracts the right kind of attention.",
  },
  {
    id: "portfolio_founder",
    title: "Portfolio Entrepreneur / Venture Builder",
    fitScore: 87,
    description: "Build or invest in multiple ventures simultaneously, leveraging your pattern recognition across domains.",
    whyItMatches: "ENTPs plateau when they're stuck in one thing. Portfolio strategies let you follow your strength — seeing possibilities across multiple domains simultaneously.",
    strengthsUsed: ["Rapid context-switching", "Cross-domain synthesis", "Opportunity recognition"],
    growthTip: "Don't start more than you can govern. The best portfolio founders have strong operators running each venture.",
    networkingStrategy: "Join founder communities and angel networks. Your pattern recognition across multiple ventures makes you a valuable co-investor and advisor.",
  },
  {
    id: "transformation_lead",
    title: "Transformation Lead / Change Agent",
    fitScore: 82,
    description: "Lead organizational change — turning stagnation into momentum by challenging assumptions and redesigning systems.",
    whyItMatches: "ENTPs see what's wrong before anyone else and have the verbal skills to convince others to change. Change leadership is your natural calling.",
    strengthsUsed: ["Systems-level diagnosis", "Persuasive communication", "Comfort with ambiguity"],
    growthTip: "Change agents get shot by incumbents. Learn the politics of change — who loses power, who gains it, and how to align incentives.",
    networkingStrategy: "Write case studies of transformations you've led. Measurable impact attracts the organizations that need your skills most.",
  },
];

const SKILL_GAPS = [
  { skill: "Follow-through", currentLevel: 25, requiredLevel: 70, gap: 45, developmentTip: "Your entire career, you've been the ideas person. At this stage, the people who outrank you are the ones who also execute. Build systems that force completion." },
  { skill: "Self-advocacy", currentLevel: 40, requiredLevel: 70, gap: 30, developmentTip: "ENTPs often assume their brilliance is obvious. It isn't. Document your impact in terms stakeholders understand: revenue, cost savings, efficiency gains." },
  { skill: "Career strategy", currentLevel: 45, requiredLevel: 70, gap: 25, developmentTip: "You've been opportunistic your whole career. That worked until it didn't. Time to write down a 3-year plan and commit — even when shinier opportunities appear." },
  { skill: "Burnout prevention", currentLevel: 30, requiredLevel: 60, gap: 30, developmentTip: "ENTPs burn out when every idea feels equally urgent. Ruthlessly prioritize — your top 3 ideas this quarter, nothing else gets attention." },
];

export default {
  headline: "Your vision needs a vehicle",
  summary: "As a plateaued ENTP, your plateau isn't about ideas — you have plenty. It's about making the right ideas sticky enough to outlast your attention. Here's how to turn your best thinking into lasting impact.",
  careerPaths: CAREER_PATHS,
  skillGaps: SKILL_GAPS,
  nextSteps: [
    "Choose your best idea from the last 12 months and give it 12 more months of focused execution.",
    "Hire or partner with someone who loves finishing what you start. This is not a weakness — it's a strategy.",
    "Write down what 'done' looks like before you start anything new.",
  ],
};