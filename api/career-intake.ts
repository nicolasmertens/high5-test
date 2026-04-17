import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  updateProfileIntake,
  type IntakeAgeRange,
  type IntakeCareerStage,
  type IntakeTestReason,
} from "./lib/profile-storage.js";

const AGE_RANGES: IntakeAgeRange[] = ["18-24", "25-34", "35-44", "45-54", "55+"];
const CAREER_STAGES: IntakeCareerStage[] = [
  "university",
  "early_career",
  "mid_career",
  "career_changer",
  "plateaued",
  "return_to_work",
];
const TEST_REASONS: IntakeTestReason[] = [
  "career_guidance",
  "self_discovery",
  "team_building",
  "curiosity",
  "academic_requirement",
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { profileHash, ageRange, careerStage, testReason } = req.body || {};

  if (
    typeof ageRange !== "string" ||
    typeof careerStage !== "string" ||
    typeof testReason !== "string"
  ) {
    return res.status(400).json({ error: "Missing intake fields" });
  }
  if (!AGE_RANGES.includes(ageRange as IntakeAgeRange)) {
    return res.status(400).json({ error: "Invalid ageRange" });
  }
  if (!CAREER_STAGES.includes(careerStage as IntakeCareerStage)) {
    return res.status(400).json({ error: "Invalid careerStage" });
  }
  if (!TEST_REASONS.includes(testReason as IntakeTestReason)) {
    return res.status(400).json({ error: "Invalid testReason" });
  }

  if (typeof profileHash !== "string" || profileHash.length === 0) {
    return res.status(200).json({ stored: false, reason: "no_profile_hash" });
  }

  try {
    const updated = await updateProfileIntake(profileHash, {
      ageRange: ageRange as IntakeAgeRange,
      careerStage: careerStage as IntakeCareerStage,
      testReason: testReason as IntakeTestReason,
    });
    if (!updated) {
      return res.status(200).json({ stored: false, reason: "profile_not_found" });
    }
    return res.status(200).json({ stored: true, profileHash: updated.profileHash });
  } catch (err: unknown) {
    console.error("career-intake error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    if (
      message.includes("invalid_grant") ||
      message.includes("GCS credentials incomplete") ||
      message.includes("GCS_BUCKET_NAME")
    ) {
      return res.status(503).json({ error: "Service temporarily unavailable" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}
