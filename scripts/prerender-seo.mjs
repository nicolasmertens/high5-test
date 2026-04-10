import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const SEO_DATA = {
  "/free-strengths-test": {
    title: "Free Strengths Test — Discover What You Do Best",
    description:
      "Discover your natural strengths with 1Test's free Strengths assessment. Full results, no paywall. Also get DISC, Enneagram, and 16 Personalities free.",
    canonicalUrl: "https://1test.me/free-strengths-test",
    ogType: "website",
  },
  "/free-disc-test": {
    title: "Free DISC Test — Understand Your Communication Style",
    description:
      "Free DISC test — discover your communication style and how you work with others. Full profile, no paywall. Plus Strengths, Enneagram, and 16 Personalities.",
    canonicalUrl: "https://1test.me/free-disc-test",
    ogType: "website",
  },
  "/free-enneagram-test": {
    title: "Free Enneagram Test — Discover Your Type and Growth Path",
    description:
      "Free Enneagram test — discover your type, wing, and growth directions. Full results, no paywall. Plus DISC, Strengths, and 16 Personalities all free.",
    canonicalUrl: "https://1test.me/free-enneagram-test",
    ogType: "website",
  },
  "/free-personality-test": {
    title: "Free Personality Test — Which of the 16 Types Are You?",
    description:
      "Which of the 16 personality types are you? Take the free test and get your full profile — no paywall. Plus DISC, Enneagram, and Strengths, all from one test.",
    canonicalUrl: "https://1test.me/free-personality-test",
    ogType: "website",
  },
  "/blog/best-free-strengths-assessment": {
    title: "Best Free Strengths Assessment in 2026 — Complete Comparison",
    description:
      "Compare free strengths assessments: 1Test, HIGH5, Truity, VIA. Full results vs paywall, actionable insights, and which test is right for you.",
    canonicalUrl: "https://1test.me/blog/best-free-strengths-assessment",
    ogType: "article",
  },
  "/blog/disc-communication-styles": {
    title: "DISC Communication Styles — Work Better With Every Type",
    description:
      "Learn the four DISC communication styles and how to adapt your approach for Dominance, Influence, Steadiness, and Conscientiousness. Free DISC test included.",
    canonicalUrl: "https://1test.me/blog/disc-communication-styles",
    ogType: "article",
  },
  "/blog/enneagram-career-paths": {
    title: "Enneagram Career Paths — What Your Type Means for Your Work",
    description:
      "Explore career paths for each Enneagram type. Learn which environments energize you, which drain you, and how to use your type for career decisions. Free Enneagram test.",
    canonicalUrl: "https://1test.me/blog/enneagram-career-paths",
    ogType: "article",
  },
  "/blog/personality-test-for-career": {
    title: "Personality Test for Career — Find Work That Fits You",
    description:
      "Learn how your personality type connects to career fit. Practical guidance for every type. Take the free personality test with career insights.",
    canonicalUrl: "https://1test.me/blog/personality-test-for-career",
    ogType: "article",
  },
};

const DIST_DIR = join(process.cwd(), "dist");

function prerender() {
  const indexPath = join(DIST_DIR, "index.html");
  let indexHtml;

  try {
    indexHtml = readFileSync(indexPath, "utf-8");
  } catch {
    console.error("dist/index.html not found. Run vite build first.");
    process.exit(1);
  }

  for (const [route, meta] of Object.entries(SEO_DATA)) {
    let html = indexHtml;

    html = html.replace(
      /<title>[^<]*<\/title>/,
      `<title>${meta.title}</title>`
    );

    html = html.replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${meta.description}" />`
    );

    html = html.replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:title" content="${meta.title}" />`
    );

    html = html.replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:description" content="${meta.description}" />`
    );

    html = html.replace(
      /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:type" content="${meta.ogType}" />`
    );

    if (!html.includes('<link rel="canonical"')) {
      html = html.replace(
        "</head>",
        `  <link rel="canonical" href="${meta.canonicalUrl}" />\n</head>`
      );
    } else {
      html = html.replace(
        /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
        `<link rel="canonical" href="${meta.canonicalUrl}" />`
      );
    }

    if (!html.includes(`property="og:url"`)) {
      html = html.replace(
        "</head>",
        `  <meta property="og:url" content="${meta.canonicalUrl}" />\n</head>`
      );
    } else {
      html = html.replace(
        /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
        `<meta property="og:url" content="${meta.canonicalUrl}" />`
      );
    }

    const dir = join(DIST_DIR, route);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), html);
    console.log(`  Prerendered: ${route}`);
  }

  console.log(`Prerendered ${Object.keys(SEO_DATA).length} SEO routes.`);
}

prerender();