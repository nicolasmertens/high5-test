import { Redis } from "@upstash/redis";
import type { StoredProfile } from "./profile-storage";

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

const INVITE_PREFIX = "invite:";
const INVITE_BY_REF_PREFIX = "invref:";
const INVITE_BY_PROFILE_PREFIX = "invprof:";
const INVITE_EXPIRY_SECONDS = 7 * 24 * 60 * 60;

export interface Invite {
  id: string;
  inviterProfileHash: string;
  inviterName: string;
  inviteeEmail: string;
  inviteeProfileHash: string | null;
  referralCode: string;
  status: "pending" | "completed" | "expired";
  createdAt: number;
  completedAt: number | null;
  expiresAt: number;
}

function inviteKey(id: string): string {
  return `${INVITE_PREFIX}${id}`;
}

function inviteByRefKey(code: string): string {
  return `${INVITE_BY_REF_PREFIX}${code}`;
}

function inviteByProfileKey(hash: string, idx: number): string {
  return `${INVITE_BY_PROFILE_PREFIX}${hash}:${idx}`;
}

export async function createInvite(data: {
  inviterProfileHash: string;
  inviterName: string;
  inviteeEmail: string;
}): Promise<{ invite: Invite; existingCount: number }> {
  const kv = getRedis();

  const existingIds = await getInviteIdsByProfile(kv, data.inviterProfileHash);
  const existingInvites: Invite[] = [];
  for (const id of existingIds) {
    const inv = await getInvite(id);
    if (inv) existingInvites.push(inv);
  }

  const existingCount = existingInvites.filter((i) => i.status !== "expired").length;

  const id = crypto.randomUUID();
  const referralCode = generateReferralCode();
  const now = Date.now();

  const invite: Invite = {
    id,
    inviterProfileHash: data.inviterProfileHash,
    inviterName: data.inviterName,
    inviteeEmail: data.inviteeEmail.toLowerCase().trim(),
    inviteeProfileHash: null,
    referralCode,
    status: "pending",
    createdAt: now,
    completedAt: null,
    expiresAt: now + INVITE_EXPIRY_SECONDS * 1000,
  };

  await kv.set(inviteKey(id), JSON.stringify(invite));
  await kv.set(inviteByRefKey(referralCode), id);
  await kv.set(inviteByProfileKey(data.inviterProfileHash, existingIds.length), id);
  await kv.expire(inviteKey(id), INVITE_EXPIRY_SECONDS);
  await kv.expire(inviteByRefKey(referralCode), INVITE_EXPIRY_SECONDS);

  return { invite, existingCount };
}

export async function getInvite(id: string): Promise<Invite | null> {
  const kv = getRedis();
  const raw = await kv.get<Record<string, unknown>>(inviteKey(id));
  if (!raw) return null;
  return raw as unknown as Invite;
}

export async function getInviteByReferralCode(code: string): Promise<Invite | null> {
  const kv = getRedis();
  const id = await kv.get<string>(inviteByRefKey(code));
  if (!id) return null;
  return getInvite(id as string);
}

export async function getInvitesByProfile(profileHash: string): Promise<Invite[]> {
  const kv = getRedis();
  const ids = await getInviteIdsByProfile(kv, profileHash);
  const invites: Invite[] = [];
  for (const id of ids) {
    const inv = await getInvite(id);
    if (inv) invites.push(inv);
  }
  return invites;
}

export async function completeInvite(inviteId: string, inviteeProfileHash: string): Promise<Invite | null> {
  const invite = await getInvite(inviteId);
  if (!invite) return null;

  invite.inviteeProfileHash = inviteeProfileHash;
  invite.status = "completed";
  invite.completedAt = Date.now();

  const kv = getRedis();
  await kv.set(inviteKey(invite.id), JSON.stringify(invite));

  return invite;
}

async function getInviteIdsByProfile(kv: Redis, profileHash: string): Promise<string[]> {
  const ids: string[] = [];
  let idx = 0;
  while (true) {
    const id = await kv.get<string>(inviteByProfileKey(profileHash, idx));
    if (!id) break;
    ids.push(id as string);
    idx++;
    if (idx > 20) break;
  }
  return ids;
}

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let code = "";
  const randomValues = new Uint8Array(8);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < 8; i++) {
    code += chars[randomValues[i] % chars.length];
  }
  return code;
}

export function isProfileOwner(profile: StoredProfile, referralCode: string): boolean {
  return profile.referralCode === referralCode;
}