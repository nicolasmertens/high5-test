import { gcsGet, gcsSet, gcsSetWithTTL, gcsGet as gcsGetIdx } from "./gcs-storage.js";

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