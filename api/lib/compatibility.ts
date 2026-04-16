import type { StoredProfile } from "./profile-storage.js";

const DISC_MATRIX: Record<string, Record<string, number>> = {
  D: { D: 70, I: 55, S: 40, C: 60 },
  I: { D: 55, I: 75, S: 65, C: 45 },
  S: { D: 40, I: 65, S: 80, C: 70 },
  C: { D: 60, I: 45, S: 70, C: 65 },
};

const DISC_WEIGHT = 0.40;
const STRENGTHS_WEIGHT = 0.30;
const PERSONALITY_WEIGHT = 0.30;

export function computeCompatibilityScore(profileA: StoredProfile, profileB: StoredProfile): number {
  const discScore = computeDISCScore(profileA.discPrimary, profileB.discPrimary);
  const strengthsScore = computeStrengthsScore(profileA, profileB);
  const personalityScore = computePersonalityScore(profileA.personalityType, profileB.personalityType);

  return Math.round(
    (DISC_WEIGHT * discScore + STRENGTHS_WEIGHT * strengthsScore + PERSONALITY_WEIGHT * personalityScore)
    / (DISC_WEIGHT + STRENGTHS_WEIGHT + PERSONALITY_WEIGHT)
  );
}

export function computeDISCScore(typeA: string, typeB: string): number {
  return DISC_MATRIX[typeA]?.[typeB] ?? 50;
}

export function computeStrengthsScore(
  profileA: StoredProfile,
  profileB: StoredProfile,
): number {
  const topA = profileA.topStrengths.slice(0, 5);
  const topB = profileB.topStrengths.slice(0, 5);
  const bottomA = Object.entries(profileA.strengthScores)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 5)
    .map(([k]) => k);
  const bottomB = Object.entries(profileB.strengthScores)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 5)
    .map(([k]) => k);

  const setA = new Set(topA);
  const setB = new Set(topB);
  const intersection = topA.filter((s) => setB.has(s)).length;
  const union = new Set([...topA, ...topB]).size || 1;
  const similarity = intersection / union;

  const complementAB = bottomA.filter((s) => setB.has(s)).length / 5;
  const complementBA = bottomB.filter((s) => setA.has(s)).length / 5;
  const complement = (complementAB + complementBA) / 2;

  const setBottomA = new Set(bottomA);
  const setBottomB = new Set(bottomB);
  const frictionAB = topA.filter((s) => setBottomB.has(s)).length / 5;
  const frictionBA = topB.filter((s) => setBottomA.has(s)).length / 5;
  const friction = (frictionAB + frictionBA) / 2;

  const raw = similarity * 0.33 + complement * 0.33 + (1 - friction) * 0.34;
  return Math.round(raw * 100);
}

export interface PersonalityPairData {
  label: string;
  dynamic: string;
  tip: string;
  score: number;
}

export function computePersonalityScore(typeA: string, typeB: string): number {
  const pair = getPersonalityPair(typeA, typeB);
  return pair.score;
}

export function getPersonalityPair(typeA: string, typeB: string): PersonalityPairData {
  const key = `${typeA}-${typeB}`;
  const reverseKey = `${typeB}-${typeA}`;
  return PERSONALITY_PAIRS[key] ?? PERSONALITY_PAIRS[reverseKey] ?? DEFAULT_PAIR;
}

export interface EnneagramPairData {
  label: string;
  dynamic: string;
  atBest: string;
  underStress: string;
}

export function getEnneagramPair(typeA: number, typeB: number): EnneagramPairData {
  const key = `${typeA}-${typeB}`;
  const reverseKey = `${typeB}-${typeA}`;
  return ENNEAGRAM_PAIRS[key] ?? ENNEAGRAM_PAIRS[reverseKey] ?? DEFAULT_ENNEAGRAM_PAIR;
}

