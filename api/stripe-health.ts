import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const keyPresent = !!process.env.STRIPE_SECRET_KEY;
  const keyPrefix = process.env.STRIPE_SECRET_KEY
    ? process.env.STRIPE_SECRET_KEY.substring(0, 7)
    : "MISSING";
  const keyLength = process.env.STRIPE_SECRET_KEY?.length || 0;

  const priceIds = {
    STRIPE_PRICE_ID: !!process.env.STRIPE_PRICE_ID,
    STRIPE_PRICE_ID_FULL_PROFILE: !!process.env.STRIPE_PRICE_ID_FULL_PROFILE,
    STRIPE_PRICE_ID_AI_PLAYBOOK: !!process.env.STRIPE_PRICE_ID_AI_PLAYBOOK,
    STRIPE_PRICE_ID_TEAM_MONTHLY: !!process.env.STRIPE_PRICE_ID_TEAM_MONTHLY,
    STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
  };

  let stripeTest = "not_tested";
  if (keyPresent) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2026-03-25.dahlia",
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