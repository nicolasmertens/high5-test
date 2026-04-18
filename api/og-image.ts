import type { VercelRequest, VercelResponse } from "@vercel/node";
import sharp from "sharp";

const DOMAIN_COLORS: Record<string, string> = {
  doing: "#f59e0b",
  thinking: "#8b5cf6",
  feeling: "#ef4444",
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
      <text x="${leftX}" y="${y}" font-family="Plus Jakarta Sans, system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" fill="${color}">#${i + 1}</text>
      <text x="${leftX + 34}" y="${y}" font-family="Plus Jakarta Sans, system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#1c1106">${escapedName}</text>
      <rect x="${leftX + 34}" y="${y + 8}" width="${domainLabel.length * 7 + 16}" height="18" rx="9" fill="${color}1a"/>
      <text x="${leftX + 34 + (domainLabel.length * 7 + 16) / 2}" y="${y + 21}" text-anchor="middle" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="10" font-weight="700" fill="${color}">${domainLabel}</text>`;
  }).join("");

  const escapedType = escapeXml(personalityType || "—");
  const escapedDisc = escapeXml(discStyle || "—");
  const escapedEnneagram = escapeXml(enneagramWing || "—");

  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fef9f0"/>
      <stop offset="100%" stop-color="#fdfbf6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Header: four-dot Compass mark + wordmark -->
  <g transform="translate(${leftX}, 28)">
    <circle cx="8" cy="8" r="8" fill="#f59e0b"/>
    <circle cx="28" cy="8" r="8" fill="#8b5cf6"/>
    <circle cx="8" cy="28" r="8" fill="#ef4444"/>
    <circle cx="28" cy="28" r="8" fill="#10b981"/>
  </g>
  <text x="${leftX + 52}" y="54" font-family="Plus Jakarta Sans, system-ui, -apple-system, sans-serif" font-size="24" font-weight="800" fill="#1c1106" letter-spacing="-0.4">1Test</text>
  <text x="1140" y="54" text-anchor="end" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="13" fill="#a08e70">1test.me</text>

  <!-- Header divider -->
  <line x1="${leftX}" y1="86" x2="1140" y2="86" stroke="#ece1c8" stroke-width="1"/>

  <!-- LEFT COLUMN: Top 5 Strengths -->
  <text x="${leftX}" y="120" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" fill="#a08e70" letter-spacing="1.5">YOUR TOP 5 STRENGTHS</text>
  ${strengthRows}

  <!-- Vertical divider -->
  <line x1="${dividerX}" y1="98" x2="${dividerX}" y2="548" stroke="#ece1c8" stroke-width="1"/>

  <!-- RIGHT COLUMN: Personality Profile -->
  <text x="${rightX}" y="120" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" fill="#a08e70" letter-spacing="1.5">PERSONALITY PROFILE</text>

  <!-- 16P Type (big) -->
  <text x="${rightX + 240}" y="228" text-anchor="middle" font-family="Plus Jakarta Sans, system-ui, -apple-system, sans-serif" font-size="76" font-weight="800" fill="#1c1106" letter-spacing="-3">${escapedType}</text>
  <text x="${rightX + 240}" y="260" text-anchor="middle" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="14" fill="#78624a">16 Personalities</text>

  <!-- DISC badge -->
  <rect x="${rightX}" y="286" width="228" height="80" rx="12" fill="#ffffff" stroke="#f0e6d0" stroke-width="1"/>
  <text x="${rightX + 114}" y="310" text-anchor="middle" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" fill="#a08e70" letter-spacing="1">DISC</text>
  <text x="${rightX + 114}" y="350" text-anchor="middle" font-family="Plus Jakarta Sans, system-ui, -apple-system, sans-serif" font-size="34" fill="#1c1106" font-weight="800">${escapedDisc}</text>

  <!-- Enneagram badge -->
  <rect x="${rightX + 252}" y="286" width="228" height="80" rx="12" fill="#ffffff" stroke="#f0e6d0" stroke-width="1"/>
  <text x="${rightX + 252 + 114}" y="310" text-anchor="middle" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" fill="#a08e70" letter-spacing="1">ENNEAGRAM</text>
  <text x="${rightX + 252 + 114}" y="350" text-anchor="middle" font-family="Plus Jakarta Sans, system-ui, -apple-system, sans-serif" font-size="34" fill="#1c1106" font-weight="800">${escapedEnneagram}</text>

  <!-- Footer divider -->
  <line x1="${leftX}" y1="562" x2="1140" y2="562" stroke="#ece1c8" stroke-width="1"/>

  <!-- Footer CTA -->
  <text x="600" y="602" text-anchor="middle" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" fill="#d97706">${escapeXml(footerCta)}</text>
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
