import { type StrengthScore } from "../hooks/useAssessment";

// ============================================================
// PERSONALITY TYPE DERIVATION from 20-strength profile
// ============================================================

export interface PersonalityDimension {
  label: string;
  pole1: string;
  pole1Code: string;
  pole2: string;
  pole2Code: string;
  score: number; // -100 (pole1) to +100 (pole2)
  result: string; // the winning letter
  confidence: number; // 0-100%
}

export interface PersonalityResult {
  type: string; // e.g. "ENTP"
  label: string; // e.g. "The Debater"
  description: string;
  dimensions: PersonalityDimension[];
  confidence: number; // overall 0-100%
}

const personalityLabels: Record<string, string> = {
  INTJ: "The Architect",
  INTP: "The Logician",
  ENTJ: "The Commander",
  ENTP: "The Debater",
  INFJ: "The Advocate",
  INFP: "The Mediator",
  ENFJ: "The Protagonist",
  ENFP: "The Campaigner",
  ISTJ: "The Logistician",
  ISFJ: "The Defender",
  ESTJ: "The Executive",
  ESFJ: "The Consul",
  ISTP: "The Virtuoso",
  ISFP: "The Adventurer",
  ESTP: "The Entrepreneur",
  ESFP: "The Entertainer",
};

const personalityDescriptions: Record<string, string> = {
  INTJ: "Strategic and independent thinkers who see the big picture and devise long-term plans. Value competence and knowledge above all.",
  INTP: "Innovative thinkers driven by an insatiable thirst for knowledge. Excel at analyzing complex systems and finding logical patterns.",
  ENTJ: "Bold, decisive leaders who always find a way. Natural-born strategists who enjoy mobilizing people toward a shared vision.",
  ENTP: "Quick-witted innovators who cannot resist an intellectual challenge. Thrive on debating ideas and exploring new possibilities.",
  INFJ: "Insightful idealists driven by a deep sense of purpose. Quietly influential, with a gift for understanding others' motivations.",
  INFP: "Empathetic dreamers guided by their own core values. Creative and compassionate, always seeking meaning and authenticity.",
  ENFJ: "Charismatic leaders who inspire and develop others. Natural teachers with a gift for bringing out the best in people.",
  ENFP: "Enthusiastic, creative free spirits who can always find a reason to smile. See life as full of possibilities and connections.",
  ISTJ: "Responsible and thorough, with a deep respect for facts and traditions. The backbone of any organization, quietly ensuring things work.",
  ISFJ: "Dedicated protectors who combine warmth with meticulous attention to detail. Loyal and reliable, they remember what matters to others.",
  ESTJ: "Excellent organizers who value order, loyalty, and tradition. Natural managers who lead by example and hold high standards.",
  ESFJ: "Warm-hearted, popular, and conscientious. Natural hosts who care deeply about social harmony and the well-being of others.",
  ISTP: "Bold, practical experimenters who enjoy figuring out how things work. Cool-headed problem solvers with a knack for hands-on solutions.",
  ISFP: "Flexible, charming artists who embrace the present moment. Quiet on the surface but passionate about their values underneath.",
  ESTP: "Energetic thrill-seekers who are always ready for action. Smart, perceptive, and direct — they live in the moment.",
  ESFP: "Spontaneous entertainers who love life and bring joy to others. Generous and observant, they turn any moment into a party.",
};

// Strength weights for each personality dimension
// Positive = pole2 (E, N, F, P), Negative = pole1 (I, S, T, J)
type DimWeights = Record<string, number>;

const eiWeights: DimWeights = {
  commander: 0.9, storyteller: 0.85, catalyst: 0.7, winner: 0.5, chameleon: 0.4, coach: 0.3,
  thinker: -0.8, analyst: -0.6, focus_expert: -0.5, philomath: -0.2,
};

const snWeights: DimWeights = {
  strategist: 0.9, brainstormer: 0.85, philomath: 0.5, thinker: 0.3,
  time_keeper: -0.8, deliverer: -0.6, problem_solver: -0.4, focus_expert: -0.3, believer: -0.2,
};

