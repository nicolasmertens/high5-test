import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPaymentByEmail } from "../lib/payment-storage.js";
import { getPlaybookContent, getPlaybookStatus } from "../lib/playbook-storage.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const email = (req.query.email as string)?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ error: "Missing email parameter" });
    }

    const payment = await getPaymentByEmail(email);
    if (!payment) {
      return res
        .status(403)
        .json({ error: "No purchase found for this email" });
    }

    const validTiers = ["ai_playbook", "full_profile"];
    if (!validTiers.includes(payment.tier)) {
      return res
        .status(403)
        .json({ error: `Purchase tier "${payment.tier}" does not include AI Playbook access.` });
    }

    const content = await getPlaybookContent(email);

    if (!content) {
      const status = await getPlaybookStatus(email);
      return res.status(200).json({
        hasContent: false,
        status: status?.status || "not_requested",
        email,
      });
    }

    return res.status(200).json({
      hasContent: true,
      status: "completed",
      email,
      content,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to retrieve playbook content";
    console.error("Playbook content error:", err);
    return res
      .status(500)
      .json({ error: message });
  }
}