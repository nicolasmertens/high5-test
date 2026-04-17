import { gcsGet, gcsSet, gcsSetWithTTL, gcsGet as gcsGetIdx } from "./gcs-storage.js";

export type IntakeAgeRange = "18-24" | "25-34" | "35-44" | "45-54" | "55+";
export type IntakeCareerStage =
  | "university"
  | "early_career"
  | "mid_career"
  | "career_changer"
  | "plateaued"
  | "return_to_work";
export type IntakeTestReason =
  | "career_guidance"
  | "self_discovery"
  | "team_building"
  | "curiosity"
  | "academic_requirement";

export interface ProfileIntake {
  ageRange: IntakeAgeRange;
  careerStage: IntakeCareerStage;
  testReason: IntakeTestReason;
  updatedAt: number;
}

export interface StoredProfile {
  profileHash: string;
  referralCode: string;
  personalityType: string;
  discStyle: string;
  enneagramWing: string;
  topStrengths: string[];
  strengthScores: Record<string, number>;
  discPrimary: string;
  discPrimaryScore: number;
  discSecondary: string;
  discSecondaryScore: number;
  enneagramPrimary: number;
  enneagramPrimaryScore: number;
  createdAt: number;
  intake?: ProfileIntake;
  segment?: string | null;
}

export function deriveSegment(careerStage: IntakeCareerStage): string {
  const map: Record<IntakeCareerStage, string> = {
    university: "university_student",
    early_career: "early_career",
    mid_career: "mid_career",
    career_changer: "career_changer",
    plateaued: "plateaued_professional",
    return_to_work: "return_to_work",
  };
  return map[careerStage] ?? careerStage;
}

const PROFILE_TTL = 60 * 60 * 24 * 90;

export async function storeProfile(profile: StoredProfile): Promise<void> {
  await gcsSetWithTTL(`profiles/${profile.profileHash}.json`, profile, PROFILE_TTL);
  await gcsSet(`pidx/${profile.referralCode}.json`, { profileHash: profile.profileHash });
}

export async function getProfile(hash: string): Promise<StoredProfile | null> {
  return gcsGet<StoredProfile>(`profiles/${hash}.json`);
}

export async function getProfileByReferralCode(code: string): Promise<StoredProfile | null> {
  const idx = await gcsGetIdx<{ profileHash: string }>(`pidx/${code}.json`);
  if (!idx) return null;
  return getProfile(idx.profileHash);
}

export async function updateProfileIntake(
  hash: string,
  intake: Omit<ProfileIntake, "updatedAt">,
): Promise<StoredProfile | null> {
  const existing = await getProfile(hash);
  if (!existing) return null;
  const updated: StoredProfile = {
    ...existing,
    intake: { ...intake, updatedAt: Date.now() },
    segment: deriveSegment(intake.careerStage),
  };
  await gcsSetWithTTL(`profiles/${updated.profileHash}.json`, updated, PROFILE_TTL);
  return updated;
}