import type { VercelRequest, VercelResponse } from "@vercel/node";
import { storeInboundEmail } from "../lib/inbound-email.js";
import { checkInboundHeaders, logFilteredEmail } from "../lib/inbound-filter.js";
import type { ResendInboundPayload } from "../lib/inbound-types.js";

export const config = {
  maxDuration: 30,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const webhookSecret = process.env.RESEND_INBOUND_WEBHOOK_SECRET;

  if (webhookSecret) {
    const authHeader = req.headers["authorization"];
    if (authHeader !== `Bearer ${webhookSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  const body: ResendInboundPayload = req.body;

  if (!body || !body.from || !body.subject) {
    return res.status(400).json({ error: "Invalid payload: missing required fields" });
  }

  const filterResult = checkInboundHeaders(body);
  if (filterResult.filtered) {
    try {
      await logFilteredEmail(body, filterResult.rule);
    } catch (logErr) {
      console.error("Failed to log filtered email:", logErr);
    }
    return res.status(200).json({
      received: true,
      filtered: true,
      rule: filterResult.rule,
    });
  }

  try {
    const email = await storeInboundEmail({
      resendId: body.id || crypto.randomUUID(),
      from: body.from,
      to: body.to || [],
      subject: body.subject,
      html: body.html || "",
      text: body.text || "",
      replyTo: body.reply_to || [],
      attachments: (body.attachments || []).map((a) => ({
        id: a.id,
        filename: a.filename,
        contentType: a.content_type,
        size: a.size,
      })),
    });

    console.log(`Inbound email classified: id=${email.id} category=${email.category} status=${email.status} autoResponse=${email.autoResponseSent}`);

    return res.status(200).json({
      received: true,
      id: email.id,
      category: email.category,
      status: email.status,
      autoResponseSent: email.autoResponseSent,
    });
  } catch (err: unknown) {
    console.error("Inbound email processing error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    if (message.includes("invalid_grant") || message.includes("GCS credentials incomplete") || message.includes("GCS_BUCKET_NAME")) {
      return res.status(503).json({ error: "Service temporarily unavailable. Please try again." });
    }
    return res.status(500).json({ error: message });
  }
}