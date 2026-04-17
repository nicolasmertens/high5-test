import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getProfile } from "../lib/profile-storage.js";

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

const STRENGTH_META: Record<string, { name: string; domain: string }> = {
  believer: { name: "Believer", domain: "doing" },
  deliverer: { name: "Deliverer", domain: "doing" },
  focus_expert: { name: "Focus Expert", domain: "doing" },
  problem_solver: { name: "Problem Solver", domain: "doing" },
  time_keeper: { name: "Time Keeper", domain: "doing" },
  analyst: { name: "Analyst", domain: "thinking" },
  brainstormer: { name: "Brainstormer", domain: "thinking" },
  philomath: { name: "Philomath", domain: "thinking" },
  strategist: { name: "Strategist", domain: "thinking" },
  thinker: { name: "Thinker", domain: "thinking" },
  chameleon: { name: "Chameleon", domain: "feeling" },
  coach: { name: "Coach", domain: "feeling" },
  empathizer: { name: "Empathizer", domain: "feeling" },
  optimist: { name: "Optimist", domain: "feeling" },
  peacekeeper: { name: "Peacekeeper", domain: "feeling" },
  catalyst: { name: "Catalyst", domain: "motivating" },
  commander: { name: "Commander", domain: "motivating" },
  self_believer: { name: "Self-Believer", domain: "motivating" },
  storyteller: { name: "Storyteller", domain: "motivating" },
  winner: { name: "Winner", domain: "motivating" },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "https://1test.me");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { hash } = req.query;
  if (!hash || typeof hash !== "string") {
    return res.status(400).json({ error: "Missing hash" });
  }

  try {
    const profile = await getProfile(hash);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const top5 = profile.topStrengths.slice(0, 5).map((id) => {
      const meta = STRENGTH_META[id];
      return {
        name: meta?.name ?? id,
        domain: meta?.domain ?? "unknown",
        score: profile.strengthScores?.[id] ?? 0,
      };
    });

    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=604800");
    return res.status(200).json({
      personalityType: profile.personalityType,
      personalityLabel: PERSONALITY_LABELS[profile.personalityType] ?? null,
      topStrengths: top5,
      discStyle: profile.discStyle,
      discPrimary: profile.discPrimary,
      enneagramWing: profile.enneagramWing,
      enneagramPrimary: profile.enneagramPrimary,
      referralCode: profile.referralCode,
      segment: profile.segment ?? null,
      createdAt: new Date(profile.createdAt).toISOString(),
    });
  } catch (err) {
    console.error("profile fetch error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
