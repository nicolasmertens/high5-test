import type { CareerPath } from "../careerPathLibrary";

const CAREER_PATHS: CareerPath[] = [
  {
    id: "coo",
    title: "COO / Head of Business Operations",
    fitScore: 93,
    description: "Run the operational engine of an organization — making sure strategy translates into execution at scale.",
    whyItMatches: "Plateaued ISTJs have the institutional knowledge and process mastery that make them exceptional COOs. You know how things actually get done.",
    strengthsUsed: ["Operational excellence", "Process scaling", "Accountability systems"],
    growthTip: "COOs need to peer with CEOs as strategic partners, not just operational executors. Develop your strategic voice.",
    networkingStrategy: "ISTJs at this level build networks through board advisory roles and industry operational excellence communities.",
  },
  {
    id: "compliance_director",
    title: "Compliance Director / Chief Risk Officer",
    fitScore: 87,
    description: "Design and oversee the frameworks that keep organizations safe, compliant, and trustworthy.",
    whyItMatches: "Your meticulous nature and deep understanding of systems make you the person organizations trust to keep them out of trouble.",
    strengthsUsed: ["Regulatory knowledge", "Risk assessment", "Systematic enforcement"],
    growthTip: "Move from compliance policing to compliance strategy — help organizations design products and processes that are compliant by default.",
    networkingStrategy: "Join regulatory bodies and standards committees. Your voice in shaping rules is more valuable than enforcing them after the fact.",
  },
  {
    id: "supply_chain_vp",
    title: "VP Supply Chain / Logistics Strategy Lead",
    fitScore: 82,
    description: "Design and optimize the end-to-end supply chain that keeps products moving and organizations profitable.",
    whyItMatches: "ISTJs understand systems and dependencies at a level most people can't. Supply chain complexity is where that becomes a superpower.",
    strengthsUsed: ["Systems thinking", "Dependency mapping", "Process optimization"],
    growthTip: "Modern supply chain leadership requires data-driven decision making. Invest in analytics tools and data science literacy.",
    networkingStrategy: "Supply chain is a tight industry. Join CSCMP or similar organizations and contribute to industry benchmarking studies.",
  },
];

const SKILL_GAPS = [
  { skill: "Self-advocacy", currentLevel: 30, requiredLevel: 70, gap: 40, developmentTip: "ISTJs rarely self-promote, which means you're probably doing more than anyone realizes. Start sharing your impact in concrete, measurable terms." },
  { skill: "Strategic thinking", currentLevel: 50, requiredLevel: 75, gap: 25, developmentTip: "You've been executing other people's strategies. Time to write your own. Start by drafting 6-month plans for your team without being asked." },
  { skill: "Networking", currentLevel: 25, requiredLevel: 55, gap: 30, developmentTip: "Your plateau likely includes isolation from decision-makers. Build strategic relationships with 3-5 people who make hiring and promoting decisions." },
  { skill: "Burnout prevention", currentLevel: 35, requiredLevel: 60, gap: 25, developmentTip: "ISTJs burn out from carrying too much operational weight. Delegate more aggressively — your standards will be maintained if you set the systems properly." },
];

export default {
  headline: "Your systems mastery belongs at the top",
  summary: "As a plateaued ISTJ, your problem isn't competence — it's visibility. You've likely been the reliable engine other people take for granted. Time to change that equation.",
  careerPaths: CAREER_PATHS,
  skillGaps: SKILL_GAPS,
  nextSteps: [
    "Stop doing and start documenting. Your processes should run without you — if they can't, build that capability.",
    "Seek a role where you report to the CEO, not a middle layer. Your value compounds at the executive level.",
    "Advocate for your impact using numbers. 'I kept the system running' doesn't resonate like 'I reduced operating costs by 23%.'",
  ],
};