import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const PUBLISHER = { "@type": "Organization", name: "1Test", url: "https://1test.me" };
const DATE_PUBLISHED = "2026-04-10";
const OG_IMAGE = "https://1test.me/og-image.svg";

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
  } else if (url.includes("/blog")) {
    items.push({ "@type": "ListItem", position: 2, name: "Blog", item: "https://1test.me/blog" });
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
    publisher: { ...PUBLISHER, logo: { "@type": "ImageObject", url: OG_IMAGE } },
  };
}

function buildOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "1Test",
    url: "https://1test.me",
    logo: OG_IMAGE,
    sameAs: [],
  };
}

function buildWebSite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "1Test",
    url: "https://1test.me",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://1test.me/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
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
  "/blog/disc-vs-enneagram-vs-strengths": [
    { question: "Which personality test is the most accurate?", answer: "No framework is universally most accurate — each measures something different. DISC measures behavioral style, Enneagram measures core motivation, Strengths measures natural talent, and 16 Personalities measures cognitive preference. Taking all four gives you the most complete picture." },
    { question: "Can I take more than one personality test?", answer: "Yes, and it is recommended. Each framework adds a layer of understanding. With 1Test, you answer questions once and receive all four profiles, so there is no extra effort." },
    { question: "Is a free personality test reliable?", answer: "1Test uses publicly validated research from the International Personality Item Pool (ipip.ori.org), the same academic source behind many paid assessments. Free does not mean low quality — it means accessible." },
    { question: "How long does it take to get results for all four frameworks?", answer: "The 1Test assessment takes about 15 minutes. You answer roughly 120 questions and receive your DISC, Enneagram, Strengths, and 16 Personalities results immediately — no waiting, no paywall for the core profiles." },
    { question: "What is the difference between DISC and Enneagram?", answer: "DISC maps how you behave — your communication style, pace, and priorities. Enneagram maps why you behave that way — your core fears, desires, and motivations. DISC is more situational, while Enneagram is more stable." },
  ],
  "/blog/which-personality-test-right-for-you": [
    { question: "How long does a personality test take?", answer: "Most standalone personality tests take 10 to 20 minutes. With 1Test, you answer about 120 questions once (roughly 15 minutes) and receive results across all four frameworks. No retaking separate tests for each one." },
    { question: "Which personality test is most accurate?", answer: "Accuracy depends on what you want to measure. There is no single most accurate test — each framework measures something different. DISC measures behavioral style, Enneagram measures core motivation, Strengths measures natural talent, and 16 Personalities measures cognitive preference. The most accurate picture comes from taking all four." },
    { question: "Are free personality tests reliable?", answer: "Yes, when they are based on validated psychological research. 1Test uses the International Personality Item Pool (ipip.ori.org), a publicly available set of personality measures developed by academic researchers and used in peer-reviewed studies." },
    { question: "Can I take multiple personality tests?", answer: "Yes, and it is recommended. Each framework adds a layer of understanding. With 1Test, you answer once and receive all four profiles — you do not need to take four separate tests." },
    { question: "What is the difference between DISC and Enneagram?", answer: "DISC maps how you behave and communicate — your observable style. Enneagram maps why you behave that way — your core fears, desires, and motivations. DISC is more practical for workplace situations. Enneagram is more useful for deep self-reflection and personal growth." },
    { question: "What is the difference between Strengths and 16 Personalities?", answer: "Strengths identifies your natural talents — what you are wired to do well. 16 Personalities describes your cognitive preferences — how you take in information and make decisions. Strengths is best for career direction and performance. 16 Personalities is best for understanding your overall personality pattern." },
  ],
  "/blog/understanding-16-personalities": [
    { question: "What are the 16 personality types?", answer: "The 16 types are combinations of four dimensions: Introvert/Extrovert, Intuitive/Observant, Thinking/Feeling, and Judging/Prospecting. Each combination creates a distinct type with its own patterns, strengths, and growth areas." },
    { question: "Is the 16 Personalities framework accurate?", answer: "The framework is based on validated personality research, including the Big Five model, which has decades of academic support. No personality assessment is 100% precise, but the 16 Personalities model provides a useful and accessible overview of your tendencies." },
    { question: "How is 16 Personalities different from DISC?", answer: "16 Personalities measures your overall cognitive style — how you take in information, make decisions, and structure your life. DISC measures your behavioral style — how you tend to act, communicate, and respond in specific situations, especially at work. They measure different things and complement each other." },
    { question: "Can my personality type change?", answer: "Your core preferences tend to stay stable, but your expression of them can evolve. Most people find they become more balanced over time, developing skills in their non-preferred dimensions without changing their fundamental type." },
    { question: "How long does it take to find my type?", answer: "With 1Test, about 15 minutes. You answer roughly 120 questions and receive your 16 Personalities result along with your DISC, Enneagram, and Strengths results — all from a single assessment." },
  ],
  "/blog/disc-type-work-style": [
    { question: "What does DISC stand for?", answer: "DISC stands for Dominance, Influence, Steadiness, and Conscientiousness. These are the four behavioral dimensions the framework measures. Your DISC profile shows which dimensions you lean toward and how intensely." },
    { question: "Can your DISC style change over time?", answer: "Your core DISC tendencies tend to stay stable, but your expression of them can shift with experience and deliberate effort. Most people become more balanced over time, particularly as they develop skills in their lower-scoring dimensions." },
    { question: "Which DISC style is best for leadership?", answer: "No DISC style is inherently better for leadership. High D-styles tend to lead with decisiveness, high I-styles with persuasion, high S-styles with consensus, and high C-styles with expertise. Effective leaders flex their style based on the situation and the people they are leading." },
    { question: "How is DISC different from Enneagram?", answer: "DISC describes how you behave — your observable actions, especially at work. The Enneagram describes why you behave that way — your core fears, desires, and motivations. DISC is more situational; Enneagram is more deeply rooted in emotional patterns." },
    { question: "How long does the DISC assessment take?", answer: "With 1Test, about 15 minutes. You answer roughly 120 questions and receive your DISC profile along with your Enneagram type, Strengths ranking, and 16 Personalities result — all from a single assessment." },
  ],
  "/blog/disc-assessment-guide": [
    { question: "What does DISC stand for?", answer: "DISC stands for four behavioral dimensions: Dominance, Influence, Steadiness, and Conscientiousness. These dimensions describe how you tend to act, communicate, and respond to different situations — especially at work." },
    { question: "How accurate is a DISC assessment?", answer: "The DISC framework is based on decades of validated personality research. The 1Test assessment uses measures from the International Personality Item Pool (ipip.ori.org), which has been validated in peer-reviewed studies. Like any personality assessment, DISC describes tendencies and patterns — not absolute predictions." },
    { question: "What is the difference between DISC and Enneagram?", answer: "DISC describes how you behave — your observable actions, especially in workplace and team settings. The Enneagram describes why you behave that way — your core fears, desires, and motivations. DISC is more practical for team dynamics; Enneagram is more useful for personal growth and understanding deep patterns. Taking both gives you a richer picture." },
    { question: "How long does a DISC test take?", answer: "With 1Test, about 15 minutes. You answer roughly 120 questions and receive your DISC profile along with your Enneagram type, Strengths ranking, and 16 Personalities result — all from a single assessment." },
    { question: "Can DISC be used for hiring?", answer: "DISC can help you understand how a candidate communicates and works, but it should never be used to screen candidates in or out. No DISC profile is better or worse for a role. The best practice is to use DISC for onboarding, team dynamics, and coaching — not for hiring decisions." },
    { question: "Is the DISC assessment free?", answer: "Yes. 1Test offers the DISC assessment free as part of a single assessment that covers all four frameworks. You receive your DISC profile, Enneagram type, Strengths ranking, and 16 Personalities result — all free, all from one 15-minute test." },
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
  "/blog": {
    title: "Blog — 1Test",
    description:
      "Personality insights, framework guides, and practical self-development advice. Learn about Strengths, DISC, Enneagram, and 16 Personalities.",
    canonicalUrl: "https://1test.me/blog",
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
  "/blog/disc-vs-enneagram-vs-strengths": {
    title: "DISC vs Enneagram vs Strengths — Which Free Test Is Right for You?",
    description:
      "Not sure which personality assessment to take? Compare DISC, Enneagram, Strengths, and 16 Personalities side by side. Take all four free at 1Test.",
    canonicalUrl: "https://1test.me/blog/disc-vs-enneagram-vs-strengths",
    ogType: "article",
  },
  "/blog/which-personality-test-right-for-you": {
    title: "Which Personality Test Is Right for You? Free Guide | 1Test",
    description:
      "Not sure which personality test to take? This guide compares DISC, Enneagram, Strengths, and 16 Personalities so you can pick the right one — or take all four free at 1Test.",
    canonicalUrl: "https://1test.me/blog/which-personality-test-right-for-you",
    ogType: "article",
  },
"/blog/understanding-16-personalities": {
    title: "16 Personalities Explained — Complete Guide to the Framework | 1Test",
    description:
      "What are the 16 Personalities? Learn what each type means, how the framework works, and how it relates to DISC, Enneagram, and Strengths. Take all four free at 1Test.",
    canonicalUrl: "https://1test.me/blog/understanding-16-personalities",
    ogType: "article",
  },
  "/blog/disc-type-work-style": {
    title: "What Your DISC Type Says About Your Work Style | 1Test",
    description:
      "Discover what your DISC profile reveals about how you communicate, lead, and collaborate at work. Free DISC test with full results at 1Test.",
    canonicalUrl: "https://1test.me/blog/disc-type-work-style",
    ogType: "article",
  },
  "/blog/disc-assessment-guide": {
    title: "DISC Assessment Guide — What It Is, How It Works, Why It Matters | 1Test",
    description:
      "Complete guide to the DISC assessment: what it measures, how to read your profile, and how to use DISC at work and in teams. Take the free DISC test at 1Test.",
    canonicalUrl: "https://1test.me/blog/disc-assessment-guide",
    ogType: "article",
  },
};

const BODY_CONTENT = {
  "/free-strengths-test": {
    h1: "Free Strengths Test — Discover What You Do Best",
    sections: [
      { heading: "Discover Your Natural Strengths", text: "Your strengths are the things you do well without trying — the patterns of thinking, feeling, and behaving that come naturally to you. When you understand your strengths, you can choose work that energizes you, build better relationships, and grow faster in the areas where you already excel. The 1Test Strengths assessment identifies your top strengths across five domains and gives you practical suggestions for using each one at work, in relationships, and for personal growth." },
      { heading: "How the Strengths Assessment Works", text: "1Test measures your strengths using 120 questions grounded in validated personality research from the International Personality Item Pool (IPIP). You rate how well each statement describes you, and the assessment maps your responses to 20 distinct strengths organized into five domains. Your full results include your top strengths, descriptions of each one, and growth suggestions — all free, no paywall." },
      { heading: "Strengths at Work", text: "People who understand and use their strengths at work report higher satisfaction and performance. When you know what you naturally do well, you can volunteer for projects that fit your strengths, communicate more effectively with teammates who have different strengths, and make career decisions that align with what energizes you. Your Strengths profile gives you a vocabulary for explaining what you do best." },
    ],
  },
  "/free-disc-test": {
    h1: "Free DISC Test — Understand Your Communication Style",
    sections: [
      { heading: "What Is DISC?", text: "DISC is a behavioral assessment framework that describes how you tend to act and communicate across four dimensions: Dominance (direct, results-oriented), Influence (outgoing, enthusiastic), Steadiness (patient, reliable), and Conscientiousness (analytical, detail-oriented). Most people are a blend of two or more dimensions, with one style being most dominant." },
      { heading: "Take the Free DISC Assessment", text: "The 1Test DISC assessment takes 5-8 minutes and gives you your complete profile at no cost. You see your scores across all four dimensions, your primary style, and practical tips for working with people who have different styles. No paywall, no hidden fees." },
      { heading: "Using DISC for Better Communication", text: "Understanding your DISC style helps you adapt your communication to different audiences. High D types value brevity and results. High I types prefer enthusiasm and stories. High S types appreciate patience and consistency. High C types want data and accuracy. When you know your own style and recognize others, communication becomes smoother and conflicts decrease." },
    ],
  },
  "/free-enneagram-test": {
    h1: "Free Enneagram Test — Discover Your Type and Growth Path",
    sections: [
      { heading: "What Is the Enneagram?", text: "The Enneagram describes nine personality types, each driven by a core motivation. Unlike behavioral frameworks that describe what you do, the Enneagram describes why you do it. Understanding your type gives you insight into your deepest patterns, your growth direction, and the stress responses that hold you back." },
      { heading: "Take the Free Enneagram Test", text: "1Test offers a complete, free Enneagram assessment with your type, wing tendencies, and growth paths — all at no cost. It takes about 8-12 minutes, and you receive your full profile including integration and disintegration directions, practical growth suggestions, and no paywall." },
      { heading: "Your Enneagram Type and Growth", text: "Each Enneagram type has a growth direction (integration) and a stress direction (disintegration). Knowing these helps you recognize when you are thriving versus when you are under pressure. Your type also reveals your core motivation — the underlying driver behind your patterns of thinking, feeling, and behaving." },
    ],
  },
  "/free-personality-test": {
    h1: "Free Personality Test — Which of the 16 Types Are You?",
    sections: [
      { heading: "What Is the 16 Personalities Framework?", text: "The 16 Personalities framework maps your preferences across four dimensions: Energy (Extraversion/Introversion), Information (Sensing/Intuition), Decisions (Thinking/Feeling), and Structure (Judging/Perceiving). These four preferences combine into one of 16 unique types, each with distinct patterns for processing information, making decisions, and interacting with the world." },
      { heading: "Take the Free Personality Test", text: "1Test offers a complete, free personality assessment that reveals your type, your preference dimensions, and practical insights about work, relationships, and personal growth. It takes about 10-15 minutes, and you receive your full profile with no paywall." },
      { heading: "Using Your Results", text: "Your personality type is a starting point, not a box. It tells you about your natural preferences — how you recharge, process information, make decisions, and organize your life. The most useful thing you can do with your results is reflect on where they show up in your daily life and use that awareness to make better decisions about work, relationships, and personal growth." },
    ],
  },
  "/blog/best-free-strengths-assessment": {
    h1: "Best Free Strengths Assessment in 2026 — Complete Comparison",
    sections: [
      { heading: "What a Strengths Assessment Measures", text: "A strengths assessment identifies your natural patterns of thinking, feeling, and behaving — the things you do well without trying. Unlike a personality test, which describes how you process information and make decisions, a strengths assessment focuses specifically on what you are naturally good at. Strengths are not skills. Skills are learned through practice. Strengths are tendencies that come naturally." },
      { heading: "The Top Free Strengths Assessments Compared", text: "1Test and VIA give you complete results without a paywall. HIGH5 and Truity both offer free entry-level results but charge for full profiles. 1Test provides practical, career-oriented growth suggestions alongside your results and offers three other personality frameworks for context." },
      { heading: "How to Use Your Strengths Results", text: "Match your top strengths to roles that need them. Share your strengths with colleagues to improve team collaboration. Use your strengths to build on what works rather than fixing what does not. Combine your Strengths profile with your Enneagram type for a richer picture of what you do well and why you are motivated to do it." },
    ],
  },
  "/blog/disc-communication-styles": {
    h1: "DISC Communication Styles — Work Better With Every Type",
    sections: [
      { heading: "Understanding the Four DISC Styles", text: "The four DISC styles describe how people tend to communicate and behave: D (Dominance) — direct, results-focused, fast-paced. I (Influence) — outgoing, enthusiastic, relationship-oriented. S (Steadiness) — patient, reliable, supportive. C (Conscientiousness) — analytical, detail-oriented, thorough. Most people are a blend of two styles." },
      { heading: "Communicating With Each Style", text: "High D types want brevity, bottom lines, and options. High I types respond to enthusiasm, stories, and personal connection. High S types value patience, consistency, and reassurance. High C types prefer data, accuracy, and logical structure. Adapting your communication style to your audience is the most effective way to reduce misunderstandings and build trust." },
      { heading: "Using DISC for Team Building", text: "DISC is widely used for team building because it gives teams a shared language for communication differences. When team members understand each other's styles, they can adapt their communication, reduce misunderstandings, and assign tasks based on natural strengths." },
    ],
  },
  "/blog/enneagram-career-paths": {
    h1: "Enneagram Career Paths — What Your Type Means for Your Work",
    sections: [
      { heading: "How Your Enneagram Type Affects Career Fit", text: "Your Enneagram type reveals your core motivation — the underlying driver behind your patterns of thinking, feeling, and behaving. Understanding this motivation helps you identify work environments that energize you and those that drain you. No type is better for leadership or any career — each type brings distinct strengths." },
      { heading: "Career Paths by Enneagram Type", text: "Type 1 Reformers thrive in roles requiring precision, ethics, and improvement. Type 2 Helpers excel in coaching, healthcare, and client service. Type 3 Achievers do well in competitive, goal-oriented environments. Type 4 Individualists flourish in creative and design-focused roles. Type 5 Investigators thrive in research, analysis, and specialized technical work." },
      { heading: "Using Enneagram Insights for Career Decisions", text: "Your Enneagram type should influence your career direction, not determine it. Combine it with your Strengths profile and DISC style for a richer picture of what you are wired to do well and what motivates you." },
    ],
  },
  "/blog/personality-test-for-career": {
    h1: "Personality Test for Career — Find Work That Fits You",
    sections: [
      { heading: "How Personality Connects to Career Fit", text: "Your personality type describes your natural preferences — how you recharge, process information, make decisions, and structure your time. These preferences affect which work environments energize you and which drain you. Understanding your type helps you evaluate career fit, not prescribe a specific job title." },
      { heading: "Career Paths by Personality Type", text: "Thinking-Judging types tend to thrive in structured, analytical roles. Feeling-Extraverted types often excel in roles requiring interpersonal connection and communication. Introverted-Intuitive types tend to do well in strategic, research, or creative work. Your type gives you a framework for understanding why certain roles feel natural and others feel draining." },
      { heading: "Taking Action on Your Results", text: "Start by understanding your preferences. Then look for roles and organizations where those preferences are assets, not obstacles. Connect your personality results with your Strengths profile for a clearer picture of what you are wired to do well. The best career decisions combine self-knowledge with real-world experience and opportunity." },
    ],
  },
  "/blog": {
    h1: "1Test Blog",
    sections: [
      { heading: "Personality Insights and Framework Guides", text: "Practical advice for understanding yourself better. Read about Strengths, DISC, Enneagram, and 16 Personalities — and how each framework helps you make better decisions about work, relationships, and personal growth." },
    ],
  },
  "/blog/disc-vs-enneagram-vs-strengths": {
    h1: "DISC vs Enneagram vs Strengths: Which Free Assessment Should You Take?",
    sections: [
      { heading: "What DISC Measures", text: "DISC maps how you behave in predictable situations — especially at work. It tells you whether you lean toward directness or warmth, fast-paced or steady, big-picture or detail-oriented. DISC shines in professional settings and helps explain communication differences." },
      { heading: "What the Enneagram Reveals", text: "The Enneagram describes nine core motivations — not just what you do, but why you do it. Each type has a primary fear and desire that shape decisions below the surface. The Enneagram is particularly useful for personal growth and understanding deep patterns." },
      { heading: "What Strengths Focuses On", text: "Strengths assessments flip the usual model. Instead of asking what needs fixing, they ask what you are already good at and how to do more of it. Your top Strengths might include analytical thinking, empathy, strategic planning, or adaptability." },
    ],
  },
  "/blog/which-personality-test-right-for-you": {
    h1: "Which Personality Test Is Right for You?",
    sections: [
      { heading: "The Four Major Personality Frameworks", text: "There are four frameworks that most people encounter: DISC (how you communicate and act), Enneagram (what drives you), Strengths (what you do best), and 16 Personalities (how you process the world). Each measures something different and is useful in different contexts." },
      { heading: "How to Choose the Right Test", text: "Your goal determines which framework to start with. For workplace communication, take DISC first. For career direction, take Strengths then 16 Personalities. For understanding emotional patterns, take the Enneagram. For a complete picture, take all four." },
      { heading: "Why One Test Is Not Enough", text: "Each framework reveals a different layer. DISC shows behavior, Enneagram shows motivation, Strengths shows talent, and 16 Personalities shows cognitive style. Together, they give you a much richer picture than any single test." },
    ],
  },
  "/blog/understanding-16-personalities": {
    h1: "Understanding the 16 Personalities Framework: A Complete Guide",
    sections: [
      { heading: "What Is the 16 Personalities Framework?", text: "The 16 Personalities framework sorts personality into 16 distinct types based on four dimensions of preference. It is the most popular personality model in the world, drawing on research from the Big Five personality traits and other validated psychological models." },
      { heading: "The Four Dimensions", text: "The four dimensions are: Introvert vs Extrovert (how you recharge), Intuitive vs Observant (how you take in information), Thinking vs Feeling (how you make decisions), and Judging vs Prospecting (how you structure your life). Each combination creates one of 16 unique types." },
      { heading: "How 16 Personalities Fits With Other Frameworks", text: "16 Personalities gives you a broad overview of your cognitive style. DISC adds your behavioral communication style. Enneagram adds your core motivation. Strengths adds your natural talents. Together, they give you a much richer picture than any single framework alone." },
    ],
  },
  "/blog/disc-type-work-style": {
    h1: "What Your DISC Type Says About Your Work Style",
    sections: [
      { heading: "What DISC Measures for Your Career", text: "DISC describes four behavioral dimensions — Dominance, Influence, Steadiness, and Conscientiousness — that shape how you communicate, make decisions, and collaborate at work. Understanding your DISC type helps you identify work environments where you naturally thrive and anticipate friction with people who have different styles." },
      { heading: "Each Style at Work", text: "High D styles are direct and decisive — they thrive in fast-paced, results-oriented roles. High I styles are outgoing and enthusiastic — they excel in collaborative, client-facing environments. High S styles are reliable and patient — they perform best in stable, supportive team settings. High C styles are analytical and thorough — they gravitate toward roles requiring precision and quality." },
      { heading: "Using DISC for Career Growth", text: "Your DISC profile is not a limitation — it is a map. Combine it with your Enneagram type (what drives you), your Strengths profile (what you are wired for), and your 16 Personalities type (how you process the world) for a complete picture of how you work best." },
    ],
  },
  "/blog/disc-assessment-guide": {
    h1: "The Complete Guide to DISC Assessment",
    sections: [
      { heading: "What Is a DISC Assessment?", text: "DISC is a behavioral assessment framework that describes your natural tendencies across four dimensions: Dominance, Influence, Steadiness, and Conscientiousness. It does not measure intelligence, skills, or values. It measures preferences — how you tend to respond to problems, people, pace, and procedures." },
      { heading: "The Four DISC Dimensions", text: "D (Dominance) measures how you handle challenges and make decisions. I (Influence) measures how you interact with people and express enthusiasm. S (Steadiness) measures how you respond to pace and consistency. C (Conscientiousness) measures how you approach details, rules, and accuracy. Most people have a primary style and a secondary style." },
      { heading: "Using DISC at Work", text: "DISC is most immediately useful for team communication, leadership development, and self-awareness. D-styles want brevity and bottom lines. I-styles want context and conversation. S-styles want thoughtful explanations and time to process. C-styles want data and logical structure. Most communication breakdowns happen because people speak in their own style, not the style of the person they are communicating with." },
    ],
  },
};

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

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildBodyContent(route) {
  const content = BODY_CONTENT[route];
  if (!content) return "";

  let html = '<noscript><article class="seo-content">';
  html += `<h1>${escapeHtml(content.h1)}</h1>`;
  for (const section of content.sections) {
    html += `<section><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.text)}</p></section>`;
  }
  const faqs = LANDING_FAQS[route] || BLOG_FAQS[route];
  if (faqs) {
    html += "<section><h2>Frequently Asked Questions</h2>";
    for (const faq of faqs) {
      html += `<details><summary>${escapeHtml(faq.question)}</summary><p>${escapeHtml(faq.answer)}</p></details>`;
    }
    html += "</section>";
  }
  html += "</article></noscript>";
  return html;
}

function replaceMeta(html, pattern, replacement) {
  if (html.includes(pattern.replace(/\s*\//, "").split("=")[0])) {
    return html.replace(pattern, replacement);
  }
  return html.replace("</head>", `  ${replacement}\n</head>`);
}

function prerender() {
  const indexPath = join(process.cwd(), "dist", "index.html");
  let indexHtml;

  try {
    indexHtml = readFileSync(indexPath, "utf-8");
  } catch {
    console.error("dist/index.html not found. Run vite build first.");
    process.exit(1);
  }

  const allRoutes = { ...SEO_DATA };

  for (const [route, meta] of Object.entries(allRoutes)) {
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

    if (!html.includes(`property="og:image"`)) {
      html = html.replace(
        "</head>",
        `  <meta property="og:image" content="${OG_IMAGE}" />\n</head>`
      );
    } else {
      html = html.replace(
        /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
        `<meta property="og:image" content="${OG_IMAGE}" />`
      );
    }

    if (!html.includes(`name="twitter:card"`)) {
      html = html.replace(
        "</head>",
        `  <meta name="twitter:card" content="summary_large_image" />\n</head>`
      );
    } else {
      html = html.replace(
        /<meta\s+name="twitter:card"\s+content="[^"]*"\s*\/?>/i,
        `<meta name="twitter:card" content="summary_large_image" />`
      );
    }

    if (!html.includes(`name="twitter:title"`)) {
      html = html.replace(
        "</head>",
        `  <meta name="twitter:title" content="${meta.title}" />\n</head>`
      );
    } else {
      html = html.replace(
        /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
        `<meta name="twitter:title" content="${meta.title}" />`
      );
    }

    if (!html.includes(`name="twitter:description"`)) {
      html = html.replace(
        "</head>",
        `  <meta name="twitter:description" content="${meta.description}" />\n</head>`
      );
    } else {
      html = html.replace(
        /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
        `<meta name="twitter:description" content="${meta.description}" />`
      );
    }

    if (!html.includes(`name="twitter:image"`)) {
      html = html.replace(
        "</head>",
        `  <meta name="twitter:image" content="${OG_IMAGE}" />\n</head>`
      );
    } else {
      html = html.replace(
        /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
        `<meta name="twitter:image" content="${OG_IMAGE}" />`
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

    const bodyContent = buildBodyContent(route);
    if (bodyContent) {
      html = html.replace(
        '<div id="root"></div>',
        `${bodyContent}\n    <div id="root"></div>`
      );
    }

    const dir = join(process.cwd(), "dist", route);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), html);
    console.log(`  Prerendered: ${route} (${jsonLdSchemas.length} JSON-LD schemas, ${bodyContent ? "with" : "without"} noscript content)`);
  }

  // Home page: add Organization + WebSite JSON-LD and update meta tags in the root index.html
  const homeTitle = "1Test — One Test. Four Frameworks. Know Yourself.";
  const homeDesc = "Take one free 15-minute test and get your Strengths, 16 Personalities, DISC, and Enneagram results. No extra tests needed.";
  const homeUrl = "https://1test.me/";

  let homeHtml = indexHtml;

  homeHtml = homeHtml.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${homeUrl}" />`
  );

  homeHtml = homeHtml.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${homeUrl}" />`
  );

  const homeSchemas = [
    buildOrganization(),
    buildWebSite(),
    buildWebPage(homeTitle, homeDesc, homeUrl),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: homeUrl },
      ],
    },
  ];

  const homeJsonLdScripts = homeSchemas
    .map((schema) => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
    .join("\n");
  homeHtml = homeHtml.replace(
    "</head>",
    `${homeJsonLdScripts}\n</head>`
  );

  writeFileSync(join(process.cwd(), "dist", "index.html"), homeHtml);
  console.log(`  Prerendered: / (${homeSchemas.length} JSON-LD schemas, Organization + WebSite + WebPage + BreadcrumbList)`);

  console.log(`Prerendered ${Object.keys(allRoutes).length + 1} routes total.`);
}

prerender();