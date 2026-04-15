import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

const TIER_CONFIG: Record<string, { priceId: string; mode: "payment" | "subscription" }> = {
  full_profile: {
    priceId: process.env.STRIPE_PRICE_ID_FULL_PROFILE || process.env.STRIPE_PRICE_ID || "",
    mode: "payment",
  },
  ai_playbook: {
    priceId: process.env.STRIPE_PRICE_ID_AI_PLAYBOOK || "",
    mode: "payment",
  },
  team_monthly: {
    priceId: process.env.STRIPE_PRICE_ID_TEAM_MONTHLY || "",
    mode: "subscription",
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { tier = "full_profile" } = req.body || {};
    const config = TIER_CONFIG[tier];

    if (!config || !config.priceId) {
      return res.status(400).json({ error: `Unknown or unconfigured tier: ${tier}` });
    }

    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["host"] || "1test.me";

    const session = await stripe.checkout.sessions.create({
      mode: config.mode,
      payment_method_types: ["card"],
      line_items: [
        {
          price: config.priceId,
          quantity: 1,
        },
      ],
      success_url: `${protocol}://${host}/thank-you?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`,
      cancel_url: `${protocol}://${host}/`,
      automatic_tax: { enabled: true },
      metadata: { tier },
    });

    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return res.status(500).json({ error: err.message || "Checkout failed" });
  }
}