import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPaymentByEmail } from "./lib/payment-storage.js";
import Stripe from "stripe";

const trim = (v: string | undefined) => (v || "").trim();

const stripe = new Stripe(trim(process.env.STRIPE_SECRET_KEY), {
  apiVersion: "2026-03-25.dahlia",
  httpClient: Stripe.createFetchHttpClient(),
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const email = (req.query.email as string)?.trim().toLowerCase();
    const sessionId = (req.query.session_id as string)?.trim();

    if (email) {
      const payment = await getPaymentByEmail(email);
      if (payment) {
        return res.status(200).json({
          paid: true,
          email: payment.email,
          tier: payment.tier,
          sessionId: payment.sessionId,
        });
      }
    }

    if (sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid") {
        return res.status(200).json({
          paid: true,
          email: session.customer_details?.email || null,
          tier: session.metadata?.tier || "full_profile",
          sessionId: session.id,
        });
      }
      return res.status(200).json({ paid: false, email: null, tier: null });
    }

    return res
      .status(400)
      .json({ error: "Missing email or session_id parameter" });
  } catch (err: any) {
    console.error("Payment verification error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Verification failed" });
  }
}
