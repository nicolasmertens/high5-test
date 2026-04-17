export interface PlaybookGenerationInput {
  personalityType: string;
  personalityLabel: string;
  personalityDescription: string;
  discStyle: string;
  discPrimary: string;
  discTraits: string[];
  enneagramWing: string;
  enneagramPrimary: number;
  topStrengths: string[];
  strengthScores: Record<string, number>;
}

export interface PlaybookContent {
  growthPlan: {
    phase: string;
    focus: string;
    actions: string[];
  }[];
  careerPaths: string[];
  communicationGuide: {
    style: string;
    tips: string[];
  };
  stressManagement: {
    best: string;
    stress: string;
    recovery: string[];
  };
  leadershipDevelopment: string;
  strengthsInsight: string;
  generatedAt: number;
  model: string;
  isAiGenerated: true;
}

const PERSONALITY_LABELS: Record<string, string> = {
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

const DISC_DESCRIPTIONS: Record<string, string> = {
  D: "Dominance — direct, results-oriented, firm, decisive",
  I: "Influence — enthusiastic, optimistic, collaborative, persuasive",
  S: "Steadiness — patient, reliable, team-oriented, consistent",
  C: "Conscientiousness — analytical, detail-oriented, systematic, accurate",
};

const ENNEAGRAM_DESCRIPTIONS: Record<number, string> = {
  1: "The Reformer — principled, purposeful, self-controlled",
  2: "The Helper — caring, interpersonal, generous",
  3: "The Achiever — success-oriented, pragmatic, adaptive",
  4: "The Individualist — sensitive, expressive, dramatic",
  5: "The Investigator — perceptive, innovative, secretive",
  6: "The Loyalist — committed, security-oriented, engaging",
  7: "The Enthusiast — spontaneous, versatile, scattered",
  8: "The Challenger — self-confident, decisive, confrontational",
  9: "The Peacemaker — receptive, reassuring, complacent",
};

function buildPrompt(input: PlaybookGenerationInput): string {
  const label = PERSONALITY_LABELS[input.personalityType] || input.personalityLabel || "Unknown";
  const discDesc = DISC_DESCRIPTIONS[input.discPrimary] || input.discStyle;
  const enneagramNum = input.enneagramPrimary || parseInt(input.enneagramWing.split("w")[0], 10);
  const enneagramDesc = ENNEAGRAM_DESCRIPTIONS[enneagramNum] || "";
  const strengthsList = input.topStrengths
    .map((s, i) => `${i + 1}. ${s} (${input.strengthScores[s] || 100 - i * 5}%)`)
    .join("\n");

  return `You are a personality intelligence coach generating a personalized growth playbook.

USER PROFILE:
- 16 Personalities: ${input.personalityType} (${label})
- DISC: ${input.discStyle} — ${discDesc}
- Enneagram: ${input.enneagramWing} — ${enneagramDesc}
- Top Strengths:
${strengthsList}

Generate a personalized playbook as a JSON object with EXACTLY these keys:
{
  "growthPlan": [
    {"phase": "Days 1-30", "focus": "<string: theme for this phase>", "actions": ["<string>", "<string>", "<string>"]},
    {"phase": "Days 31-60", "focus": "<string>", "actions": ["<string>", "<string>", "<string>"]},
    {"phase": "Days 61-90", "focus": "<string>", "actions": ["<string>", "<string>", "<string>"]}
  ],
  "careerPaths": ["<6-8 specific career directions that match this profile>"],
  "communicationGuide": {
    "style": "<string: one-sentence description of their communication style>",
    "tips": ["<4 specific communication tips tailored to their DISC style>"]
  },
  "stressManagement": {
    "best": "<string: how they show up at their best>",
    "stress": "<string: how they behave under stress>",
    "recovery": ["<3-4 specific recovery strategies based on their Enneagram type>"]
  },
  "leadershipDevelopment": "<string: 2-3 sentences on their leadership potential and style>",
  "strengthsInsight": "<string: one paragraph connecting their top 3 strengths into a unified insight>"
}

RULES:
- Be specific to THIS profile, not generic advice
- Reference the actual personality type, DISC style, and Enneagram wing in tips
- Career paths should be specific roles/fields, not vague categories
- All text should be concise and actionable
- Return ONLY valid JSON, no markdown fences, no explanation`;
}

export async function generatePlaybook(
  input: PlaybookGenerationInput,
): Promise<PlaybookContent> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }

  const prompt = buildPrompt(input);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Claude API error ${response.status}: ${body}`);
  }

  const data = await response.json();
  const contentBlock = data.content?.[0];
  if (!contentBlock || contentBlock.type !== "text") {
    throw new Error("Unexpected Claude API response format");
  }

  const rawText = contentBlock.text.trim();
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Could not extract JSON from Claude response");
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error("Failed to parse Claude response as JSON");
  }

  const content: PlaybookContent = {
    growthPlan: Array.isArray(parsed.growthPlan)
      ? parsed.growthPlan.map((phase: Record<string, unknown>) => ({
          phase: String(phase.phase || ""),
          focus: String(phase.focus || ""),
          actions: Array.isArray(phase.actions)
            ? (phase.actions as unknown[]).map((a) => String(a))
            : [],
        }))
      : [],
    careerPaths: Array.isArray(parsed.careerPaths)
      ? (parsed.careerPaths as unknown[]).map((c) => String(c))
      : [],
    communicationGuide: {
      style: String((parsed.communicationGuide as Record<string, unknown>)?.style || ""),
      tips: Array.isArray((parsed.communicationGuide as Record<string, unknown>)?.tips)
        ? ((parsed.communicationGuide as Record<string, unknown>).tips as unknown[]).map((t) => String(t))
        : [],
    },
    stressManagement: {
      best: String((parsed.stressManagement as Record<string, unknown>)?.best || ""),
      stress: String((parsed.stressManagement as Record<string, unknown>)?.stress || ""),
      recovery: Array.isArray((parsed.stressManagement as Record<string, unknown>)?.recovery)
        ? ((parsed.stressManagement as Record<string, unknown>).recovery as unknown[]).map((r) => String(r))
        : [],
    },
    leadershipDevelopment: String(parsed.leadershipDevelopment || ""),
    strengthsInsight: String(parsed.strengthsInsight || ""),
    generatedAt: Date.now(),
    model: "claude-3-5-haiku",
    isAiGenerated: true as const,
  };

  return content;
}