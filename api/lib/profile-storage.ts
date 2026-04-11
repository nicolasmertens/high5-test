import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      throw new Error("UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set");
    }
    redis = new Redis({ url, token });
  }
  return redis;
}

const PROFILE_PREFIX = "profile:";
const PROFILE_INDEX_PREFIX = "pidx:";

function profileKey(hash: string): string {
  return `${PROFILE_PREFIX}${hash}`;
}

function profileIndexKey(referralCode: string): string {
  return `${PROFILE_INDEX_PREFIX}${referralCode}`;
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
}

export async function storeProfile(profile: StoredProfile): Promise<void> {
  const kv = getRedis();
  await kv.set(profileKey(profile.profileHash), JSON.stringify(profile));
  await kv.set(profileIndexKey(profile.referralCode), profile.profileHash);
  await kv.expire(profileKey(profile.profileHash), 60 * 60 * 24 * 90);
}

export async function getProfile(hash: string): Promise<StoredProfile | null> {
  const kv = getRedis();
  const raw = await kv.get<Record<string, unknown>>(profileKey(hash));
  if (!raw) return null;
  return raw as unknown as StoredProfile;
}

export async function getProfileByReferralCode(code: string): Promise<StoredProfile | null> {
  const kv = getRedis();
  const hash = await kv.get<string>(profileIndexKey(code));
  if (!hash) return null;
  return getProfile(hash as string);
}