const DISC_ADVICE: Record<string, Record<string, { howA: string; howB: string; meeting: string; tips: string[] }>> = {
  D: {
    D: {
      howA: "As a D style, you prefer direct, results-driven communication. When talking with another D, be clear about your priorities and avoid power struggles by acknowledging their goals.",
      howB: "As a D style, you're both natural drivers. Focus on aligning your goals rather than competing — you're stronger when you agree on the destination.",
      meeting: "Short, agenda-driven standups with clear action items.",
      tips: ["Agree on who owns what decision upfront", "Keep meetings short and outcome-focused", "Acknowledge each other's expertise before pushing your view"],
    },
    I: {
      howA: "As a D style, you prefer bottom-line results. With an I, allow time for their enthusiasm — their energy is genuine, not wasted. Lead with your conclusion, then let them riff.",
      howB: "As an I style, you bring enthusiasm to the D's drive. Lead with your ideas, but make sure you close with a clear ask — D's decide fast.",
      meeting: "Brief check-ins with clear decisions at the end. Leave room for I's ideas at the start.",
      tips: ["Start with outcomes, then let I share context", "Acknowledge I's contribution before redirecting", "Set a time limit for brainstorming — D's get impatient"],
    },
    S: {
      howA: "As a D style, you move fast and decide faster. An S needs time to process. Slow down, give context for your decisions, and ask for their input before deciding.",
      howB: "As an S style, you value patience and stability. The D's speed isn't a threat — it's their style. Speak up early; D's respect directness over silence.",
      meeting: "Structured 1:1s with a shared agenda. Send topics in advance so S can prepare.",
      tips: ["Give S 24 hours' notice before big decisions", "Ask 'What do you think?' and actually wait for the answer", "Explain the 'why' behind your urgency"],
    },
    C: {
      howA: "As a D style, you want action now. C wants to analyze first. Their thoroughness catches things you'd miss — use it as a strength, not a bottleneck.",
      howB: "As a C style, you bring rigor to the D's speed. Present your analysis in summary form first — then offer details. D's respect data but not data overload.",
      meeting: "Pre-read documents sent 24 hours in advance. Meeting is for decisions, not information sharing.",
      tips: ["Send key data points before the meeting", "Summarize your analysis in 3 bullet points first", "Acknowledge D's urgency while explaining why your process matters"],
    },
  },
  I: {
    D: {
      howA: "As an I style, you bring energy and ideas. When working with a D, make sure your enthusiasm has a point — D's love your energy but lose patience without direction.",
      howB: "As a D style, you drive results. Let I share their ideas first — some will be gold. Then redirect to action.",
      meeting: "Start with 5 minutes of brainstorming, then pivot to decisions.",
      tips: ["Channel your social energy into specific goals", "Prepare one clear ask for each meeting", "Follow up your enthusiasm with written action items"],
    },
    I: {
      howA: "As an I style, you thrive on social energy and brainstorming. With another I, you'll have incredible ideas — the challenge is follow-through.",
      howB: "Two I's generate more energy than any other pair. Assign someone to capture decisions and follow through.",
      meeting: "Collaborative sessions with a designated note-taker. Time-box brainstorming.",
      tips: ["End every meeting with who does what by when", "Schedule regular check-ins to maintain momentum", "One of you needs to own the follow-up — decide who"],
    },
    S: {
      howA: "As an I style, you're fast-paced and social. An S is thoughtful and steady. Their calm is a great balance for your energy — appreciate it.",
      howB: "As an S style, you provide the stability that I's thrive around. Speak up about what you need — I's will champion it once they know.",
      meeting: "Casual check-ins with time for relationship building. Don't rush the S's process.",
      tips: ["Give S advance notice of changes", "Ask them one-on-one — they may not speak up in groups", "Your enthusiasm can overwhelm S's — tone it down to their level sometimes"],
    },
    C: {
      howA: "As an I style, you love talking through ideas. C prefers to think quietly first. Send them ideas in writing and let them respond on their own time.",
      howB: "As a C style, you value precision. I's enthusiasm is data too — they synthesize patterns before they can articulate the logic. Ask clarifying questions.",
      meeting: "Async-first. Share ideas in writing, then meet to discuss. End with documented decisions.",
      tips: ["Put your ideas in writing before the meeting", "Don't take C's silence as disinterest — they're processing", "Appreciate C's attention to detail — it catches what you miss"],
    },
  },
  S: {
    D: {
      howA: "As an S style, you're patient and steady. D's urgency isn't personal — it's their style. Speak up early; D's respect clear input.",
      howB: "As a D style, slow down for S. Give them time to process, explain your reasoning, and ask for their input before deciding.",
      meeting: "Predictable recurring 1:1s. Send agenda items 24 hours ahead.",
      tips: ["Don't wait to be asked — volunteer your perspective", "If you need more time, say so clearly: 'I'd like to think about that and get back to you'", "Your stability is a superpower D doesn't have — own it"],
    },
    I: {
      howA: "As an S style, you prefer steady, step-by-step communication. I's energy is genuine — lean into it. They'll champion your ideas if you share them.",
      howB: "As an I style, you bring energy to S's calm. Help them share their perspective in group settings — they have great insights that don't always surface.",
      meeting: "Friendly check-ins with some social time built in. S appreciates the personal connection.",
      tips: ["Share your ideas even if they're half-formed — I's love building on them", "Your steady follow-through is the secret weapon of every I partnership", "Set boundaries when I's pace overwhelms you"],
    },
    S: {
      howA: "As an S style, you value consistency and trust. With another S, you'll build deep mutual understanding — the risk is moving too slowly.",
      howB: "Two S's create the most stable team possible. Push each other to make faster decisions when needed.",
      meeting: "Regular, predictable check-ins. Both prefer low-pressure, honest conversations.",
      tips: ["Set explicit deadlines — mutual patience can become mutual delay", "One of you should own the 'push forward' role", "Don't avoid conflict entirely — healthy disagreement prevents stagnation"],
    },
    C: {
      howA: "As an S style, you value process and patience. C shares your appreciation for thoroughness. They're more analytical than you — use their precision as a complement.",
      howB: "As a C style, you bring rigor and your S partner brings patience. Together, you create the most reliable outcomes of any pairing.",
      meeting: "Well-prepared reviews with clear documentation. Both appreciate structure.",
      tips: ["C's questions aren't doubt — they're diligence", "Ask C to explain their reasoning — you'll learn something", "Between you, nothing falls through the cracks"],
    },
  },
  C: {
    D: {
      howA: "As a C style, you value accuracy and thorough analysis. D's speed can feel reckless, but they decide fast because they trust their gut. Present your analysis in summary form.",
      howB: "As a D style, you want action. C's analysis catches what you'd miss — use it, don't skip it. But insist on summaries, not data dumps.",
      meeting: "Pre-read documents sent in advance. Meeting is for decisions, not information dump.",
      tips: ["Share your top 3 findings, not all 30", "D's respect data — use numbers, not narratives", "Offer a recommendation alongside your analysis"],
    },
    I: {
      howA: "As a C style, you prefer written, structured communication. I's natural spontaneity is creative, not careless. Give them room to brainstorm, then document the best ideas.",
      howB: "As an I style, you light up rooms. C lights up spreadsheets. Between your energy and their precision, you cover every angle.",
      meeting: "Start with I's ideas (5-10 min brainstorm), then C structures the follow-through.",
      tips: ["Don't take I's off-the-cuff ideas as final plans", "Put your analysis in writing — I processes written info better than verbal data", "Your thoroughness is exactly what I needs to turn ideas into outcomes"],
    },
    S: {
      howA: "As a C style, you share S's appreciation for thoroughness. Your rigor plus their reliability means nothing falls through the cracks.",
      howB: "As an S style, your patience with C's perfectionism is unmatched. Together you create the most reliable work of any pairing.",
      meeting: "Structured reviews with clear documentation. Both value preparation and follow-through.",
      tips: ["Between your two styles, execution is flawless but momentum can stall — set deadlines", "S helps C stop perfecting and start shipping", "C helps S make decisions with confidence"],
    },
    C: {
      howA: "As a C style, you value precision and logical analysis. With another C, your standards are high — the risk is analysis paralysis.",
      howB: "Two C's produce flawlessly researched work. Set time limits on analysis phases to prevent endless refinement.",
      meeting: "Structured reviews with clear documentation and pre-shared analysis. Both thrive on preparation.",
      tips: ["Set a 'good enough' threshold — not everything needs 100%", "Assign one person as the 'ship it' decider", "Your combined thoroughness is a strength, but add deadlines to avoid perfectionism traps"],
    },
  },
};

