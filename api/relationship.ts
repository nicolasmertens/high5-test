import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getProfile } from "./lib/profile-storage.js";
import { getReport, getReportsByProfile, storeReport } from "./lib/relationship-storage.js";
import { generateRelationshipReport } from "./lib/compatibility.js";
import { getInviteByReferralCode, completeInvite } from "./lib/invite-storage.js";
import { postHogTrack, sendReportReadyEmail } from "./lib/send.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    return handleCreateReport(req, res);
  }

  if (req.method === "GET") {
    const { profile, id } = req.query;

    if (id && typeof id === "string") {
      return handleGetReport(id, res);
    }

    if (profile && typeof profile === "string") {
      return handleGetReportsByProfile(profile, res);
    }

    return res.status(400).json({ error: "Provide id or profile query parameter" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

async function handleCreateReport(req: VercelRequest, res: VercelResponse) {
  try {
    const { profileHashA, profileHashB, referralCode } = req.body;

    if (!profileHashA || !profileHashB) {
      return res.status(400).json({ error: "Missing required fields: profileHashA, profileHashB" });
    }

    const profileA = await getProfile(profileHashA);
    const profileB = await getProfile(profileHashB);

    if (!profileA) {
      return res.status(404).json({ error: "Profile A not found" });
    }
    if (!profileB) {
      return res.status(404).json({ error: "Profile B not found" });
    }

    const existingReports = await getReportsByProfile(profileHashA);
    const existing = existingReports.find(
      (r) => (r.profileA === profileHashA && r.profileB === profileHashB)
        || (r.profileA === profileHashB && r.profileB === profileHashA),
    );
    if (existing) {
      return res.status(200).json(existing);
    }

    const reportData = generateRelationshipReport(profileA, profileB);
    const reportId = crypto.randomUUID();
    const report = {
      id: reportId,
      ...reportData,
      createdAt: Date.now(),
    };

    await storeReport(report);

    if (referralCode && typeof referralCode === "string") {
      const invite = await getInviteByReferralCode(referralCode);
      if (invite && invite.status === "pending") {
        await completeInvite(invite.id, profileHashB);

        if (invite.inviterEmail) {
          sendReportReadyEmail({
            inviterName: invite.inviterName,
            inviterEmail: invite.inviterEmail,
            inviteeName: "your colleague",
            reportId,
          }).catch((err) => {
            console.error("Failed to send report ready email (non-blocking):", err);
          });
        }
      }
    }

    postHogTrack("relationship_report_generated", {
      report_id: reportId,
      compatibility_score: report.compatibilityScore,
    }).catch(() => {});

    return res.status(201).json(report);
  } catch (err: any) {
    console.error("Create relationship report error:", err);
    return res.status(500).json({ error: err.message || "Failed to create report" });
  }
}

async function handleGetReport(id: string, res: VercelResponse) {
  try {
    const report = await getReport(id);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    postHogTrack("relationship_report_viewed", {
      report_id: id,
    }).catch(() => {});

    return res.status(200).json(report);
  } catch (err: any) {
    console.error("Get report error:", err);
    return res.status(500).json({ error: err.message || "Failed to get report" });
  }
}

async function handleGetReportsByProfile(profileHash: string, res: VercelResponse) {
  try {
    const reports = await getReportsByProfile(profileHash);
    return res.status(200).json({ reports });
  } catch (err: any) {
    console.error("Get reports by profile error:", err);
    return res.status(500).json({ error: err.message || "Failed to get reports" });
  }
}