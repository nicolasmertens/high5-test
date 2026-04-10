import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["host"] || "1test.me";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${protocol}://${host}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${protocol}://${host}/`,
      automatic_tax: { enabled: true },
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return res.status(500).json({ error: err.message || "Checkout failed" });
  }
}