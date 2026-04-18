import type { VercelRequest, VercelResponse } from "@vercel/node";
import { gcsDelete } from "../lib/gcs-storage.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const profileHash = req.body?.profileHash as string | undefined;
  if (!profileHash || profileHash.length < 4) {
    return res.status(400).json({ error: "Missing profileHash" });
  }

  await gcsDelete(`linkedin/${profileHash}.json`);
  return res.status(200).json({ disconnected: true });
}
