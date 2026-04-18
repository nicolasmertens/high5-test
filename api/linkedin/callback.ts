import type { VercelRequest, VercelResponse } from "@vercel/node";
import { gcsSet } from "../lib/gcs-storage.js";

const SITE_URL = process.env.SITE_URL || "https://1test.me";
const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID!;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET!;
const REDIRECT_URI = `${SITE_URL}/api/linkedin/callback`;

export interface LinkedInProfile {
  linkedInId: string;
  name: string;
  email: string | null;
  headline: string | null;
  pictureUrl: string | null;
  connectedAt: number;
}

// LinkedIn v2 returns pre-resolved localized strings via `localized*` fields.
// The complex `{ localized: {...}, preferredLocale: {...} }` shape is the older format —
// handle both defensively.
function extractHeadline(meData: Record<string, unknown>): string | null {
  // Preferred: pre-resolved string
  if (typeof meData.localizedHeadline === "string") return meData.localizedHeadline || null;
  // Fallback: complex localized object
  const h = meData.headline;
  if (!h || typeof h !== "object") return null;
  const hObj = h as Record<string, unknown>;
  const localized = hObj.localized as Record<string, string> | undefined;
  if (!localized) return null;
  const preferred = hObj.preferredLocale as { country: string; language: string } | undefined;
  if (preferred) {
    const val = localized[`${preferred.language}_${preferred.country}`];
    if (val) return val;
  }
  return Object.values(localized)[0] ?? null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { code, state, error } = req.query as Record<string, string>;

  if (error) {
    console.error("LinkedIn OAuth error:", error);
    return res.redirect(`${SITE_URL}/?linkedin_error=${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    return res.status(400).json({ error: "Missing code or state" });
  }

  let profileHash: string;
  try {
    profileHash = Buffer.from(state, "base64url").toString("utf8");
    if (!profileHash || profileHash.length < 4) throw new Error("invalid");
  } catch {
    return res.status(400).json({ error: "Invalid state" });
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenRes.ok) {
      const body = await tokenRes.text();
      console.error("Token exchange failed:", body);
      return res.redirect(`${SITE_URL}/?linkedin_error=token_exchange`);
    }

    const { access_token: accessToken } = (await tokenRes.json()) as { access_token: string };

    // Fetch OIDC userinfo (name, email, picture) + basic profile (headline)
    const [userInfoRes, meRes] = await Promise.all([
      fetch("https://api.linkedin.com/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      fetch(
        "https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,localizedHeadline,headline)",
        { headers: { Authorization: `Bearer ${accessToken}` } },
      ),
    ]);

    const userInfo = userInfoRes.ok
      ? ((await userInfoRes.json()) as {
          sub: string;
          name?: string;
          email?: string;
          picture?: string;
        })
      : null;

    const meData = meRes.ok
      ? ((await meRes.json()) as Record<string, unknown>)
      : null;

    // Build display name: prefer OIDC name, fall back to localized first+last from /me
    const displayName =
      userInfo?.name ||
      [meData?.localizedFirstName, meData?.localizedLastName].filter(Boolean).join(" ") ||
      "";

    const profile: LinkedInProfile = {
      linkedInId: userInfo?.sub ?? (meData?.id as string) ?? "",
      name: displayName,
      email: userInfo?.email ?? null,
      headline: meData ? extractHeadline(meData) : null,
      pictureUrl: userInfo?.picture ?? null,
      connectedAt: Date.now(),
    };

    await gcsSet(`linkedin/${profileHash}.json`, profile);

    return res.redirect(`${SITE_URL}/?linkedin_connected=true`);
  } catch (err: unknown) {
    console.error("LinkedIn callback error:", err);
    return res.redirect(`${SITE_URL}/?linkedin_error=server`);
  }
}
