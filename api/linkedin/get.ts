import type { VercelRequest, VercelResponse } from "@vercel/node";
import { gcsGet } from "../lib/gcs-storage.js";
import type { LinkedInProfile } from "./callback.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const profileHash = req.query.profileHash as string;
  if (!profileHash || profileHash.length < 4) {
    return res.status(400).json({ error: "Missing profileHash" });
  }

  const profile = await gcsGet<LinkedInProfile>(`linkedin/${profileHash}.json`);
  if (!profile) {
    return res.status(404).json({ connected: false });
  }

  return res.status(200).json({
    connected: true,
    name: profile.name,
    email: profile.email,
    headline: profile.headline,
    pictureUrl: profile.pictureUrl,
    connectedAt: profile.connectedAt,
  });
}
