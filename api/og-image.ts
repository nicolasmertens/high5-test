import type { VercelRequest, VercelResponse } from "@vercel/node";
import sharp from "sharp";

const DOMAIN_COLORS: Record<string, string> = {
  doing: "#f59e0b",
  thinking: "#6366f1",
  feeling: "#ec4899",
  motivating: "#10b981",
};

const DOMAIN_LABELS: Record<string, string> = {
  doing: "DOING",
  thinking: "THINKING",
  feeling: "FEELING",
  motivating: "MOTIVATING",
};

type OgSegment = "university" | "early_career" | "plateaued" | "midlife" | "late_career" | "solopreneur";

const SEGMENT_CTAS: Record<OgSegment, string> = {
  university: "Start your career right — 1test.me",
  early_career: "Find your edge — 1test.me",
  plateaued: "Discover your leadership gap — 1test.me",
  midlife: "Find what's next — 1test.me",
  late_career: "Start your next chapter — 1test.me",
  solopreneur: "Know your blind spots — 1test.me",
};

interface StrengthEntry {
  name: string;
  domain: string;
}

interface OgParams {
  personalityType: string;
  discStyle: string;
  enneagramWing: string;
  strengths: StrengthEntry[];
  isPaid: boolean;
  segment?: OgSegment | null;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildSvg(params: OgParams): string {
  const { personalityType, discStyle, enneagramWing, strengths, isPaid, segment } = params;

  const footerCta = segment
    ? SEGMENT_CTAS[segment]
    : isPaid
      ? "See your full profile — 1test.me"
      : "Take the free test — 1test.me";

  // Layout constants
  const leftX = 60;
  const rightX = 660;
  const dividerX = 630;
  const strengthStartY = 162;
  const strengthGap = 60;

  // Render up to 5 strength rows
  const strengthRows = strengths.slice(0, 5).map((s, i) => {
    const y = strengthStartY + i * strengthGap;
    const color = DOMAIN_COLORS[s.domain] || "#f59e0b";
    const domainLabel = escapeXml(DOMAIN_LABELS[s.domain] || s.domain.toUpperCase());
    const escapedName = escapeXml(s.name);
    return `
      <text x="${leftX}" y="${y}" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" fill="${color}">#${i + 1}</text>
      <text x="${leftX + 34}" y="${y}" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="600" fill="#f8fafc">${escapedName}</text>
      <rect x="${leftX + 34}" y="${y + 8}" width="${domainLabel.length * 7 + 16}" height="18" rx="9" fill="${color}22"/>
      <text x="${leftX + 34 + (domainLabel.length * 7 + 16) / 2}" y="${y + 21}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="600" fill="${color}">${domainLabel}</text>`;
  }).join("");

  const escapedType = escapeXml(personalityType || "—");
  const escapedDisc = escapeXml(discStyle || "—");
  const escapedEnneagram = escapeXml(enneagramWing || "—");

  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#111827"/>
    </linearGradient>
    <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Header -->
  <rect x="${leftX}" y="22" width="40" height="40" rx="8" fill="url(#logo-grad)"/>
  <text x="${leftX + 12}" y="49" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" fill="white">1T</text>
  <text x="${leftX + 52}" y="50" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="700" fill="white" letter-spacing="-0.4">1Test</text>
  <text x="1140" y="50" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="#4b5563">1test.me</text>

  <!-- Header divider -->
  <line x1="${leftX}" y1="78" x2="1140" y2="78" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>

  <!-- LEFT COLUMN: Top 5 Strengths -->
  <text x="${leftX}" y="112" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#6b7280" letter-spacing="1.5">YOUR TOP 5 STRENGTHS</text>
  ${strengthRows}

  <!-- Vertical divider -->
  <line x1="${dividerX}" y1="90" x2="${dividerX}" y2="540" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>

  <!-- RIGHT COLUMN: Personality Profile -->
  <text x="${rightX}" y="112" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#6b7280" letter-spacing="1.5">PERSONALITY PROFILE</text>

  <!-- 16P Type (big) -->
  <text x="${rightX + 240}" y="220" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="76" font-weight="800" fill="white" letter-spacing="-3">${escapedType}</text>
  <text x="${rightX + 240}" y="252" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#9ca3af">16 Personalities</text>

  <!-- DISC badge -->
  <rect x="${rightX}" y="278" width="228" height="80" rx="12" fill="rgba(255,255,255,0.05)"/>
  <text x="${rightX + 114}" y="302" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#6b7280" letter-spacing="1">DISC</text>
  <text x="${rightX + 114}" y="342" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="34" fill="white" font-weight="700">${escapedDisc}</text>

  <!-- Enneagram badge -->
  <rect x="${rightX + 252}" y="278" width="228" height="80" rx="12" fill="rgba(255,255,255,0.05)"/>
  <text x="${rightX + 252 + 114}" y="302" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#6b7280" letter-spacing="1">ENNEAGRAM</text>
  <text x="${rightX + 252 + 114}" y="342" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="34" fill="white" font-weight="700">${escapedEnneagram}</text>

  <!-- Footer divider -->
  <line x1="${leftX}" y1="556" x2="1140" y2="556" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>

  <!-- Footer CTA -->
  <text x="600" y="598" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#6b7280">${escapeXml(footerCta)}</text>
</svg>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { type, disc, enneagram, strength, domain, strengths, domains, paid, segment } = req.query;

  if (!type) {
    return res.status(400).json({ error: "Missing required param: type" });
  }

  // Parse top 5 strengths — prefer comma-separated `strengths`/`domains`, fall back to single `strength`/`domain`
  let strengthEntries: StrengthEntry[] = [];
  if (typeof strengths === "string" && strengths) {
    const names = strengths.split(",").map((s) => s.trim()).filter(Boolean);
    const domainList = typeof domains === "string" ? domains.split(",").map((d) => d.trim()) : [];
    strengthEntries = names.map((name, i) => ({
      name,
      domain: domainList[i] || "doing",
    }));
  } else if (typeof strength === "string" && strength) {
    strengthEntries = [{ name: strength, domain: typeof domain === "string" ? domain : "doing" }];
  }

  if (strengthEntries.length === 0) {
    return res.status(400).json({ error: "Missing required param: strengths or strength" });
  }

  const validSegments: OgSegment[] = ["university", "early_career", "plateaued", "midlife", "late_career", "solopreneur"];
  const segmentValue = typeof segment === "string" && validSegments.includes(segment as OgSegment)
    ? (segment as OgSegment)
    : null;

  const params: OgParams = {
    personalityType: String(type),
    discStyle: String(disc || ""),
    enneagramWing: String(enneagram || ""),
    strengths: strengthEntries,
    isPaid: paid === "1" || paid === "true",
    segment: segmentValue,
  };

  try {
    const svg = buildSvg(params);
    const pngBuffer = await sharp(Buffer.from(svg))
      .png()
      .toBuffer();

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).send(pngBuffer);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("OG image generation error:", message);
    return res.status(500).json({ error: "Failed to generate image", details: message });
  }
}
