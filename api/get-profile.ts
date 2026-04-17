import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getProfile } from "./lib/profile-storage.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { hash } = req.query;

  if (!hash || typeof hash !== "string") {
    return res.status(400).json({ error: "Missing profile hash" });
  }

  try {
    const profile = await getProfile(hash);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const safe = {
      profileHash: profile.profileHash,
      personalityType: profile.personalityType,
      discStyle: profile.discStyle,
      discPrimary: profile.discPrimary,
      discPrimaryScore: profile.discPrimaryScore,
      discSecondary: profile.discSecondary,
      discSecondaryScore: profile.discSecondaryScore,
      enneagramPrimary: profile.enneagramPrimary,
      enneagramPrimaryScore: profile.enneagramPrimaryScore,
      enneagramWing: profile.enneagramWing,
      topStrengths: profile.topStrengths,
      strengthScores: profile.strengthScores,
    };

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).json(safe);
  } catch (err) {
    console.error("get-profile error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
