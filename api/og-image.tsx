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

export default async function handler(request: Request) {
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

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #111827 100%)",
            padding: "48px 64px",
            fontFamily: "Inter",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  background: "linear-gradient(135deg, #7c3aed, #6366f1)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                1T
              </div>
              <div style={{ fontSize: "20px", color: "#ffffff", fontWeight: 700, letterSpacing: "-0.02em" }}>
                1Test
              </div>
            </div>
            <div style={{ fontSize: "14px", color: "#9ca3af" }}>One Test. Four Frameworks.</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexGrow: 1 }}>
            <div
              style={{
                fontSize: isPaid ? "72px" : "80px",
                color: "#ffffff",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              {type}
            </div>

            {isPaid ? (
              <div style={{ display: "flex", gap: "16px", marginTop: "40px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px 24px" }}>
                  <div style={{ fontSize: "12px", color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase" }}>DISC</div>
                  <div style={{ fontSize: "24px", color: "#ffffff", fontWeight: 700, marginTop: "4px" }}>{disc || "—"}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px 24px" }}>
                  <div style={{ fontSize: "12px", color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase" }}>Enneagram</div>
                  <div style={{ fontSize: "24px", color: "#ffffff", fontWeight: 700, marginTop: "4px" }}>{enneagram || "—"}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px 24px" }}>
                  <div style={{ fontSize: "12px", color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase" }}>Top Strength</div>
                  <div style={{ fontSize: "24px", color: domainColor, fontWeight: 700, marginTop: "4px" }}>{strength}</div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px 32px", marginTop: "40px" }}>
                <div style={{ fontSize: "12px", color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase" }}>#1 Strength</div>
                <div style={{ fontSize: "28px", color: domainColor, fontWeight: 700, marginTop: "4px" }}>{strength}</div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ fontSize: "16px", color: "#6b7280" }}>
              {isPaid ? "Discover your strengths — 1test.me" : "Take the free test — 1test.me"}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: "Inter", data: regularData, weight: 400, style: "normal" },
          { name: "Inter", data: boldData, weight: 700, style: "normal" },
        ],
      },
    );
  } catch (err: unknown) {
    console.error("OG image generation error:", err);
    return new Response(JSON.stringify({ error: "Failed to generate image" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}