interface PersonalityPairEntry {
  label: string;
  dynamic: string;
  tip: string;
  score: number;
}

const PERSONALITY_PAIRS: Record<string, PersonalityPairEntry> = {};

const PAIR_DATA: Record<string, Partial<PersonalityPairEntry>> = {
  "ENTJ-INTJ": { label: "The Commander & The Architect", dynamic: "Both strategic and driven. ENTJ pushes for action while INTJ refines the vision. You align on ambition but may clash on pace — ENTJ wants to move now, INTJ wants to think more.", tip: "Set clear decision deadlines. Let INTJ think, but agree on when thinking becomes overthinking.", score: 72 },
  "ENTP-INTP": { label: "The Debater & The Logician", dynamic: "Both love ideas and intellectual sparring. ENTP generates while INTP analyzes. You'll never run out of things to talk about, but you might struggle to pick one and execute.", tip: "Assign a 'decider' role per project. One of you needs to own the call.", score: 78 },
  "ENFP-INFP": { label: "The Campaigner & The Mediator", dynamic: "Both idealistic and values-driven. ENFP generates possibilities, INFP deepens them. Deep emotional understanding, but watch for mutual avoidance of hard conversations.", tip: "Schedule regular reality checks. Your shared optimism is powerful, but don't skip the hard conversations.", score: 76 },
  "ENFJ-INFJ": { label: "The Protagonist & The Advocate", dynamic: "Both intuitive feelers who care deeply about people. ENFJ leads outward, INFJ probes inward. Powerful synergy for anything mission-driven, but both can burn out from over-investing.", tip: "Set boundaries together. You're both givers — protect your energy.", score: 80 },
  "ESTJ-ISTJ": { label: "The Executive & The Logistician", dynamic: "Both value structure, order, and tradition. ESTJ leads outward with authority, ISTJ builds the systems. Highly efficient but may lack creative flexibility.", tip: "Schedule intentional creative brainstorming to complement your natural structure.", score: 75 },
  "ESFJ-ISFJ": { label: "The Consul & The Defender", dynamic: "Both nurturing, reliable, and detail-oriented. ESFJ expresses care outwardly, ISFJ through quiet consistency. Deep mutual understanding, but watch for unspoken resentment building.", tip: "Explicitly ask for what you need. Both of you tend to give silently and hope the other notices.", score: 82 },
  "ESTP-ISTP": { label: "The Entrepreneur & The Virtuoso", dynamic: "Both action-oriented and hands-on. ESTP acts on instinct, ISTP analyzes then acts. Great in crisis, but may neglect long-term planning.", tip: "Set quarterly goal reviews. Your combined adaptiveness is a superpower, but pair it with forward planning.", score: 70 },
  "ESFP-ISFP": { label: "The Entertainer & The Adventurer", dynamic: "Both spontaneous, sensory, and present-focused. ESFP brings the party, ISFP brings the depth. Deeply in sync socially, but may avoid planning and conflict.", tip: "Create shared rituals and commitments. Your flexibility is great — but anchor it with structure.", score: 74 },
  "ENTP-ENFP": { label: "The Innovator & The Campaigner", dynamic: "Boundless ideas and energy. ENTP challenges the status quo, ENFP dreams up what could be. Electric collaboration, but finishing things requires outside help.", tip: "Use a 'one in, one out' rule for projects. Start something new only when something else ships.", score: 73 },
  "ENTJ-ENFJ": { label: "The Commander & The Protagonist", dynamic: "ENTJ drives strategy, ENFJ rallies the people. A powerful leadership duo that can mobilize entire organizations. Just watch for ENTJ steamrolling ENFJ's emotional input.", tip: "ENTJ: Schedule time to listen. ENFJ: Push back when strategy conflicts with values.", score: 71 },
  "INTJ-INFJ": { label: "The Architect & The Advocate", dynamic: "Both introverted intuitives who think long-term. INTJ plans the system, INFJ reads the people. Quiet but fierce partnership. INFJ may feel INTJ is cold; INTJ may feel INFJ is indirect.", tip: "INTJ: Ask how people will feel about your plan. INFJ: Say what you actually need, not what you think others want to hear.", score: 77 },
  "INTP-INFJ": { label: "The Logician & The Advocate", dynamic: "INTP provides frameworks, INFJ provides meaning. One of the most intellectually stimulating pairs. INTP challenges INFJ's assumptions; INFJ gives INTP something worth solving.", tip: "Respect each other's processing style. INTP needs time to think; INFJ needs time to feel.", score: 74 },
  "ENTP-INFJ": { label: "The Innovator & The Advocate", dynamic: "A classic complementary pair. ENTP generates disruptive ideas, INFJ refines them based on human impact. INFJ grounds ENTP's chaos; ENTP pushes INFJ past perfectionism.", tip: "ENTP: Slow down when INFJ is processing. INFJ: Share your vision early — ENTP can help you build it.", score: 79 },
  "ESTJ-ENFJ": { label: "The Executive & The Protagonist", dynamic: "ESTJ runs the operations, ENFJ inspires the team. A natural command partnership. ESTJ may find ENFJ too idealistic; ENFJ may find ESTJ too rigid.", tip: "ESTJ: Use empathy before efficiency. ENFJ: Respect ESTJ's need for clear processes.", score: 62 },
  "ISTP-ISFP": { label: "The Virtuoso & The Adventurer", dynamic: "Both quiet, independent, and hands-on. ISTP solves technical problems, ISFP brings aesthetic sensibility. Low-maintenance partnership but may drift apart without intentional connection.", tip: "Schedule shared activities — building something, cooking, hiking. Your connection deepens through doing, not talking.", score: 68 },
};

