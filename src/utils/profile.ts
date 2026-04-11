import type { StrengthScore } from "../hooks/useAssessment";

const PROFILE_STORAGE_KEY = "1test-profile-hash";
const REFERRAL_CODE_KEY = "1test-referral-code";
const PROFILE_STORED_KEY = "1test-profile-stored";

export async function generateProfileHash(results: StrengthScore[]): Promise<string> {
  const payload = results
    .map((r) => `${r.strength.id}:${r.score}`)
    .sort()
    .join(",");
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").substring(0, 16);
}

export function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let code = "";
  const randomValues = new Uint8Array(8);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < 8; i++) {
    code += chars[randomValues[i] % chars.length];
  }
  return code;
}

export function getStoredProfileHash(): string | null {
  try {
    return localStorage.getItem(PROFILE_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredProfileHash(hash: string): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, hash);
  } catch {}
}

export function getStoredReferralCode(): string | null {
  try {
    return localStorage.getItem(REFERRAL_CODE_KEY);
  } catch {
    return null;
  }
}

export function setStoredReferralCode(code: string): void {
  try {
    localStorage.setItem(REFERRAL_CODE_KEY, code);
  } catch {}
}

export function isProfileStored(): boolean {
  try {
    return localStorage.getItem(PROFILE_STORED_KEY) === "true";
  } catch {
    return false;
  }
}

export function setProfileStored(): void {
  try {
    localStorage.setItem(PROFILE_STORED_KEY, "true");
  } catch {}
}

export async function storeProfileToServer(
  profileHash: string,
  referralCode: string,
  personalityType: string,
  discStyle: string,
  discPrimary: string,
  discPrimaryScore: number,
  discSecondary: string,
  discSecondaryScore: number,
  enneagramPrimary: number,
  enneagramPrimaryScore: number,
  enneagramWing: string,
  topStrengths: string[],
  strengthScores: Record<string, number>,
): Promise<{ profileHash: string; referralCode: string }> {
  const res = await fetch("/api/store-profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
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
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to store profile");
  }

  return res.json();
}

export function extractStrengthScores(results: StrengthScore[]): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const r of results) {
    scores[r.strength.id] = r.score;
  }
  return scores;
}

export function getInviteRefFromURL(): string | null {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("ref");
  } catch {
    return null;
  }
}

export function setInviteRef(ref: string): void {
  try {
    sessionStorage.setItem("1test-invite-ref", ref);
  } catch {}
}

export function getInviteRef(): string | null {
  try {
    return sessionStorage.getItem("1test-invite-ref");
  } catch {
    return null;
  }
}