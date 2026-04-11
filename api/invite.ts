import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createInvite, getInviteByReferralCode, getInvitesByProfile, completeInvite } from "./lib/invite-storage";
import { getProfile, getProfileByReferralCode } from "./lib/profile-storage";
import { postHogTrack } from "./lib/send";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    return handleCreateInvite(req, res);
  }

  if (req.method === "GET") {
    const { ref, profile } = req.query;

    if (ref && typeof ref === "string") {
      return handleGetByReferralCode(ref, res);
    }

    if (profile && typeof profile === "string") {
      return handleGetByProfile(profile, res);
    }

    return res.status(400).json({ error: "Provide ref or profile query parameter" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

async function handleCreateInvite(req: VercelRequest, res: VercelResponse) {
  try {
    const { inviterProfileHash, inviterName, inviteeEmail } = req.body;

    if (!inviterProfileHash || !inviterName || !inviteeEmail) {
      return res.status(400).json({ error: "Missing required fields: inviterProfileHash, inviterName, inviteeEmail" });
    }

    const inviterProfile = await getProfile(inviterProfileHash);
    if (!inviterProfile) {
      return res.status(404).json({ error: "Inviter profile not found" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteeEmail)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    const { invite, existingCount } = await createInvite({
      inviterProfileHash,
      inviterName,
      inviteeEmail,
    });

    postHogTrack("invite_sent", {
      channel: "email",
      invite_count: existingCount + 1,
      referral_code: invite.referralCode,
      inviter_profile_hash: inviterProfileHash,
    }).catch(() => {});

    return res.status(201).json({
      id: invite.id,
      referralCode: invite.referralCode,
      inviteeEmail: invite.inviteeEmail,
      status: invite.status,
      expiresAt: invite.expiresAt,
      existingCount: existingCount + 1,
    });
  } catch (err: any) {
    console.error("Create invite error:", err);
    return res.status(500).json({ error: err.message || "Failed to create invite" });
  }
}

async function handleGetByReferralCode(ref: string, res: VercelResponse) {
  try {
    const invite = await getInviteByReferralCode(ref);
    if (!invite) {
      return res.status(404).json({ error: "Invite not found" });
    }

    if (invite.status === "expired" || invite.expiresAt < Date.now()) {
      return res.status(410).json({ error: "Invite has expired" });
    }

    const inviterProfile = await getProfile(invite.inviterProfileHash);

    postHogTrack("invite_viewed", {
      referral_code: ref,
      inviter_profile_hash: invite.inviterProfileHash,
    }).catch(() => {});

    return res.status(200).json({
      id: invite.id,
      referralCode: invite.referralCode,
      inviterName: invite.inviterName,
      inviterPersonalityType: inviterProfile?.personalityType ?? null,
      inviterDiscStyle: inviterProfile?.discStyle ?? null,
      inviterTopStrength: inviterProfile?.topStrengths?.[0] ?? null,
      status: invite.status,
      expiresAt: invite.expiresAt,
    });
  } catch (err: any) {
    console.error("Get invite by ref error:", err);
    return res.status(500).json({ error: err.message || "Failed to get invite" });
  }
}

async function handleGetByProfile(profileHash: string, res: VercelResponse) {
  try {
    const invites = await getInvitesByProfile(profileHash);
    return res.status(200).json({ invites });
  } catch (err: any) {
    console.error("Get invites by profile error:", err);
    return res.status(500).json({ error: err.message || "Failed to get invites" });
  }
}