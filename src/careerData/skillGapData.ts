import type { SkillGap } from "./careerPathLibrary";
import type { CareerStage } from "./segmentConfig";

type StrengthId = string;

const UNIVERSAL_GAPS: Record<string, number> = {
  commander: 85,
  deliverer: 78,
  catalyst: 72,
  winner: 70,
  strategist: 68,
  self_believer: 65,
  peacekeeper: 60,
  coach: 55,
  empathizer: 50,
  storyteller: 48,
  optimist: 45,
  chameleon: 42,
  brainstormer: 40,
  people_reader: 38,
  believer: 35,
  time_keeper: 32,
  focus_expert: 28,
  problem_solver: 25,
  thinker: 22,
  analyst: 18,
  philomath: 15,
};

const REQUIRED_LEVELS: Record<CareerStage, Record<string, number>> = {
  university: {
    "Public speaking and presenting": 60,
    "Networking": 55,
    "Time management": 70,
    "Written communication": 65,
    "Adaptability": 60,
  },
  early_career: {
    "Stakeholder communication": 65,
    "Project management": 60,
    "Negotiation": 55,
    "Delegation": 60,
    "Strategic thinking": 70,
  },
  mid_career: {
    "Executive presence": 70,
    "Change management": 65,
    "Cross-functional leadership": 70,
    "Strategic influence": 75,
    "Mentoring others": 65,
  },
  career_changer: {
    "Transferable skill communication": 70,
    "Personal branding": 65,
    "Adaptability": 75,
    "Networking in new field": 60,
    "Interviewing outside your domain": 65,
  },
  plateaued: {
    "Self-advocacy": 70,
    "Career strategy": 65,
    "Re-skilling mindset": 60,
    "Lateral thinking": 65,
    "Burnout prevention": 60,
  },
  return_to_work: {
    "Confidence rebuilding": 70,
    "Resume positioning": 65,
    "Networking revival": 60,
    "Interview readiness": 65,
    "Upskilling strategically": 55,
  },
};

export function getSkillGaps(
  topStrengths: StrengthId[],
  bottomStrengths: StrengthId[],
  segment: CareerStage,
): SkillGap[] {
  const required = REQUIRED_LEVELS[segment] || REQUIRED_LEVELS.early_career;

  const currentLevels: Record<string, number> = {};
  for (const id of topStrengths) {
    const mapped = SKILL_MAPPING[id];
    if (mapped) {
      for (const [skill, level] of Object.entries(mapped)) {
        currentLevels[skill] = Math.max(currentLevels[skill] || 0, level);
      }
    }
  }
  for (const id of bottomStrengths) {
    const mapped = SKILL_MAPPING[id];
    if (mapped) {
      for (const [skill, level] of Object.entries(mapped)) {
        currentLevels[skill] = Math.min(
          currentLevels[skill] ?? level,
          level,
        );
      }
    }
  }

  const gaps: SkillGap[] = [];
  for (const [skill, requiredLevel] of Object.entries(required)) {
    const current = currentLevels[skill] ?? Math.round((UNIVERSAL_GAPS[bottomStrengths[0]] || 35) / 100 * requiredLevel);
    const gap = Math.max(0, requiredLevel - current);
    if (gap > 10) {
      gaps.push({
        skill,
        currentLevel: current,
        requiredLevel,
        gap,
        developmentTip: DEV_TIPS[skill] || "Seek projects and mentorship that exercise this skill.",
      });
    }
  }

  gaps.sort((a, b) => b.gap - a.gap);
  return gaps.slice(0, 5);
}

