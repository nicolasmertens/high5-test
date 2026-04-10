import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const PUBLISHER = { "@type": "Organization", name: "1Test", url: "https://1test.me" };
const DATE_PUBLISHED = "2026-04-10";

function buildWebPage(title, description, url) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url,
    datePublished: DATE_PUBLISHED,
    dateModified: DATE_PUBLISHED,
    publisher: PUBLISHER,
  };
}

function buildBreadcrumb(title, url) {
  const items = [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://1test.me" },
  ];
  if (url.includes("/blog/")) {
    items.push({ "@type": "ListItem", position: 2, name: "Blog", item: "https://1test.me/blog" });
    items.push({ "@type": "ListItem", position: 3, name: title, item: url });
  } else {
    items.push({ "@type": "ListItem", position: 2, name: title, item: url });
  }
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items };
}

function buildFAQ(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

function buildArticle(headline, description, url) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url,
    datePublished: DATE_PUBLISHED,
    dateModified: DATE_PUBLISHED,
    author: PUBLISHER,
    publisher: PUBLISHER,
  };
}

const LANDING_FAQS = {
  "/free-strengths-test": [
    { question: "What are my top strengths?", answer: "Your top strengths are the natural abilities you use most often and most effectively. They are the things that feel easy to you but might be hard for others. The 1Test Strengths assessment identifies your unique pattern and ranks your top strengths with clear explanations." },
    { question: "How do I find out my strengths for free?", answer: "Take the free Strengths test on 1Test. It takes about 5-10 minutes, and you receive your complete Strengths Profile at no cost. No paywall, no partial results hidden behind a fee." },
    { question: "What is the best free strengths assessment?", answer: "1Test offers a complete, free Strengths assessment with full results. Unlike other platforms that limit you to partial results or require payment for your full profile, 1Test gives you everything upfront — your top strengths, descriptions, and practical growth suggestions." },
    { question: "How many strengths does a person have?", answer: "Most strengths frameworks identify 5-6 core strengths for each person. These are the patterns that show up most consistently across different situations. Your results may also show secondary strengths that appear in specific contexts. The 1Test assessment focuses on your top profile so you get clear, actionable results." },
    { question: "Can your strengths change over time?", answer: "Yes. While core strengths tend to stay stable over time, the expression of your strengths can shift as your circumstances and experiences change. A strength that was dominant ten years ago might recede while another becomes more prominent. Reassessing periodically helps you stay current with how your strengths are showing up." },
    { question: "What is the difference between strengths and skills?", answer: "Strengths are natural tendencies — things you do well without much effort. Skills are learned abilities developed through practice. You can build a skill in an area where you do not have a natural strength, but it requires more energy. Using your strengths requires less effort and often produces better results." },
    { question: "How do I use my strengths at work?", answer: "Start by naming your top strengths. Then look for specific situations at work where those strengths are needed. If Strategic Thinking is a top strength, volunteer for planning and direction-setting work. If Empathy is a top strength, lean into roles that involve coaching or client interaction. Your Strengths Profile from 1Test includes practical suggestions for each of your top strengths." },
  ],
  "/free-disc-test": [
    { question: "What does a DISC test measure?", answer: "A DISC test measures your behavioral tendencies across four dimensions: Dominance (direct, results-oriented), Influence (outgoing, enthusiastic), Steadiness (patient, reliable), and Conscientiousness (analytical, detail-oriented). It describes how you tend to communicate, make decisions, and respond to different situations — not your abilities or intelligence." },
    { question: "Is the DISC test accurate?", answer: "DISC assessments based on validated behavioral research produce consistent, reliable results. The key is choosing an assessment with transparent methodology and realistic expectations. DISC describes behavioral tendencies, not fixed traits. Your style can shift depending on the situation, the people around you, and your stage of life." },
    { question: "What are the four DISC personality types?", answer: "The four DISC dimensions are: D (Dominance) — direct, results-focused, decisive. I (Influence) — outgoing, enthusiastic, collaborative. S (Steadiness) — patient, reliable, supportive. C (Conscientiousness) — analytical, detail-oriented, accurate. Most people are a blend of two or more dimensions." },
    { question: "How do I find out my DISC type for free?", answer: "Take the free DISC test on 1Test. It takes about 5-8 minutes, and you receive your complete DISC profile at no cost. No paywall, no partial results. You get all four dimensions, your primary style, and practical tips for working with people who have different styles." },
    { question: "What is the difference between DISC D and I types?", answer: "D (Dominance) and I (Influence) are both fast-paced styles, but they focus on different things. High D types prioritize results, control, and efficiency. High I types prioritize relationships, recognition, and creative ideas. Both are action-oriented — D through decisive action, I through social energy." },
    { question: "Can DISC help with team building?", answer: "Yes. DISC is one of the most widely used frameworks for team building because it gives teams a shared language for communication differences. When team members understand each other's DISC styles, they can adapt their communication, assign tasks based on natural strengths, and resolve conflicts more effectively." },
    { question: "How does DISC compare to other personality tests?", answer: "DISC focuses on observable behavior — how you act and communicate. Strengths assessments identify your natural talents. The Enneagram describes your core motivations. 16 Personalities maps your cognitive preferences. Each provides a different perspective. Taking multiple frameworks gives you a richer self-understanding than any single test." },
  ],
  "/free-enneagram-test": [
    { question: "What is the most accurate free Enneagram test?", answer: "1Test offers a complete, free Enneagram assessment with your type, wing tendencies, and growth paths — all at no cost. Unlike many free Enneagram tests that provide only a type number, 1Test gives you the full picture including integration and disintegration directions, practical growth suggestions, and no paywall." },
    { question: "What are the nine Enneagram types?", answer: "The nine types are: Type 1 (Reformer), Type 2 (Helper), Type 3 (Achiever), Type 4 (Individualist), Type 5 (Investigator), Type 6 (Loyalist), Type 7 (Enthusiast), Type 8 (Challenger), Type 9 (Peacemaker). Each type has growth and stress directions that show how it evolves." },
    { question: "How do I find out my Enneagram type?", answer: "Take the free Enneagram test on 1Test. It takes about 8-12 minutes, and you receive your complete type profile with wing tendencies, growth direction, stress direction, and practical suggestions — all free with no paywall." },
    { question: "What does Enneagram wing mean?", answer: "Your wing is the adjacent Enneagram type that influences how you express your main type. For example, a Type 3 with a 2-wing is more people-oriented and charming, while a Type 3 with a 4-wing is more introspective and creative. Most people lean toward one wing more than the other." },
    { question: "Can your Enneagram type change?", answer: "Your core type tends to stay stable throughout your life — it reflects your deepest motivation pattern. However, you can grow and develop within your type by integrating the positive qualities of your growth direction. You may also relate strongly to your wing or feel like a different type when under stress." },
    { question: "What Enneagram type is best for leadership?", answer: "No Enneagram type is inherently better for leadership. Type 8 Challengers lead with directness and protectiveness. Type 3 Achievers lead with vision and goal-setting. Type 1 Reformers lead with integrity and high standards. Effective leadership depends on self-awareness — understanding your type helps you lead from your strengths and watch for your blind spots." },
    { question: "How is the Enneagram different from personality tests?", answer: "The Enneagram focuses on core motivations — why you do what you do. Personality tests like 16 Personalities focus on cognitive preferences. DISC focuses on observable behavior. Strengths assessments focus on what you do best. Each framework provides a different lens. Together, they give you a more complete understanding than any single test." },
  ],
  "/free-personality-test": [
    { question: "What is the 16 Personalities test?", answer: "The 16 Personalities test is a personality assessment that maps your preferences across four dimensions: Energy (Extraversion/Introversion), Information (Sensing/Intuition), Decisions (Thinking/Feeling), and Structure (Judging/Perceiving). These combine into one of 16 unique types, each with distinct patterns for processing information, making decisions, and interacting with the world." },
    { question: "How accurate is the 16 Personalities test?", answer: "Personality type assessments based on validated preference frameworks produce consistent, reliable results. The key is answering honestly — choose what feels natural, not what you think sounds best. 1Test's personality assessment provides your complete type description with practical insights, free with no paywall." },
    { question: "What are the 16 personality types?", answer: "The 16 types are combinations of four dimensions: E/I (Extraversion/Introversion), S/N (Sensing/Intuition), T/F (Thinking/Feeling), and J/P (Judging/Perceiving). Each type has a four-letter code and a descriptive name. Your 1Test results include a full description of your type's characteristics, strengths, and growth areas." },
    { question: "Which personality type am I?", answer: "Take the free personality test on 1Test and find out. It takes about 10-15 minutes, and you receive your complete type profile with practical insights about work, relationships, and personal growth — all free." },
    { question: "Can your personality type change?", answer: "Your core preferences tend to stay stable over time, but how you express them can shift as you grow. An Introvert who has developed strong social skills is still an Introvert — they just have more tools for handling social situations. The key is understanding your natural preference so you can build on it intentionally." },
    { question: "Is the 16 Personalities test the same as a personality test?", answer: "The 16 Personalities framework is one approach to personality assessment. It focuses on cognitive preferences. Other frameworks measure different dimensions: DISC measures behavioral style, Strengths measures natural talents, and the Enneagram measures core motivations. Each provides a different lens. Taking multiple frameworks gives you a more complete understanding." },
    { question: "What personality type is best for leadership?", answer: "No personality type is inherently better for leadership. Different types lead differently. Thinking-Judging types tend to lead with structure and logic. Feeling-Extraverted types tend to lead with empathy and energy. Introverted-Intuitive types tend to lead with vision and strategy. Effective leadership comes from understanding your type and adapting your approach." },
  ],
};

