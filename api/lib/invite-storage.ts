import { gcsGet, gcsSetWithTTL, gcsSet, gcsList } from "./gcs-storage.js";
import type { StoredProfile } from "./profile-storage.js";

const INVITE_TTL = 7 * 24 * 60 * 60;

export interface Invite {
  id: string;
  inviterProfileHash: string;
  inviterName: string;
  inviteeEmail: string;
  inviterEmail: string | null;
  inviteeProfileHash: string | null;
  referralCode: string;
  status: "pending" | "completed" | "expired";
  createdAt: number;
  completedAt: number | null;
  expiresAt: number;
}

export async function createInvite(data: {
  inviterProfileHash: string;
  inviterName: string;
  inviteeEmail: string;
  inviterEmail?: string;
}): Promise<{ invite: Invite; existingCount: number }> {
  const existingKeys = await gcsList(`invites/by-profile/${data.inviterProfileHash}/`);
  const existingInvites: Invite[] = [];
  for (const key of existingKeys) {
    const inv = await gcsGet<Invite>(key);
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
    inviterEmail: data.inviterEmail?.toLowerCase().trim() || null,
    inviteeProfileHash: null,
    referralCode,
    status: "pending",
    createdAt: now,
    completedAt: null,
    expiresAt: now + INVITE_TTL * 1000,
  };

  await gcsSetWithTTL(`invites/${id}.json`, invite, INVITE_TTL);
  await gcsSetWithTTL(`invites/by-ref/${referralCode}.json`, { inviteId: id }, INVITE_TTL);
  await gcsSet(`invites/by-profile/${data.inviterProfileHash}/${id}.json`, { inviteId: id });

  return { invite, existingCount };
}

export async function getInvite(id: string): Promise<Invite | null> {
  return gcsGet<Invite>(`invites/${id}.json`);
}

export async function getInviteByReferralCode(code: string): Promise<Invite | null> {
  const ref = await gcsGet<{ inviteId: string }>(`invites/by-ref/${code}.json`);
  if (!ref) return null;
  return getInvite(ref.inviteId);
}

export async function getInvitesByProfile(profileHash: string): Promise<Invite[]> {
  const keys = await gcsList(`invites/by-profile/${profileHash}/`);
  const invites: Invite[] = [];
  for (const key of keys) {
    const idx = await gcsGet<{ inviteId: string }>(key);
    if (idx) {
      const inv = await getInvite(idx.inviteId);
      if (inv) invites.push(inv);
    }
  }
  return invites;
}

export async function completeInvite(inviteId: string, inviteeProfileHash: string): Promise<Invite | null> {
  const invite = await getInvite(inviteId);
  if (!invite) return null;

  invite.inviteeProfileHash = inviteeProfileHash;
  invite.status = "completed";
  invite.completedAt = Date.now();

  await gcsSetWithTTL(`invites/${invite.id}.json`, invite, INVITE_TTL);

  return invite;
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