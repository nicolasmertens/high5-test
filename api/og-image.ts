import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

const DOMAIN_COLORS: Record<string, string> = {
  doing: "#f59e0b",
  thinking: "#6366f1",
  feeling: "#ec4899",
  motivating: "#10b981",
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const disc = searchParams.get("disc") || "";
  const enneagram = searchParams.get("enneagram") || "";
  const strength = searchParams.get("strength");
  const domain = searchParams.get("domain") || "doing";
  const paid = searchParams.get("paid");

  if (!type || !strength) {
    return new Response(JSON.stringify({ error: "Missing required params: type, strength" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const isPaid = paid === "1" || paid === "true";
  const domainColor = DOMAIN_COLORS[domain] || "#f59e0b";

  try {
    const [boldRes, regularRes] = await Promise.all([
      fetch("https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff2"),
      fetch("https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff2"),
    ]);

    const [boldData, regularData] = await Promise.all([
      boldRes.arrayBuffer(),
      regularRes.arrayBuffer(),
    ]);

    const element = {
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
              children: isPaid
                ? [
                    {
                      type: "div",
                      props: {
                        style: { fontSize: "72px", color: "#ffffff", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1 },
                        children: type,
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: { display: "flex", gap: "16px", marginTop: "40px" },
                        children: [
                          {
                            type: "div",
                            props: {
                              style: { display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px 24px" },
                              children: [
                                { type: "div", props: { style: { fontSize: "12px", color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase" }, children: "DISC" } },
                                { type: "div", props: { style: { fontSize: "24px", color: "#ffffff", fontWeight: 700, marginTop: "4px" }, children: disc || "\u2014" } },
                              ],
                            },
                          },
                          {
                            type: "div",
                            props: {
                              style: { display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px 24px" },
                              children: [
                                { type: "div", props: { style: { fontSize: "12px", color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase" }, children: "Enneagram" } },
                                { type: "div", props: { style: { fontSize: "24px", color: "#ffffff", fontWeight: 700, marginTop: "4px" }, children: enneagram || "\u2014" } },
                              ],
                            },
                          },
                          {
                            type: "div",
                            props: {
                              style: { display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px 24px" },
                              children: [
                                { type: "div", props: { style: { fontSize: "12px", color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase" }, children: "Top Strength" } },
                                { type: "div", props: { style: { fontSize: "24px", color: domainColor, fontWeight: 700, marginTop: "4px" }, children: strength } },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ]
                : [
                    {
                      type: "div",
                      props: {
                        style: { fontSize: "80px", color: "#ffffff", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1 },
                        children: type,
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: { display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px 32px", marginTop: "40px" },
                        children: [
                          { type: "div", props: { style: { fontSize: "12px", color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase" }, children: "#1 Strength" } },
                          { type: "div", props: { style: { fontSize: "28px", color: domainColor, fontWeight: 700, marginTop: "4px" }, children: strength } },
                        ],
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

    return new ImageResponse(element as React.ReactNode, {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: regularData, weight: 400, style: "normal" },
        { name: "Inter", data: boldData, weight: 700, style: "normal" },
      ],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("OG image generation error:", message, stack);
    return new Response(JSON.stringify({ error: "Failed to generate image", details: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}