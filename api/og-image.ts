import type { VercelRequest, VercelResponse } from "@vercel/node";
import sharp from "sharp";

const DOMAIN_COLORS: Record<string, string> = {
  doing: "#f59e0b",
  thinking: "#6366f1",
  feeling: "#ec4899",
  motivating: "#10b981",
};

type OgSegment = "university" | "early_career" | "plateaued" | "midlife" | "late_career" | "solopreneur";

const SEGMENT_SUBTITLES: Record<OgSegment, string> = {
  university: "Your career starts here",
  early_career: "Find your edge",
  plateaued: "Close your leadership gap",
  midlife: "What's next for you?",
  late_career: "Your next chapter starts here",
  solopreneur: "Know your blind spots",
};

const SEGMENT_CTAS: Record<OgSegment, string> = {
  university: "Start your career right \u2014 1test.me",
  early_career: "Find your edge \u2014 1test.me",
  plateaued: "Discover your leadership gap \u2014 1test.me",
  midlife: "Find what\u2019s next \u2014 1test.me",
  late_career: "Start your next chapter \u2014 1test.me",
  solopreneur: "Know your blind spots \u2014 1test.me",
};

interface OgParams {
  personalityType: string;
  discStyle: string;
  enneagramWing: string;
  topStrength: string;
  strengthDomain: string;
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
  const { personalityType, discStyle, enneagramWing, topStrength, strengthDomain, isPaid, segment } = params;
  const subtitle = segment ? SEGMENT_SUBTITLES[segment] : null;
  const footerCta = segment
    ? SEGMENT_CTAS[segment]
    : isPaid
      ? "Discover your strengths \u2014 1test.me"
      : "Take the free test \u2014 1test.me";
  const escapedSubtitle = subtitle ? escapeXml(subtitle) : null;
  const domainColor = DOMAIN_COLORS[strengthDomain] || "#f59e0b";
  const escapedType = escapeXml(personalityType);
  const escapedDisc = escapeXml(discStyle);
  const escapedEnneagram = escapeXml(enneagramWing);
  const escapedStrength = escapeXml(topStrength);

  let frameworkSection: string;

  if (isPaid) {
    frameworkSection = `
      <text x="600" y="380" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="72" font-weight="700" fill="white" letter-spacing="-2">${escapedType}</text>
      <g transform="translate(260, 420)">
        <rect x="0" y="0" width="160" height="60" rx="12" fill="rgba(255,255,255,0.08)" />
        <text x="80" y="22" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#9ca3af" letter-spacing="0.5">DISC</text>
        <text x="80" y="48" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="22" fill="white" font-weight="700">${escapedDisc || "\u2014"}</text>
      </g>
      <g transform="translate(440, 420)">
        <rect x="0" y="0" width="160" height="60" rx="12" fill="rgba(255,255,255,0.08)" />
        <text x="80" y="22" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#9ca3af" letter-spacing="0.5">ENNEAGRAM</text>
        <text x="80" y="48" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="22" fill="white" font-weight="700">${escapedEnneagram || "\u2014"}</text>
      </g>
      <g transform="translate(620, 420)">
        <rect x="0" y="0" width="160" height="60" rx="12" fill="rgba(255,255,255,0.08)" />
        <text x="80" y="22" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#9ca3af" letter-spacing="0.5">TOP STRENGTH</text>
        <text x="80" y="48" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="22" fill="${domainColor}" font-weight="700">${escapedStrength}</text>
      </g>`;
  } else {
    frameworkSection = `
      <text x="600" y="390" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="80" font-weight="700" fill="white" letter-spacing="-2">${escapedType}</text>
      <g transform="translate(420, 430)">
        <rect x="0" y="0" width="360" height="70" rx="12" fill="rgba(255,255,255,0.08)" />
        <text x="180" y="28" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#9ca3af" letter-spacing="0.5">#1 STRENGTH</text>
        <text x="180" y="56" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="26" fill="${domainColor}" font-weight="700">${escapedStrength}</text>
      </g>`;
  }

  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#111827"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Header -->
  <g transform="translate(64, 32)">
    <rect x="0" y="0" width="40" height="40" rx="8" fill="url(#logo-grad)"/>
    <defs>
      <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#7c3aed"/>
        <stop offset="100%" stop-color="#6366f1"/>
      </linearGradient>
    </defs>
    <text x="13" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" fill="white">1T</text>
  </g>
  <text x="124" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="white" letter-spacing="-0.4">1Test</text>
  <text x="1136" y="60" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#9ca3af">One Test. Four Frameworks.</text>

  <!-- Profile -->
  ${frameworkSection}
  ${escapedSubtitle ? `<text x="600" y="510" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-style="italic" fill="#9ca3af">${escapedSubtitle}</text>` : ""}

  <!-- Footer -->
  <text x="600" y="598" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#6b7280">${escapeXml(footerCta)}</text>
</svg>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { type, disc, enneagram, strength, domain, paid, segment } = req.query;

  if (!type || !strength) {
    return res.status(400).json({ error: "Missing required params: type, strength" });
  }

  const validSegments: OgSegment[] = ["university", "early_career", "plateaued", "midlife", "late_career", "solopreneur"];
  const segmentValue = typeof segment === "string" && validSegments.includes(segment as OgSegment)
    ? (segment as OgSegment)
    : null;

  const params: OgParams = {
    personalityType: String(type),
    discStyle: String(disc || ""),
    enneagramWing: String(enneagram || ""),
    topStrength: String(strength),
    strengthDomain: String(domain || "doing"),
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