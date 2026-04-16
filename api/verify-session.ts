import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
  httpClient: Stripe.createFetchHttpClient(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sessionId = req.query.session_id as string;

    if (!sessionId) {
      return res.status(400).json({ error: "Missing session_id" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      return res.status(200).json({
        paid: true,
        email: session.customer_details?.email || null,
        tier: session.metadata?.tier || "full_profile",
      });
    }

    return res.status(200).json({ paid: false, email: null, tier: null });
  } catch (err: any) {
    console.error("Session verification error:", err);
    return res.status(500).json({ error: err.message || "Verification failed" });
  }
}