import type { CareerPath } from "../careerPathLibrary";

const CAREER_PATHS: CareerPath[] = [
  {
    id: "chief_culture",
    title: "Chief Culture Officer / People Director",
    fitScore: 90,
    description: "Design and maintain the organizational culture that lets people do their best work.",
    whyItMatches: "Plateaued ENFPs often feel stuck when they've been suppressing their people-centric strengths. Culture leadership reignites that energy.",
    strengthsUsed: ["Emotional intelligence", "Values alignment", "Human connection"],
    growthTip: "Culture roles require business acumen too. Learn to quantify the ROI of people and culture initiatives.",
    networkingStrategy: "Host culture-themed events and write about human-centered leadership. Your energy fills rooms — use it.",
  },
  {
    id: "brand_evangelist",
    title: "Brand Evangelist / Chief Inspiration Officer",
    fitScore: 86,
    description: "Be the human face and voice of a brand you believe in — turning company values into stories that inspire action.",
    whyItMatches: "ENFPs plateau when they feel disconnected from purpose. This role puts your natural enthusiasm back at the center.",
    strengthsUsed: ["Storytelling", "Public inspiration", "Authentic connection"],
    growthTip: "Evangelism requires depth too. Build a real expertise layer beneath your enthusiasm.",
    networkingStrategy: "Speak at conferences and on podcasts. ENFPs are natural on stage — leverage it to build a visible personal brand.",
  },
  {
    id: "consulting_creative",
    title: "Creative Consultant / Innovation Facilitator",
    fitScore: 80,
    description: "Bring fresh perspectives and facilitate breakthroughs for teams stuck in repetitive patterns.",
    whyItMatches: "Your combination of empathy and creativity is exactly what organizations need when their own people can't see past the plateau.",
    strengthsUsed: ["Creative facilitation", "Perspective-shifting", "Group energy"],
    growthTip: "Facilitation is a skill, not just a personality. Invest in formal training in design thinking, LEGO SERIOUS PLAY, or similar methods.",
    networkingStrategy: "Partner with operational consultants who complement you. You bring the spark, they bring the structure.",
  },
];

const SKILL_GAPS = [
  { skill: "Self-advocacy", currentLevel: 30, requiredLevel: 70, gap: 40, developmentTip: "ENFPs often champion everyone else while undervaluing themselves. Get concrete about your contributions — write them down weekly." },
  { skill: "Career strategy", currentLevel: 35, requiredLevel: 65, gap: 30, developmentTip: "Your plateau likely comes from following opportunities as they appeared rather than choosing deliberately. Time to design, not just respond." },
  { skill: "Burnout prevention", currentLevel: 25, requiredLevel: 60, gap: 35, developmentTip: "ENFPs burn out from giving too much to the wrong things. Audit: which parts of your work recharge you vs. drain you?" },
  { skill: "Delegation", currentLevel: 35, requiredLevel: 60, gap: 25, developmentTip: "You fear others won't match your enthusiasm. Instead, trust them to bring their own style — it might work better than yours for execution tasks." },
];

export default {
  headline: "Your plateau is calling for purpose, not just progress",
  summary: "As a plateaued ENFP, you're likely not short on energy — you're short on alignment. The right role will make you feel like yourself again.",
  careerPaths: CAREER_PATHS,
  skillGaps: SKILL_GAPS,
  nextSteps: [
    "List the 3 activities that energize you most at work — then find roles where they're 70%+ of the job",
    "Stop optimizing your current role and start designing your next one from scratch",
    "Find an accountability partner who shares your values but complements your planning skills",
  ],
};