for (const [key, data] of Object.entries(PAIR_DATA)) {
  PERSONALITY_PAIRS[key] = data as PersonalityPairEntry;
  const [a, b] = key.split("-");
  if (a !== b) {
    PERSONALITY_PAIRS[`${b}-${a}`] = data as PersonalityPairEntry;
  }
}

const DIMENSION_COMPAT: Record<string, Record<string, number>> = {
  E: { E: 60, I: 55 },
  I: { E: 55, I: 60 },
  N: { N: 65, S: 50 },
  S: { N: 50, S: 65 },
  T: { T: 60, F: 55 },
  F: { T: 55, F: 60 },
  J: { J: 60, P: 55 },
  P: { J: 55, P: 60 },
};

function defaultPersonalityPair(typeA: string, typeB: string): PersonalityPairEntry {
  let score = 50;
  for (let i = 0; i < 4; i++) {
    const dimA = typeA[i];
    const dimB = typeB[i];
    const pair = `${dimA}${dimB[i] ?? dimB}`;
    if (dimA === dimB) {
      score += 5;
    } else {
      score += (DIMENSION_COMPAT[dimA]?.[dimB] ?? 50) - 50;
    }
  }
  return {
    label: `The ${typeA} & The ${typeB}`,
    dynamic: `${typeA} and ${typeB} bring different perspectives. Your differences can be complementary when you communicate openly and respect each other's natural tendencies.`,
    tip: "Focus on what each person brings rather than where they differ. Active listening bridges most type gaps.",
    score: Math.max(30, Math.min(90, score)),
  };
}

const DEFAULT_PAIR: PersonalityPairEntry = { label: "The Unknown Pair", dynamic: "Every personality combination has potential for great collaboration.", tip: "Focus on understanding each other's communication preferences.", score: 50 };

function getPersonalityPair(typeA: string, typeB: string): PersonalityPairEntry {
  const key = `${typeA}-${typeB}`;
  const reverseKey = `${typeB}-${typeA}`;
  if (PERSONALITY_PAIRS[key]) return PERSONALITY_PAIRS[key];
  if (PERSONALITY_PAIRS[reverseKey]) return PERSONALITY_PAIRS[reverseKey];
  return defaultPersonalityPair(typeA, typeB);
}

interface EnneagramPairEntry {
  label: string;
  dynamic: string;
  atBest: string;
  underStress: string;
}

