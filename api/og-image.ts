import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ImageResponse } from "@vercel/og";

const DOMAIN_COLORS: Record<string, string> = {
  doing: "#f59e0b",
  thinking: "#6366f1",
  feeling: "#ec4899",
  motivating: "#10b981",
};

interface OgParams {
  personalityType: string;
  discStyle: string;
  enneagramWing: string;
  topStrength: string;
  strengthDomain: string;
  isPaid: boolean;
}

function buildOgElement(params: OgParams) {
  const { personalityType, discStyle, enneagramWing, topStrength, strengthDomain, isPaid } = params;
  const domainColor = DOMAIN_COLORS[strengthDomain] || "#f59e0b";

  const frameworkCards = isPaid
    ? [
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px 24px" },
            children: [
              { type: "div", props: { style: { fontSize: "12px", color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase" as const }, children: "DISC" } },
              { type: "div", props: { style: { fontSize: "24px", color: "#ffffff", fontWeight: 700, marginTop: "4px" }, children: discStyle || "—" } },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px 24px" },
            children: [
              { type: "div", props: { style: { fontSize: "12px", color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase" as const }, children: "Enneagram" } },
              { type: "div", props: { style: { fontSize: "24px", color: "#ffffff", fontWeight: 700, marginTop: "4px" }, children: enneagramWing || "—" } },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px 24px" },
            children: [
              { type: "div", props: { style: { fontSize: "12px", color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase" as const }, children: "Top Strength" } },
              { type: "div", props: { style: { fontSize: "24px", color: domainColor, fontWeight: 700, marginTop: "4px" }, children: topStrength || "—" } },
            ],
          },
        },
      ]
    : [
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px 32px" },
            children: [
              { type: "div", props: { style: { fontSize: "12px", color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase" as const }, children: "#1 Strength" } },
              { type: "div", props: { style: { fontSize: "28px", color: domainColor, fontWeight: 700, marginTop: "4px" }, children: topStrength || "—" } },
            ],
          },
        },
      ];

  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #111827 100%)",
        padding: "48px 64px",
        fontFamily: "Inter",
      },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", justifyContent: "space-between", alignItems: "center" },
            children: [
              {
                type: "div",
                props: {
                  style: { display: "flex", alignItems: "center", gap: "12px" },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: { display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", background: "linear-gradient(135deg, #7c3aed, #6366f1)", borderRadius: "8px", color: "#ffffff", fontSize: "18px", fontWeight: 700 },
                        children: "1T",
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: { fontSize: "20px", color: "#ffffff", fontWeight: 700, letterSpacing: "-0.02em" },
                        children: "1Test",
                      },
                    },
                  ],
                },
              },
              {
                type: "div",
                props: {
                  style: { fontSize: "14px", color: "#9ca3af" },
                  children: "One Test. Four Frameworks.",
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexGrow: 1 },
            children: [
              {
                type: "div",
                props: {
                  style: { fontSize: isPaid ? "72px" : "80px", color: "#ffffff", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1 },
                  children: personalityType || "—",
                },
              },
              {
                type: "div",
                props: {
                  style: { display: "flex", gap: "16px", marginTop: "40px" },
                  children: frameworkCards,
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: { display: "flex", justifyContent: "center" },
            children: [
              {
                type: "div",
                props: {
                  style: { fontSize: "16px", color: "#6b7280" },
                  children: isPaid ? "Discover your strengths \u2014 1test.me" : "Take the free test \u2014 1test.me",
                },
              },
            ],
          },
        },
      ],
    },
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { type, disc, enneagram, strength, domain, paid } = req.query;

  if (!type || !strength) {
    return res.status(400).json({ error: "Missing required params: type, strength" });
  }

  const params: OgParams = {
    personalityType: String(type),
    discStyle: String(disc || ""),
    enneagramWing: String(enneagram || ""),
    topStrength: String(strength),
    strengthDomain: String(domain || "doing"),
    isPaid: paid === "1" || paid === "true",
  };

  try {
    const [boldRes, regularRes] = await Promise.all([
      fetch("https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff2"),
      fetch("https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff2"),
    ]);

    const [boldData, regularData] = await Promise.all([
      boldRes.arrayBuffer(),
      regularRes.arrayBuffer(),
    ]);

    const element = buildOgElement(params);

    const imageResponse = new ImageResponse(element as React.ReactNode, {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: regularData, weight: 400, style: "normal" },
        { name: "Inter", data: boldData, weight: 700, style: "normal" },
      ],
    });

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).send(imageBuffer);
  } catch (err: unknown) {
    console.error("OG image generation error:", err);
    return res.status(500).json({ error: "Failed to generate image" });
  }
}