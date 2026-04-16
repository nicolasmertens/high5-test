import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const key = (process.env.STRIPE_SECRET_KEY || "").trim();
  const keyPresent = key.length > 0;
  const keyPrefix = key ? key.substring(0, 3) + "..." : "MISSING";
  const keyLength = key.length;

  const priceIds = {
    STRIPE_PRICE_ID: !!(process.env.STRIPE_PRICE_ID || "").trim(),
    STRIPE_PRICE_ID_FULL_PROFILE: !!(process.env.STRIPE_PRICE_ID_FULL_PROFILE || "").trim(),
    STRIPE_PRICE_ID_AI_PLAYBOOK: !!(process.env.STRIPE_PRICE_ID_AI_PLAYBOOK || "").trim(),
    STRIPE_PRICE_ID_TEAM_MONTHLY: !!(process.env.STRIPE_PRICE_ID_TEAM_MONTHLY || "").trim(),
    STRIPE_WEBHOOK_SECRET: !!(process.env.STRIPE_WEBHOOK_SECRET || "").trim(),
  };

  let stripeTest = "not_tested";
  if (keyPresent) {
    try {
      const stripe = new Stripe(key, {
        apiVersion: "2026-03-25.dahlia",
        httpClient: Stripe.createFetchHttpClient(),
      });
      const products = await stripe.products.list({ limit: 1 });
      stripeTest = `ok (${products.data.length} product(s) accessible)`;
    } catch (err: any) {
      stripeTest = `error: ${err.type} - ${err.message}`;
    }
  }

  return res.status(200).json({
    keyPresent,
    keyPrefix,
    keyLength,
    priceIds,
    stripeTest,
  });
}