const ENNEAGRAM_PAIRS: Record<string, EnneagramPairEntry> = {
  "1-2": { label: "The Reformer & The Helper", dynamic: "Type 1's integrity meets Type 2's generosity. You balance moral conviction with heartfelt service.", atBest: "1 provides principled direction; 2 provides warmth that softens 1's critical edge.", underStress: "1 becomes judgmental; 2 becomes intrusive and resentful when help is unappreciated." },
  "1-3": { label: "The Reformer & The Achiever", dynamic: "Both driven and goal-oriented. 1 brings ethics, 3 brings ambition — a high-achievement pairing.", atBest: "You set extraordinary standards and achieve them. 1 provides the moral compass, 3 provides the momentum.", underStress: "1 rigidly insists on perfection; 3 compromises ethics for success. Conflict over means vs. ends." },
  "1-4": { label: "The Reformer & The Individualist", dynamic: "1's discipline meets 4's emotional depth. You can create work that is both excellent and meaningful.", atBest: "4's creativity gives 1 something worth perfecting; 1's standards give 4 a framework for expression.", underStress: "1 becomes harshly critical of 4's emotional fluctuations; 4 feels misunderstood and withdraws." },
  "1-5": { label: "The Reformer & The Investigator", dynamic: "Both analytical and values-driven. 1 focuses on what should be; 5 focuses on what is. Powerful intellectual partnership.", atBest: "5 provides objective analysis; 1 provides principled direction. Together you build systems that are both correct and fair.", underStress: "1 criticizes 5's detachment; 5 withdraws from 1's perceived rigidity." },
  "1-6": { label: "The Reformer & The Loyalist", dynamic: "Both duty-oriented and conscientious. You share a deep sense of responsibility and commitment.", atBest: "1 provides moral clarity; 6 provides loyal follow-through. A steadfast, reliable partnership.", underStress: "1 becomes rigid and judgmental; 6 becomes anxious and defensive. Both dig into opposing positions." },
  "1-7": { label: "The Reformer & The Enthusiast", dynamic: "Opposites in many ways — 1 seeks order, 7 seeks variety. Can be deeply complementary if you embrace your differences.", atBest: "7 lightens 1's seriousness; 1 provides structure for 7's scattered energy. Work and play in balance.", underStress: "1 becomes rigid and critical of 7's chaos; 7 escapes 1's rules into distraction." },
  "1-8": { label: "The Reformer & The Challenger", dynamic: "Both strong-willed and justice-oriented. 1 is principled; 8 is powerful. Together you can move mountains.", atBest: "8 provides the force; 1 provides the ethics. A powerful reform duo that gets things done right.", underStress: "Both become controlling — 1 through rules, 8 through dominance. Power struggles escalate." },
  "1-9": { label: "The Reformer & The Peacemaker", dynamic: "9's patience tempers 1's intensity. 1 provides direction, 9 provides calm — a stabilizing partnership.", atBest: "1 provides purpose; 9 provides peace. Together you create orderly, harmonious environments.", underStress: "1 becomes critical; 9 withdraws into passive resistance. Unspoken frustration builds." },
  "2-3": { label: "The Helper & The Achiever", dynamic: "Both people-focused and success-oriented. 2 connects through caring; 3 connects through achievement. A charismatic pair.", atBest: "2 provides genuine support; 3 provides ambitious direction. Together you inspire others to follow.", underStress: "2 becomes possessive; 3 becomes image-focused. Emotional needs are neglected." },
  "2-4": { label: "The Helper & The Individualist", dynamic: "Both emotionally attuned and relationship-focused. Deep emotional connection, but risk of co-dependency.", atBest: "2 provides steady caring; 4 provides emotional depth. A deeply empathetic partnership.", underStress: "2 becomes smothering; 4 becomes dramatic. Both feel unappreciated and withdraw." },
  "2-5": { label: "The Helper & The Investigator", dynamic: "Opposite styles — 2 connects emotionally, 5 connects intellectually. Can be complementary if yourespect the difference.", atBest: "5 provides objective perspective; 2 provides warmth and connection. You help each other grow beyond your comfort zones.", underStress: "2 feels rejected by 5's need for space; 5 feels overwhelmed by 2's emotional demands." },
  "2-6": { label: "The Helper & The Loyalist", dynamic: "Both relationship-focused and security-oriented. 2 gives love, 6 gives loyalty — a deeply committed pair.", atBest: "2 provides warmth and reassurance; 6 provides steadfast loyalty. Connection through mutual care.", underStress: "2 becomes manipulative; 6 becomes suspicious. Both fear abandonment." },
  "2-7": { label: "The Helper & The Enthusiast", dynamic: "Both warm and people-oriented. 2 nurtures; 7 energizes. A joyful, socially dynamic partnership.", atBest: "7 brings fun and possibility; 2 brings depth and care. You make everything both productive and enjoyable.", underStress: "2 becomes possessive about 7's attention; 7 escapes into new experiences." },
  "2-8": { label: "The Helper & The Challenger", dynamic: "2 provides care, 8 provides strength. You can accomplish a lot together when intentions align.", atBest: "8 provides protection and decisive leadership; 2 provides emotional intelligence and care. A powerful caretaking duo.", underStress: "8 becomes dominating; 2 becomes manipulative through guilt. Power dynamics become unhealthy." },
  "2-9": { label: "The Helper & The Peacemaker", dynamic: "Both gentle, supportive, and relationship-oriented. A nurturing, peaceful partnership.", atBest: "2 provides active care; 9 provides unconditional acceptance. Deep mutual warmth.", underStress: "Both become passive-aggressive. 2 over-gives and resents; 9 withdraws into numbness." },
  "3-4": { label: "The Achiever & The Individualist", dynamic: "3 drives for success, 4 seeks authenticity. Together you can create work that is both excellent and meaningful.", atBest: "3 provides ambition; 4 provides originality. You build things that succeed because they're genuine.", underStress: "3 becomes image-obsessed; 4 becomes self-absorbed. Neither feels the other truly understands them." },
  "3-5": { label: "The Achiever & The Investigator", dynamic: "3 drives forward, 5 analyzes deeply. A competent, results-driven partnership when aligned.", atBest: "5 provides deep expertise; 3 provides implementation energy. You turn analysis into achievement.", underStress: "3 pushes for speed; 5 withdraws into analysis paralysis. 3 feels 5 is too slow; 5 feels 3 is superficial." },
  "3-6": { label: "The Achiever & The Loyalist", dynamic: "3's ambition meets 6's loyalty. A driven, responsible partnership that values both success and security.", atBest: "3 provides vision and execution; 6 provides thoroughness and risk assessment. You plan boldly but carefully.", underStress: "3 becomes ruthless about image; 6 becomes anxious and questioning. Trust erodes." },
  "3-7": { label: "The Achiever & The Enthusiast", dynamic: "Both energetic and future-oriented. A high-energy, optimistic duo that dreams big and acts fast.", atBest: "7 generates possibilities; 3 executes. You achieve more together than either would alone.", underStress: "Both overcommit and under-deliver. 3 chases image; 7 chases novelty. Nothing gets finished." },
  "3-8": { label: "The Achiever & The Challenger", dynamic: "Both powerful and action-oriented. 3 wants to succeed; 8 wants to control. A dominant, results-driven partnership.", atBest: "3 provides social intelligence; 8 provides directness. You lead and execute at scale.", underStress: "Power struggles. 3 manipulates image; 8 dominates directly. Who's in charge?" },
  "3-9": { label: "The Achiever & The Peacemaker", dynamic: "3's drive meets 9's calm. 3 pushes forward; 9 goes along — but may check out.", atBest: "9 provides stability that lets 3 focus; 3 provides direction that gives 9 purpose.", underStress: "3 becomes impatient with 9's pace; 9 disengages. 3 feels alone; 9 feels pressured." },
  "4-5": { label: "The Individualist & The Investigator", dynamic: "Both introspective and deep. 4 brings emotional depth, 5 brings intellectual depth. A richly thoughtful partnership.", atBest: "5 provides clarity; 4 provides meaning. You understand each other's need for depth.", underStress: "4 becomes emotionally overwhelming; 5 withdraws. Both feel misunderstood." },
  "4-6": { label: "The Individualist & The Loyalist", dynamic: "Both sensitive to emotional undercurrents. 4 adds depth; 6 adds loyalty. An emotionally rich connection.", atBest: "6 provides grounding; 4 provides emotional insight. Deep mutual understanding.", underStress: "4 becomes dramatic; 6 becomes anxious. Both doubt the other's commitment." },
  "4-7": { label: "The Individualist & The Enthusiast", dynamic: "Opposite energies — 4 goes deep, 7 goes wide. Can be complementary or exhausting.", atBest: "7 provides lightness and possibility; 4 provides depth and meaning. The most creative pairing.", underStress: "4 feels 7 is superficial; 7 feels 4 is dramatic. Emotional whiplash." },
  "4-8": { label: "The Individualist & The Challenger", dynamic: "Intense pairing — both feel deeply. 4 channels into art; 8 channels into power.", atBest: "8 protects 4's vulnerability; 4 softens 8's intensity. Passionate, authentic connection.", underStress: "Both become volatile. 4 withdraws dramatically; 8 explodes. Emotional escalation." },
  "4-9": { label: "The Individualist & The Peacemaker", dynamic: "Both feelers, but 4 feels intensely while 9 avoids intensity. Requires patience.", atBest: "9 provides unconditional acceptance; 4 helps 9 connect with deeper feelings. Gentle growth.", underStress: "4 feels unheard; 9 feels overwhelmed. Both withdraw — 4 into drama, 9 into numbness." },
  "5-6": { label: "The Investigator & The Loyalist", dynamic: "Both thinking types. 5 seeks understanding, 6 seeks security. A thoughtful, careful partnership.", atBest: "5 provides insight and objectivity; 6 provides practical implementation and vigilance.", underStress: "5 withdraws when anxious; 6 overthinks. Both spiral into worst-case thinking." },
  "5-7": { label: "The Investigator & The Enthusiast", dynamic: "Both curious, but in different ways — 5 goes deep into one topic, 7 explores many. Complementary intellectual pairing.", atBest: "7 brings energy and new perspectives; 5 brings depth and mastery. You cover breadth and depth.", underStress: "7 overwhelms 5's need for quiet; 5 shuts down 7's excitement. Both retreat — 7 outward, 5 inward." },
  "5-8": { label: "The Investigator & The Challenger", dynamic: "Both strong and independent. 5 thinks; 8 acts. A powerful intellectual partnership when aligned.", atBest: "5 provides strategic depth; 8 provides decisive action. You make brilliant, well-executed decisions.", underStress: "5 becomes withdrawn; 8 becomes confrontational. 8 tries to force 5 out of their shell." },
  "5-9": { label: "The Investigator & The Peacemaker", dynamic: "Both quiet and low-energy on the surface. 5 thinks deeply; 9 feels peacefully. May not push each other.", atBest: "9 provides comfort; 5 provides insight. A peaceful, intellectual partnership.", underStress: "Both withdraw — 5 into thought, 9 into comfort. Nothing gets addressed or resolved." },
  "6-7": { label: "The Loyalist & The Enthusiast", dynamic: "6 provides grounding, 7 provides energy. A fun, responsible partnership when balanced.", atBest: "7 lightens 6's anxiety; 6 keeps 7's wild ideas practical. Optimistic pragmatism.", underStress: "6 becomes anxious and skeptical; 7 escapes into distraction. Anxiety spirals." },
  "6-8": { label: "The Loyalist & The Challenger", dynamic: "Both strong and confrontational when provoked. 6 questions; 8 decides. A powerful alliance when trust exists.", atBest: "8 provides decisive leadership; 6 provides loyal challenge. You make bold, well-vetted decisions.", underStress: "6 becomes suspicious and challenging; 8 becomes dominating. Trust breaks down." },
  "6-9": { label: "The Loyalist & The Peacemaker", dynamic: "Both seek security and stability. 6 worries; 9 avoids. May enable each other's avoidance.", atBest: "9 provides calm reassurance; 6 provides alertness and protection. A safe, stable partnership.", underStress: "6's anxiety is met with 9's denial. Problems go unaddressed. Both become passive." },
  "7-8": { label: "The Enthusiast & The Challenger", dynamic: "Both high-energy and assertive. 7 wants freedom; 8 wants power. Exciting but potentially explosive.", atBest: "7 generates ideas and energy; 8 implements with force. You get things started and finished.", underStress: "7 escapes responsibility; 8 takes over. Freedom vs. control battles." },
  "7-9": { label: "The Enthusiast & The Peacemaker", dynamic: "Both optimistic and positive. 7 brings excitement, 9 brings peace. Easygoing but may avoid hard conversations.", atBest: "7 provides energy and ideas; 9 provides acceptance and calm. The most easygoing pair.", underStress: "Neither addresses problems. 7 escapes; 9 numbs. Issues accumulate silently." },
  "8-9": { label: "The Challenger & The Peacemaker", dynamic: "8 provides strength, 9 provides patience. A balanced pairing when 8 leads gently and 9 stands firm.", atBest: "8 provides decisive action; 9 provides patient wisdom. You balance power with peace.", underStress: "8 becomes domineering; 9 becomes passive-aggressive. Unspoken resentment builds." },
};