const tfWeights: DimWeights = {
  empathizer: 0.9, coach: 0.7, peacekeeper: 0.6, optimist: 0.5, chameleon: 0.2,
  analyst: -0.9, thinker: -0.6, problem_solver: -0.5, strategist: -0.3,
};

const jpWeights: DimWeights = {
  chameleon: 0.8, brainstormer: 0.6, catalyst: 0.5, self_believer: 0.3,
  deliverer: -0.9, time_keeper: -0.8, focus_expert: -0.6, believer: -0.3,
};

function computeDimension(
  scores: Map<string, number>,
  weights: DimWeights,
  pole1: string,
  pole1Code: string,
  pole2: string,
  pole2Code: string,
  label: string,
): PersonalityDimension {
  let weighted = 0;
  let totalWeight = 0;

  for (const [strengthId, weight] of Object.entries(weights)) {
    const score = scores.get(strengthId);
    if (score === undefined) continue;
    // Normalize score to -1..+1 (50 = neutral)
    const normalized = (score - 50) / 50;
    weighted += normalized * weight;
    totalWeight += Math.abs(weight);
  }

  // Scale to -100..+100
  const raw = totalWeight > 0 ? (weighted / totalWeight) * 100 : 0;
  const result = raw >= 0 ? pole2Code : pole1Code;
  const confidence = Math.min(100, Math.abs(raw));

  return { label, pole1, pole1Code, pole2, pole2Code, score: Math.round(raw), result, confidence: Math.round(confidence) };
}

export function derivePersonalityType(results: StrengthScore[]): PersonalityResult {
  const scores = new Map(results.map((r) => [r.strength.id, r.score]));

  const dims = [
    computeDimension(scores, eiWeights, "Introversion", "I", "Extraversion", "E", "Energy"),
    computeDimension(scores, snWeights, "Sensing", "S", "Intuition", "N", "Information"),
    computeDimension(scores, tfWeights, "Thinking", "T", "Feeling", "F", "Decisions"),
    computeDimension(scores, jpWeights, "Judging", "J", "Perceiving", "P", "Structure"),
  ];

  const type = dims.map((d) => d.result).join("");
  const avgConfidence = Math.round(dims.reduce((a, d) => a + d.confidence, 0) / 4);

  return {
    type,
    label: personalityLabels[type] || "Unknown Type",
    description: personalityDescriptions[type] || "",
    dimensions: dims,
    confidence: avgConfidence,
  };
}

// ============================================================
// ENNEAGRAM DERIVATION from 20-strength profile
// ============================================================

export interface EnneagramType {
  type: number;
  name: string;
  score: number; // 0-100
  description: string;
  coreMotivation: string;
  coreFear: string;
}

export interface EnneagramResult {
  primary: EnneagramType;
  wing: EnneagramType | null;
  wingLabel: string; // e.g. "3w4"
  tritype: [number, number, number]; // best from each center
  allTypes: EnneagramType[];
  confidence: number;
}

const enneagramDefs: { type: number; name: string; description: string; coreMotivation: string; coreFear: string }[] = [
  { type: 1, name: "The Reformer", description: "Principled, purposeful, self-controlled, and perfectionist. Driven by a desire to be good, ethical, and correct.", coreMotivation: "To be right and virtuous", coreFear: "Being corrupt, evil, or defective" },
  { type: 2, name: "The Helper", description: "Generous, demonstrative, people-pleasing, and possessive. Driven by a desire to be loved and needed.", coreMotivation: "To be loved and appreciated", coreFear: "Being unwanted or unworthy of love" },
  { type: 3, name: "The Achiever", description: "Adaptable, excelling, driven, and image-conscious. Driven by a desire to be valuable and worthwhile.", coreMotivation: "To be successful and admired", coreFear: "Being worthless or a failure" },
  { type: 4, name: "The Individualist", description: "Expressive, dramatic, self-absorbed, and temperamental. Driven by a desire to be unique and authentic.", coreMotivation: "To be unique and authentic", coreFear: "Having no identity or personal significance" },
  { type: 5, name: "The Investigator", description: "Perceptive, innovative, secretive, and isolated. Driven by a desire to understand the world.", coreMotivation: "To be competent and knowledgeable", coreFear: "Being useless or incapable" },
  { type: 6, name: "The Loyalist", description: "Engaging, responsible, anxious, and suspicious. Driven by a desire for security and support.", coreMotivation: "To have security and guidance", coreFear: "Being without support or guidance" },
  { type: 7, name: "The Enthusiast", description: "Spontaneous, versatile, acquisitive, and scattered. Driven by a desire for satisfaction and experience.", coreMotivation: "To be happy and fulfilled", coreFear: "Being trapped in pain or deprivation" },
  { type: 8, name: "The Challenger", description: "Self-confident, decisive, willful, and confrontational. Driven by a desire to be strong and in control.", coreMotivation: "To be strong and self-reliant", coreFear: "Being controlled or harmed by others" },
  { type: 9, name: "The Peacemaker", description: "Receptive, reassuring, complacent, and resigned. Driven by a desire for inner peace and harmony.", coreMotivation: "To have inner stability and peace", coreFear: "Loss, separation, and conflict" },
];