const SKILL_MAPPING: Record<string, Record<string, number>> = {
  commander: { "Stakeholder communication": 80, "Executive presence": 85, "Strategic influence": 80 },
  deliverer: { "Project management": 80, "Time management": 85 },
  catalyst: { "Cross-functional leadership": 75, "Change management": 70 },
  winner: { "Negotiation": 75, "Self-advocacy": 80 },
  strategist: { "Strategic thinking": 90, "Career strategy": 80 },
  self_believer: { "Self-advocacy": 80, "Confidence rebuilding": 75 },
  peacekeeper: { "Networking": 70, "Mentoring others": 70 },
  coach: { "Mentoring others": 85, "Cross-functional leadership": 70 },
  empathizer: { "Networking in new field": 65, "Written communication": 70 },
  storyteller: { "Public speaking and presenting": 80, "Personal branding": 75 },
  optimist: { "Adaptability": 80, "Confidence rebuilding": 70 },
  chameleon: { "Adaptability": 90, "Lateral thinking": 70 },
  brainstormer: { "Lateral thinking": 85, "Transferable skill communication": 65 },
  thinker: { "Written communication": 80, "Upskilling strategically": 60 },
  analyst: { "Upskilling strategically": 75, "Interview readiness": 60 },
  focus_expert: { "Time management": 80, "Focus and deep work": 85 },
  time_keeper: { "Project management": 75, "Time management": 85 },
  problem_solver: { "Strategic thinking": 70, "Burnout prevention": 55 },
  philomath: { "Upskilling strategically": 85, "Re-skilling mindset": 75 },
  believer: { "Networking": 60, "Resume positioning": 55 },
  people_reader: { "Interviewing outside your domain": 70, "Networking in new field": 65 },
};

const DEV_TIPS: Record<string, string> = {
  "Public speaking and presenting": "Start with small groups — a team update or local meetup talk. Build confidence before scaling up.",
  "Networking": "Focus on quality over quantity. One genuine conversation per week compounds faster than 50 business cards.",
  "Time management": "Time-block your day around your top strengths. Protect the hours where you do your best work.",
  "Written communication": "Write short summaries of complex ideas daily. Clarity in writing reflects clarity in thinking.",
  "Adaptability": "Deliberately seek one uncomfortable situation per week. Comfort zones shrink if you stay in them.",
  "Stakeholder communication": "Learn to translate your ideas into the listener's language. What matters to them, not just what matters to you.",
  "Project management": "Use a simple framework: scope → milestones → accountability. Complexity kills more projects than scope.",
  "Negotiation": "Prepare your BATNA before every negotiation. Your strength-based confidence is your anchor.",
  "Delegation": "Start by delegating outcomes, not tasks. Define what success looks like, then let go of the how.",
  "Strategic thinking": "Schedule weekly reflection time. Strategy degrades without dedicated processing time.",
  "Executive presence": "Slow down when you speak. Pause before key points. Presence comes from comfortable silence, not more words.",
  "Change management": "Frame changes around what stays the same, not just what's different. People resist change when identity feels threatened.",
  "Cross-functional leadership": "Learn each team's vocabulary and incentives. Influence across boundaries requires speaking multiple 'languages.'",
  "Strategic influence": "Map who influences decisions. Formal authority is only one lever — relationships and expertise matter more.",
  "Mentoring others": "Your strengths become sharper when you teach them. Mentoring is the fastest path to mastery.",
  "Transferable skill communication": "Build a one-page strengths map that translates your experience into any industry's language.",
  "Personal branding": "Your personality type IS your brand differentiator. Lead with it, not your resume.",
  "Interviewing outside your domain": "Use your strengths to bridge the gap — demonstrate how your approach maps to their problems.",
  "Self-advocacy": "Advocacy isn't bragging. It's making your value visible so others can benefit from what you naturally do well.",
  "Career strategy": "Think in 3-year arcs. What capability are you building this cycle that compounds?",
  "Re-skilling mindset": "Your learning style is rooted in your personality. Leverage it — don't fight it.",
  "Lateral thinking": "Read outside your field. The best lateral moves come from connecting unrelated domains.",
  "Burnout prevention": "Audit your calendar: what drains you versus what energizes you? Protect 20% of your week for the latter.",
  "Confidence rebuilding": "Confidence is the memory of your strengths in action. Start with small wins that remind you what you're good at.",
  "Resume positioning": "Lead with outcomes, not responsibilities. 'What changed because I was there?' beats 'What was I responsible for?'",
  "Networking revival": "Reconnect with 3 people from your past each week. Warm reconnections beat cold outreach every time.",
  "Interview readiness": "Prepare 5 stories that map to your strengths. Stories stick; job descriptions don't.",
  "Upskilling strategically": "Don't learn everything. Learn the 2-3 skills that unlock the biggest career leverage for your personality type.",
};