const BLOG_FAQS = {
  "/blog/best-free-strengths-assessment": [
    { question: "What is the best free strengths test?", answer: "1Test offers the most complete free strengths assessment. You get your full profile, practical growth suggestions, and the option to compare your results across four personality frameworks — all at no cost. VIA Character Strengths is another free option, though it focuses more on academic character research than practical application." },
    { question: "How do I find out my strengths for free?", answer: "Take the free Strengths test on 1Test. It takes 5-10 minutes, and your full results are available immediately with no paywall. You can also take the DISC assessment, Enneagram test, and 16 Personalities test to see your strengths in the context of your broader personality." },
    { question: "What is the difference between strengths and personality?", answer: "Strengths are what you naturally do well — your patterns of thinking and behaving that feel effortless. Personality is broader. It includes how you process information, make decisions, and interact with the world. Think of it this way: your personality shapes your overall style, and your strengths are the specific abilities that fall within that style." },
    { question: "Can I take a strengths test online for free?", answer: "Yes. Several strengths assessments are available online, but not all are truly free. 1Test provides complete results at no cost. Some other platforms show partial results free and charge for the full profile. Always check whether you get complete results or just a summary before starting a test." },
    { question: "How accurate are free strengths assessments?", answer: "The accuracy of a strengths assessment depends on its design and research foundation, not its price. Assessments built on validated personality research frameworks — like those used by 1Test and VIA — produce reliable results. The key is choosing an assessment with a transparent methodology and realistic claims." },
  ],
  "/blog/disc-communication-styles": [
    { question: "What are the four DISC communication styles?", answer: "The four DISC styles describe how people tend to communicate and behave: D (Dominance) — direct, results-focused, fast-paced. I (Influence) — outgoing, enthusiastic, relationship-oriented. S (Steadiness) — patient, reliable, supportive. C (Conscientiousness) — analytical, detail-oriented, thorough. Most people are a blend of two styles." },
    { question: "How do I find out my DISC style?", answer: "Take the free DISC test on 1Test. It takes 5-8 minutes, and you receive your complete DISC profile — all four dimensions, your primary style, and communication tips — with no paywall." },
    { question: "Can DISC help with team building?", answer: "Yes. DISC is widely used for team building because it gives teams a shared language for communication differences. When team members understand each other's styles, they can adapt their communication, reduce misunderstandings, and assign tasks based on natural strengths." },
    { question: "Which DISC style is best for leadership?", answer: "No DISC style is inherently better for leadership. High D leaders excel at decisive action and driving results. High I leaders excel at motivating teams and building buy-in. High S leaders excel at creating stable, supportive environments. High C leaders excel at analytical decision-making and quality standards." },
    { question: "Is DISC the same as a personality test?", answer: "DISC measures behavioral style — how you tend to act and communicate. A personality test is broader, covering cognitive preferences, motivations, and values. DISC is one lens. 16 Personalities, Strengths, and Enneagram are other lenses. Each provides different information. Together, they give you a more complete self-understanding." },
  ],
  "/blog/enneagram-career-paths": [
    { question: "Which Enneagram type is best for leadership?", answer: "No Enneagram type is inherently better for leadership. Type 8 leads with directness and protectiveness. Type 3 leads with vision and goal-setting. Type 6 leads with preparation and care for the team. The most effective leaders understand their type's strengths and blind spots, and adapt their approach." },
    { question: "Can your Enneagram type change your career path?", answer: "Your Enneagram type should influence your career direction, not determine it. Type tells you what environments energize you and what drains you — that is valuable career guidance, not a limitation. Use your type as one input alongside your skills, experience, and practical circumstances." },
    { question: "What if my career does not match my Enneagram type?", answer: "That is completely normal. Most people do not have careers that perfectly align with their Enneagram type. What matters is whether your work environment supports your core motivation in some way. Focus on finding aspects of your current role that align with your motivation, and look for opportunities to add more of what energizes you." },
    { question: "How do I find out my Enneagram type?", answer: "Take the free Enneagram test on 1Test. It takes about 8-12 minutes, and you receive your type, wing tendencies, growth direction, and stress direction — all free with no paywall." },
    { question: "Is the Enneagram useful for career planning?", answer: "Yes, as one input among several. The Enneagram is most useful for career planning when you combine it with other self-knowledge. Knowing that you are a Type 3 Achiever tells you that recognition and results motivate you — but it does not tell you whether you should be in sales, consulting, or product management. Adding your Strengths profile and DISC style refines it further." },
  ],
  "/blog/personality-test-for-career": [
    { question: "What personality test is best for career guidance?", answer: "The most useful career tests tell you about your preferences and tendencies, not just job titles. 1Test's personality assessment gives you your type, your preference dimensions, and practical career guidance based on how your type tends to approach work. It also offers Strengths, DISC, and Enneagram assessments for a more complete picture." },
    { question: "Can a personality test tell me what job to get?", answer: "No single test can tell you exactly what job to pursue. A personality test tells you which environments and work styles align with your natural preferences. That is more useful than a job recommendation because it helps you evaluate any career — whether it exists today or you create it tomorrow." },
    { question: "How do I find a career that matches my personality?", answer: "Start by understanding your preferences: how you recharge, process information, make decisions, and structure your time. Then look for roles and organizations where those preferences are assets, not obstacles. Connect your personality results with your Strengths profile for a clearer picture of what you are wired to do well." },
    { question: "Should I choose a career based on my personality type?", answer: "Your personality type should be one input among several — alongside your skills, experience, values, and practical circumstances. It helps you evaluate whether a career fits who you are, but it should not be the only factor. The best career decisions combine self-knowledge with real-world experience and opportunity." },
    { question: "How accurate are personality tests for career planning?", answer: "Personality tests based on validated preference frameworks produce consistent results that can inform career planning. The key is using them as a starting point for self-reflection, not as a definitive answer. 1Test's personality assessment is free and provides your complete type profile with career-relevant insights." },
  ],
};

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

function buildJsonLd(route, meta) {
  const schemas = [];

  schemas.push(buildWebPage(meta.title, meta.description, meta.canonicalUrl));
  schemas.push(buildBreadcrumb(meta.title, meta.canonicalUrl));

  if (meta.ogType === "article") {
    schemas.push(buildArticle(meta.title, meta.description, meta.canonicalUrl));
  }

  const faqs = LANDING_FAQS[route] || BLOG_FAQS[route];
  if (faqs) {
    schemas.push(buildFAQ(faqs));
  }

  return schemas;
}

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

    const jsonLdSchemas = buildJsonLd(route, meta);
    const jsonLdScripts = jsonLdSchemas
      .map((schema) => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
      .join("\n");
    html = html.replace(
      "</head>",
      `${jsonLdScripts}\n</head>`
    );

    const dir = join(DIST_DIR, route);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), html);
    console.log(`  Prerendered: ${route} (${jsonLdSchemas.length} JSON-LD schemas)`);
  }

  console.log(`Prerendered ${Object.keys(SEO_DATA).length} SEO routes.`);
}

prerender();