const SAME_TYPE_PAIRS: Record<number, EnneagramPairEntry> = {
  1: { label: "Two Reformers", dynamic: "Both strive for perfection and integrity. You hold each other to high standards — use that as mutual accountability, not criticism.", atBest: "Shared values and principles create a strong foundation of trust and respect.", underStress: "Both become critical and rigid. Who's right becomes more important than what works." },
  2: { label: "Two Helpers", dynamic: "Both naturally giving and supportive. Deep emotional understanding, but risk of co-dependency and neglecting your own needs.", atBest: "Unmatched mutual care and emotional attunement. You always feel supported.", underStress: "Both overgive and burn out. Who takes care of the caretakers?" },
  3: { label: "Two Achievers", dynamic: "Both ambitious and image-conscious. Extraordinary output, but may compete rather than collaborate.", atBest: "Double the drive and ambition. You inspire each other to excel and understand the pressure of performance.", underStress: "Competitive comparison replaces collaboration. Image management becomes exhausting." },
  4: { label: "Two Individualists", dynamic: "Deeply emotional and creative. Profound understanding, but may amplify each other's moods.", atBest: "Incredible creative synergy and emotional depth. You truly understand each other's inner world.", underStress: "Emotional intensity doubles. Both retreat into melodrama and reinforce each other's triggers." },
  5: { label: "Two Investigators", dynamic: "Both analytical and private. Respectful of each other's space and intellect. May lack emotional warmth.", atBest: "Intellectual partnership at the highest level. Fascinating conversations and mutual respect for autonomy.", underStress: "Both withdraw. Communication becomes purely transactional. The relationship goes on autopilot." },
  6: { label: "Two Loyalists", dynamic: "Deep trust and commitment. You understand each other's need for security — but may amplify each other's anxiety.", atBest: "Unshakable loyalty and mutual support. You build a fortress of trust together.", underStress: "Anxiety amplifies. Both doubt and reinforce each other's worst-case thinking." },
  7: { label: "Two Enthusiasts", dynamic: "Endless energy and possibilities. The most fun any pairing can have, but may lack follow-through.", atBest: "Unlimited enthusiasm, creativity, and adventure. Life is never boring.", underStress: "Both avoid problems. Escapism becomes the norm. Nothing difficult gets addressed." },
  8: { label: "Two Challengers", dynamic: "Powerful and direct. When aligned, you move mountains. When conflicted, you clash.", atBest: "Unstoppable partnership built on mutual respect and direct communication. No hidden agendas.", underStress: "Power struggles dominate. Neither backs down. The relationship becomes a battlefield." },
  9: { label: "Two Peacemakers", dynamic: "Harmonious and easygoing. Deeply accepting of each other, but may avoid necessary conflict.", atBest: "A peaceful, supportive partnership. Both feel completely accepted and at ease.", underStress: "Passive avoidance on both sides. Problems are ignored until they become crises." },
};

