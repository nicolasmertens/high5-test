import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPaymentByEmail } from "../lib/payment-storage.js";
import { getPlaybookStatus } from "../lib/playbook-storage.js";

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

    const status = await getPlaybookStatus(email);

    if (!status) {
      return res.status(200).json({
        status: "not_requested",
        email,
      });
    }

    return res.status(200).json({
      status: status.status,
      email: status.email,
      profileHash: status.profileHash,
      createdAt: status.createdAt,
      completedAt: status.completedAt || null,
      error: status.error || null,
    });
  } catch (err: any) {
    console.error("Playbook status error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Status check failed" });
  }
}