// Weight matrix: how each strength contributes to each Enneagram type
// Higher = stronger signal for that type
const enneagramWeights: Record<number, Record<string, number>> = {
  1: { believer: 1.0, deliverer: 0.7, problem_solver: 0.6, time_keeper: 0.5, analyst: 0.4, focus_expert: 0.3 },
  2: { coach: 1.0, empathizer: 0.9, peacekeeper: 0.5, optimist: 0.4, storyteller: 0.2 },
  3: { winner: 1.0, deliverer: 0.6, storyteller: 0.6, catalyst: 0.5, commander: 0.5, chameleon: 0.4, strategist: 0.3 },
  4: { storyteller: 0.7, brainstormer: 0.5, empathizer: 0.5, self_believer: 0.4, thinker: 0.3 },
  5: { analyst: 0.9, thinker: 1.0, philomath: 0.8, strategist: 0.5, problem_solver: 0.4 },
  6: { peacekeeper: 0.6, deliverer: 0.5, time_keeper: 0.5, believer: 0.4, focus_expert: 0.3 },
  7: { brainstormer: 1.0, chameleon: 0.8, catalyst: 0.7, philomath: 0.6, optimist: 0.5, storyteller: 0.3 },
  8: { commander: 1.0, self_believer: 0.9, catalyst: 0.5, winner: 0.4, problem_solver: 0.3 },
  9: { peacekeeper: 1.0, optimist: 0.7, chameleon: 0.5, empathizer: 0.3, coach: 0.2 },
};

export function deriveEnneagram(results: StrengthScore[]): EnneagramResult {
  const scores = new Map(results.map((r) => [r.strength.id, r.score]));

  const typed: EnneagramType[] = enneagramDefs.map((def) => {
    const weights = enneagramWeights[def.type] || {};
    let weighted = 0;
    let totalWeight = 0;

    for (const [strengthId, weight] of Object.entries(weights)) {
      const score = scores.get(strengthId);
      if (score === undefined) continue;
      weighted += score * weight;
      totalWeight += weight;
    }

    const avg = totalWeight > 0 ? weighted / totalWeight : 0;
    return { ...def, score: Math.round(avg) };
  });

  // Sort by score descending
  typed.sort((a, b) => b.score - a.score);

  const primary = typed[0];

  // Wing is adjacent type (primary +/- 1, wrapping 9↔1)
  const adjTypes = [
    primary.type === 1 ? 9 : primary.type - 1,
    primary.type === 9 ? 1 : primary.type + 1,
  ];
  const wing = typed.find((t) => adjTypes.includes(t.type)) || null;
  const wingLabel = wing ? `${primary.type}w${wing.type}` : `${primary.type}`;

  // Tritype: best from each center (gut 8-9-1, heart 2-3-4, head 5-6-7)
  const gut = typed.filter((t) => [8, 9, 1].includes(t.type))[0];
  const heart = typed.filter((t) => [2, 3, 4].includes(t.type))[0];
  const head = typed.filter((t) => [5, 6, 7].includes(t.type))[0];

  const topScore = typed[0].score;
  const gap = topScore - typed[1].score;
  const confidence = Math.min(100, Math.round(50 + gap * 2));

  return {
    primary,
    wing,
    wingLabel,
    tritype: [gut.type, heart.type, head.type],
    allTypes: typed,
    confidence,
  };
}

