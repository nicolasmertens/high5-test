import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { getSubscriberByEmail, suppressSubscriber } from "./lib/subscribers.js";
import { postHogTrack } from "./lib/send.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
  httpClient: Stripe.createFetchHttpClient(),
});

async function suppressWelcomeEmails(email: string) {
  try {
    const subscriber = await getSubscriberByEmail(email);
    if (subscriber && !subscriber.suppressed) {
      await suppressSubscriber(subscriber.id);
      await postHogTrack("welcome_sequence_suppressed", {
        distinct_id: email,
        reason: "purchase",
      });
      console.log(`Suppressed welcome emails for ${email}`);
    }
  } catch (err) {
    console.error("Failed to suppress welcome emails:", err);
  }
}

async function sendGA4PurchaseEvent(session: Stripe.Checkout.Session) {
  const measurementId = process.env.VITE_GA4_MEASUREMENT_ID;
  const apiSecret = process.env.GA4_API_SECRET;
  if (!measurementId || !apiSecret) return;

  const clientId = session.metadata?.client_id || `stripe_${session.id}`;
  const email = session.customer_details?.email || "";

  try {
    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId,
          events: [
            {
              name: "purchase",
              params: {
                transaction_id: session.id,
                value: (session.amount_total || 1200) / 100,
                currency: session.currency || "USD",
                items: [
                  {
                    item_id: "full_profile",
                    item_name: "1Test Full Profile",
                    item_category: "personality_assessment",
                    price: (session.amount_total || 1200) / 100,
                    quantity: 1,
                  },
                ],
                framework: "strengths",
                upgrade_type: "full_profile",
                revenue_amount: (session.amount_total || 1200) / 100,
                email_source: email ? "stripe_checkout" : undefined,
              },
            },
          ],
        }),
      }
    );
  } catch (err) {
    console.error("GA4 Measurement Protocol error:", err);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const sig = req.headers["stripe-signature"] as string;

  if (!sig) {
    return res.status(400).json({ error: "Missing signature" });
  }

  try {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    const rawBody = Buffer.concat(chunks).toString("utf8");

    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const tier = session.metadata?.tier || "full_profile";
      console.log("Payment completed:", {
        sessionId: session.id,
        email: session.customer_details?.email,
        amount: session.amount_total,
        tier,
        mode: session.mode,
      });

      await sendGA4PurchaseEvent(session);

      const email = session.customer_details?.email;
      if (email) {
        await suppressWelcomeEmails(email);
      }
    }

    return res.status(200).json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return res.status(400).json({ error: "Webhook signature verification failed" });
  }
}