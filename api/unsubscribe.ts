import type { VercelRequest, VercelResponse } from "@vercel/node";
import { unsubscribeById } from "./lib/subscribers.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const sid = req.query?.sid || req.body?.sid;

  if (!sid || typeof sid !== "string") {
    return res.status(400).json({ error: "Missing subscriber ID" });
  }

  try {
    const success = await unsubscribeById(sid);

    if (success) {
      return res
        .status(200)
        .setHeader("Content-Type", "text/html")
        .send(`<!DOCTYPE html>
<html>
<head><title>Unsubscribed — 1Test</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#f9fafb;">
  <div style="text-align:center;padding:40px;">
    <h1 style="font-size:24px;color:#111827;">You've been unsubscribed</h1>
    <p style="color:#6b7280;font-size:16px;">You will no longer receive emails from 1Test's welcome sequence.</p>
    <a href="https://1test.me" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#111827;color:white;text-decoration:none;border-radius:6px;">Back to 1Test</a>
  </div>
</body>
</html>`);
    } else {
      return res.status(404).json({ error: "Subscriber not found" });
    }
  } catch (err: unknown) {
    console.error("Unsubscribe error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}