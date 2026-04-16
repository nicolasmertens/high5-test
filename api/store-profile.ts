import type { VercelRequest, VercelResponse } from "@vercel/node";
import { storeProfile, getProfile, type StoredProfile } from "./lib/profile-storage.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      profileHash,
      referralCode,
      personalityType,
      discStyle,
      discPrimary,
      discPrimaryScore,
      discSecondary,
      discSecondaryScore,
      enneagramPrimary,
      enneagramPrimaryScore,
      enneagramWing,
      topStrengths,
      strengthScores,
    } = req.body;

    if (!profileHash || !referralCode || !personalityType || !discStyle || !discPrimary || !enneagramWing || !topStrengths || !strengthScores) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existing = await getProfile(profileHash);
    if (existing) {
      return res.status(200).json({ profileHash: existing.profileHash, referralCode: existing.referralCode });
    }

    const profile: StoredProfile = {
      profileHash,
      referralCode,
      personalityType,
      discStyle,
      enneagramWing,
      topStrengths,
      strengthScores,
      discPrimary,
      discPrimaryScore: discPrimaryScore ?? 0,
      discSecondary: discSecondary ?? "",
      discSecondaryScore: discSecondaryScore ?? 0,
      enneagramPrimary: enneagramPrimary ?? 0,
      enneagramPrimaryScore: enneagramPrimaryScore ?? 0,
      createdAt: Date.now(),
    };

    await storeProfile(profile);

    return res.status(201).json({ profileHash: profile.profileHash, referralCode: profile.referralCode });
  } catch (err: any) {
    console.error("Store profile error:", err);
    return res.status(500).json({ error: err.message || "Failed to store profile" });
  }
}