for (const [key, entry] of Object.entries(ENNEAGRAM_PAIRS)) {
  const [a, b] = key.split("-").map(Number);
  if (a === b) continue;
  const reverseKey = `${b}-${a}`;
  if (!ENNEAGRAM_PAIRS[reverseKey]) {
    ENNEAGRAM_PAIRS[reverseKey] = entry;
  }
}

for (const [typeStr, entry] of Object.entries(SAME_TYPE_PAIRS)) {
  const type = Number(typeStr);
  const key = `${type}-${type}`;
  ENNEAGRAM_PAIRS[key] = entry;
}

const DEFAULT_ENNEAGRAM_PAIR: EnneagramPairEntry = {
  label: "Unknown Pair",
  dynamic: "Every Enneagram pairing has unique potential for growth and understanding.",
  atBest: "Mutual respect and willingness to learn from differences.",
  underStress: "Falling back on type habits without awareness of each other's needs.",
};

function getEnneagramPair(typeA: number, typeB: number): EnneagramPairEntry {
  const key = `${typeA}-${typeB}`;
  const reverseKey = `${typeB}-${typeA}`;
  if (ENNEAGRAM_PAIRS[key]) return ENNEAGRAM_PAIRS[key];
  if (ENNEAGRAM_PAIRS[reverseKey]) return ENNEAGRAM_PAIRS[reverseKey];
  if (typeA === typeB && SAME_TYPE_PAIRS[typeA]) return SAME_TYPE_PAIRS[typeA];
  return DEFAULT_ENNEAGRAM_PAIR;
}