// ============================================================
// DISC DERIVATION from 20-strength profile
// ============================================================

export interface DISCDimension {
  code: string;
  name: string;
  score: number; // 0-100
  description: string;
  traits: string[];
}

export interface DISCResult {
  primary: DISCDimension;
  secondary: DISCDimension;
  style: string; // e.g. "Di" or "Id"
  dimensions: DISCDimension[];
  confidence: number;
}

const discDefs: { code: string; name: string; description: string; traits: string[] }[] = [
  {
    code: "D",
    name: "Dominance",
    description: "Direct, results-oriented, decisive, competitive. You value action and are driven to overcome challenges and achieve goals.",
    traits: ["Direct", "Decisive", "Competitive", "Results-driven", "Takes charge"],
  },
  {
    code: "I",
    name: "Influence",
    description: "Enthusiastic, optimistic, collaborative, expressive. You value relationships and are driven to persuade and inspire others.",
    traits: ["Enthusiastic", "Persuasive", "Optimistic", "Expressive", "Collaborative"],
  },
  {
    code: "S",
    name: "Steadiness",
    description: "Patient, reliable, team-oriented, supportive. You value consistency and are driven to maintain harmony and support others.",
    traits: ["Patient", "Reliable", "Supportive", "Consistent", "Team-oriented"],
  },
  {
    code: "C",
    name: "Conscientiousness",
    description: "Analytical, detail-oriented, systematic, quality-focused. You value accuracy and are driven to ensure correctness and high standards.",
    traits: ["Analytical", "Precise", "Systematic", "Quality-focused", "Methodical"],
  },
];

// Strength weights for each DISC dimension
const discWeights: Record<string, Record<string, number>> = {
  D: {
    commander: 1.0, self_believer: 0.8, winner: 0.7, catalyst: 0.6,
    problem_solver: 0.4, strategist: 0.3,
    peacekeeper: -0.5, empathizer: -0.3, optimist: -0.2,
  },
  I: {
    storyteller: 1.0, chameleon: 0.8, optimist: 0.7, catalyst: 0.6,
    coach: 0.5, brainstormer: 0.4, winner: 0.2,
    analyst: -0.5, thinker: -0.4, focus_expert: -0.3,
  },
  S: {
    peacekeeper: 1.0, deliverer: 0.8, coach: 0.6, empathizer: 0.6,
    believer: 0.5, optimist: 0.4,
    catalyst: -0.5, commander: -0.4, chameleon: -0.3, winner: -0.2,
  },
  C: {
    analyst: 1.0, time_keeper: 0.8, focus_expert: 0.7, problem_solver: 0.6,
    thinker: 0.5, deliverer: 0.3,
    chameleon: -0.4, brainstormer: -0.3, storyteller: -0.2,
  },
};

export function deriveDISC(results: StrengthScore[]): DISCResult {
  const scores = new Map(results.map((r) => [r.strength.id, r.score]));

  const dimensions: DISCDimension[] = discDefs.map((def) => {
    const weights = discWeights[def.code] || {};
    let weighted = 0;
    let totalWeight = 0;

    for (const [strengthId, weight] of Object.entries(weights)) {
      const score = scores.get(strengthId);
      if (score === undefined) continue;
      const normalized = (score - 50) / 50; // -1 to +1
      weighted += normalized * Math.abs(weight) * (weight > 0 ? 1 : -1);
      totalWeight += Math.abs(weight);
    }

    // Scale to 0-100 (50 = neutral)
    const raw = totalWeight > 0 ? (weighted / totalWeight) * 50 + 50 : 50;
    return { ...def, score: Math.round(Math.max(0, Math.min(100, raw))) };
  });

  // Sort to find primary and secondary
  const sorted = [...dimensions].sort((a, b) => b.score - a.score);
  const primary = sorted[0];
  const secondary = sorted[1];

  // Style label: primary uppercase + secondary lowercase (e.g. "Di", "Id", "CS")
  const style = primary.code + secondary.code.toLowerCase();

  const gap = primary.score - sorted[2].score;
  const confidence = Math.min(100, Math.round(40 + gap));

  return {
    primary,
    secondary,
    style,
    dimensions,
    confidence,
  };
}
