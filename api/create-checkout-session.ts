import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

const trim = (v: string | undefined) => (v || "").trim();

const stripe = new Stripe(trim(process.env.STRIPE_SECRET_KEY || ""), {
  apiVersion: "2026-03-25.dahlia",
  httpClient: Stripe.createFetchHttpClient(),
});

const TIER_CONFIG: Record<string, { priceId: string; mode: "payment" | "subscription" }> = {
  full_profile: {
    priceId: trim(process.env.STRIPE_PRICE_ID_FULL_PROFILE) || trim(process.env.STRIPE_PRICE_ID) || "",
    mode: "payment",
  },
  ai_playbook: {
    priceId: trim(process.env.STRIPE_PRICE_ID_AI_PLAYBOOK) || "",
    mode: "payment",
  },
  team_monthly: {
    priceId: trim(process.env.STRIPE_PRICE_ID_TEAM_MONTHLY) || "",
    mode: "subscription",
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.STRIPE_SECRET_KEY?.trim()) {
    return res.status(500).json({ error: "Server misconfiguration: missing Stripe key" });
  }

  try {
    const { tier = "full_profile" } = req.body || {};
    const config = TIER_CONFIG[tier];

    if (!config || !config.priceId) {
      return res.status(400).json({ error: `Unknown or unconfigured tier: ${tier}. Available: ${Object.keys(TIER_CONFIG).join(", ")}. priceId: ${config?.priceId || "MISSING"}` });
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
    console.error("Stripe checkout error:", err?.type, err?.message, err?.stack);
    const detail = err?.raw?.message || err?.message || "Checkout failed";
    const errType = err?.type || "unknown";
    return res.status(500).json({ error: detail, errorType: errType });
  }
}