export function generateRelationshipReport(
  profileA: StoredProfile,
  profileB: StoredProfile,
): Omit<RelationshipReport, "id" | "createdAt"> {
  const compatibilityScore = computeCompatibilityScore(profileA, profileB);
  const discScore = computeDISCScore(profileA.discPrimary, profileB.discPrimary);
  const discAdvice = DISC_ADVICE[profileA.discPrimary]?.[profileB.discPrimary]
    ?? DISC_ADVICE[profileB.discPrimary]?.[profileA.discPrimary]
    ?? {
      howA: "Focus on understanding each other's communication preferences.",
      howB: "Be patient and listen actively.",
      meeting: "Regular check-ins with clear agenda items.",
      tips: ["Listen before responding", "Clarify your communication style", "Set regular check-ins"],
    };

  const strengthsScore = computeStrengthsScore(profileA, profileB);
  const topASet = new Set(profileA.topStrengths.slice(0, 5));
  const topBSet = new Set(profileB.topStrengths.slice(0, 5));
  const bottomA = Object.entries(profileA.strengthScores).sort(([, a], [, b]) => a - b).slice(0, 5).map(([k]) => k);
  const bottomB = Object.entries(profileB.strengthScores).sort(([, a], [, b]) => a - b).slice(0, 5).map(([k]) => k);
  const sharedStrengths = profileA.topStrengths.slice(0, 5).filter((s) => topBSet.has(s));
  const complementA = bottomA.filter((s) => topBSet.has(s));
  const complementB = bottomB.filter((s) => topASet.has(s));
  const frictionStrengths = profileA.topStrengths.slice(0, 5).filter(
    (s) => new Set(bottomB).has(s)
  );
  const bottomBSet = new Set(bottomB);
  const frictionStrengths2 = profileB.topStrengths.slice(0, 5).filter(
    (s) => new Set(bottomA).has(s)
  );
  const allFriction = [...new Set([...frictionStrengths, ...frictionStrengths2])];

  const personalityPair = getPersonalityPair(profileA.personalityType, profileB.personalityType);
  const enneagramPair = getEnneagramPair(profileA.enneagramPrimary, profileB.enneagramPrimary);

  return {
    profileA: profileA.profileHash,
    profileB: profileB.profileHash,
    compatibilityScore,
    discCompatibility: {
      score: discScore,
      typeA: profileA.discPrimary,
      typeB: profileB.discPrimary,
      howACommunicatesWithB: discAdvice.howA,
      howBCommunicatesWithA: discAdvice.howB,
      bestMeetingFormat: discAdvice.meeting,
      tips: discAdvice.tips,
    },
    strengthsOverlap: {
      score: strengthsScore,
      shared: sharedStrengths,
      complementA,
      complementB,
      friction: allFriction,
    },
    personalityInteraction: {
      score: personalityPair.score,
      typeA: profileA.personalityType,
      typeB: profileB.personalityType,
      label: personalityPair.label,
      dynamic: personalityPair.dynamic,
      tip: personalityPair.tip,
    },
    enneagramConnection: {
      typeA: profileA.enneagramPrimary,
      typeB: profileB.enneagramPrimary,
      label: enneagramPair.label,
      dynamic: enneagramPair.dynamic,
      atBest: enneagramPair.atBest,
      underStress: enneagramPair.underStress,
    },
    profileASummary: {
      personalityType: profileA.personalityType,
      personalityLabel: getPersonalityLabel(profileA.personalityType),
      discStyle: profileA.discStyle,
      discPrimary: profileA.discPrimary,
      enneagramWing: profileA.enneagramWing,
      topStrengths: profileA.topStrengths,
    },
    profileBSummary: {
      personalityType: profileB.personalityType,
      personalityLabel: getPersonalityLabel(profileB.personalityType),
      discStyle: profileB.discStyle,
      discPrimary: profileB.discPrimary,
      enneagramWing: profileB.enneagramWing,
      topStrengths: profileB.topStrengths,
    },
  };
}

const PERSONALITY_LABELS: Record<string, string> = {
  INTJ: "The Architect", INTP: "The Logician", ENTJ: "The Commander", ENTP: "The Debater",
  INFJ: "The Advocate", INFP: "The Mediator", ENFJ: "The Protagonist", ENFP: "The Campaigner",
  ISTJ: "The Logistician", ISFJ: "The Defender", ESTJ: "The Executive", ESFJ: "The Consul",
  ISTP: "The Virtuoso", ISFP: "The Adventurer", ESTP: "The Entrepreneur", ESFP: "The Entertainer",
};

function getPersonalityLabel(type: string): string {
  return PERSONALITY_LABELS[type] ?? "Unknown";
}

export { getPersonalityLabel };