export interface FAQ {
  q: string;
  a: string;
}

export interface FrameworkContent {
  slug: string;
  name: string;
  fullName: string;
  color: string;
  icon: string;
  heroSubtitle: string;
  // Section 1: What is it
  what: string;
  history: string;
  // Section 2: Dimensions/Types
  dimensionsTitle: string;
  dimensions: { name: string; desc: string }[];
  // Section 3: How to interpret
  interpretation: string[];
  // Section 4: Use cases
  useCases: { title: string; desc: string }[];
  // Section 5: How our test works
  howItWorks: string[];
  // Section 6: Why 1Test
  whyOurs: string[];
  // Section 7: Comparison
  comparison: { aspect: string; others: string; ours: string }[];
  // Section 8: FAQ
  faqs: FAQ[];
  // Meta
  metaTitle: string;
  metaDesc: string;
}

export const frameworkContent: Record<string, FrameworkContent> = {
  disc: {
    slug: "disc",
    name: "DISC",
    fullName: "DISC Personality Assessment",
    color: "#e53e3e",
    icon: "◆",
    heroSubtitle:
      "Understand your behavioral style — how you handle problems, influence others, respond to pace, and approach rules. Plus get three more frameworks free.",
    what: "DISC is a behavioral assessment that categorizes people along four dimensions of observable behavior. Unlike personality type indicators that measure how you think, DISC measures how you act — especially in workplace and social situations. It's one of the most widely used assessments in corporate settings, with an estimated 50 million people having taken some form of DISC assessment worldwide. The four dimensions are not boxes — everyone has all four to varying degrees. Your DISC profile shows the relative strength of each dimension, creating a unique behavioral fingerprint that explains how you naturally communicate, make decisions, and interact with others.",
    history:
      "DISC theory was created by psychologist William Moulton Marston in his 1928 book 'Emotions of Normal People.' Marston — who also invented the lie detector and created Wonder Woman — observed that people express emotions through four behavioral types. The theory was later adapted into assessment instruments by industrial psychologist Walter Clarke in the 1950s. Today, dozens of companies offer DISC assessments (Crystal, Tony Robbins DISC, Thomas International, and others), but the underlying model is in the public domain and freely available for anyone to use.",
    dimensionsTitle: "The 4 DISC Dimensions",
    dimensions: [
      {
        name: "D — Dominance",
        desc: "People high in Dominance are direct, results-oriented, firm, strong-willed, and competitive. They focus on accomplishing results, the bottom line, and confidence. They tend to be blunt, strong-willed, and demanding. In meetings, they want to get to the point quickly. Under stress, they may become aggressive or impatient. At work, they excel in leadership roles, crisis management, and any situation requiring decisive action.",
      },
      {
        name: "I — Influence",
        desc: "People high in Influence are outgoing, enthusiastic, optimistic, collaborative, and lively. They focus on persuading others, building relationships, and being recognized. They tend to be spontaneous, energetic, and talkative. In meetings, they bring energy and ideas. Under stress, they may become disorganized or overly emotional. At work, they excel in sales, public relations, team motivation, and creative brainstorming.",
      },
      {
        name: "S — Steadiness",
        desc: "People high in Steadiness are even-tempered, patient, humble, tactful, and accommodating. They focus on cooperation, sincerity, and dependability. They tend to be calm, predictable, and supportive. In meetings, they listen carefully and seek consensus. Under stress, they may become passive-aggressive or resistant to change. At work, they excel in support roles, customer service, team coordination, and any situation requiring patience and reliability.",
      },
      {
        name: "C — Conscientiousness",
        desc: "People high in Conscientiousness are analytical, detail-oriented, reserved, precise, and systematic. They focus on quality, accuracy, expertise, and competency. They tend to be careful, methodical, and private. In meetings, they want data and time to analyze. Under stress, they may become overly critical or paralyzed by analysis. At work, they excel in quality assurance, finance, engineering, research, and any situation requiring precision.",
      },
    ],
    interpretation: [
      "Your DISC profile is not a single letter — it's a combination. Most people have one or two dominant dimensions. A 'Di' profile (high Dominance, secondary Influence) behaves very differently from a 'Dc' profile (high Dominance, secondary Conscientiousness), even though both lead with Dominance.",
      "There are no 'good' or 'bad' DISC profiles. Every combination has strengths and blind spots. A high-D leader gets results fast but may alienate people. A high-S team member builds trust but may avoid necessary conflict. The goal is self-awareness, not self-improvement.",
      "DISC can change by context. You might be high-I in social settings but high-C at work. The assessment captures your natural default, but you can adapt your style once you understand it.",
      "The most powerful use of DISC is understanding others. When you know someone's DISC style, you can adapt how you communicate with them — leading to less friction, better collaboration, and stronger relationships.",
    ],
    useCases: [
      { title: "Team Communication", desc: "Understand why some colleagues prefer email (C) while others want a quick call (I). Reduce miscommunication by adapting your style to theirs." },
      { title: "Sales & Negotiation", desc: "Identify a prospect's DISC style from their communication patterns. High-D buyers want bottom-line results. High-C buyers want detailed specs. Adjust your pitch accordingly." },
      { title: "Hiring & Team Building", desc: "Build balanced teams with complementary DISC profiles. A team of all high-D people will fight for control. A team of all high-S people won't make decisions." },
      { title: "Conflict Resolution", desc: "Most workplace conflicts are style clashes, not personal issues. A high-D manager who 'just tells people what to do' isn't being rude — they're being Direct. Understanding DISC reframes conflict as a communication gap." },
      { title: "Leadership Development", desc: "Different DISC profiles require different management styles. High-I employees need public recognition. High-C employees need clear expectations and autonomy. One-size-fits-all management fails." },
    ],
    howItWorks: [
      "Our assessment presents 120 statements that you rate on a slider from 'Strongly Disagree' to 'Strongly Agree.' There are no right or wrong answers — go with your first instinct.",
      "Behind the scenes, each statement maps to one of 20 underlying strengths. Your scores on these strengths are then weighted against known DISC behavioral correlations. For example, high scores on Commander and Self-Believer strengths pull toward Dominance, while high Storyteller and Chameleon scores pull toward Influence.",
      "The result is a score for each of the four DISC dimensions, plus your primary and secondary style. Unlike traditional DISC assessments that only give you DISC, you also receive your 16 Personalities type, Enneagram type, and full strengths ranking — all from the same 120 questions.",
    ],
    whyOurs: [
      "Four frameworks from one test — most DISC assessments only give you DISC",
      "Free basic results (your Top 5 strengths and type teasers) with the option to unlock everything",
      "Based on the International Personality Item Pool (IPIP), a public domain research instrument used in thousands of academic studies",
      "Takes ~15 minutes instead of 45+ minutes for separate assessments",
      "See your full score on all four dimensions, not just your dominant type",
      "Privacy-first: your answers are processed entirely in your browser. We don't store your responses on any server.",
    ],
comparison: [
      { aspect: "Price", others: "Other DISC tools: $50–$100+", ours: "Free basic, unlock full profile" },
      { aspect: "Frameworks included", others: "DISC only", ours: "DISC + 16 Personalities + Enneagram + Strengths" },
      { aspect: "Questions", others: "28-80 questions, DISC only", ours: "120 questions, four frameworks" },
      { aspect: "Time", others: "15 min for DISC alone", ours: "15 min for all four" },
      { aspect: "Account required", others: "Yes (email + payment)", ours: "No account for free results" },
      { aspect: "Results", others: "Behind paywall or email gate", ours: "Free basic results, optional full unlock" },
    ],
    faqs: [
      { q: "Is this a real DISC assessment?", a: "Yes — we measure the same four behavioral dimensions (Dominance, Influence, Steadiness, Conscientiousness) that all DISC assessments measure. The difference is our methodology: we derive your DISC profile from a broader 120-question assessment that also captures your personality type, Enneagram, and strengths. The underlying DISC model is public domain (created by William Marston in 1928) and is not owned by any single company." },
      { q: "How accurate is a derived DISC profile vs. a dedicated DISC test?", a: "For most people, the results are very similar. Our assessment measures 20 underlying strengths that map directly to DISC dimensions (e.g., Commander → Dominance, Storyteller → Influence). The advantage is you get three additional frameworks for free. If you need a DISC assessment specifically for a corporate training program that requires a certified provider, you may need a dedicated commercial DISC assessment." },
      { q: "Is DISC scientifically validated?", a: "The DISC model has been widely used since the 1950s and has extensive practical validation in workplace settings. However, like many personality assessments, it has limited peer-reviewed academic validation compared to instruments like the Big Five. It's best used as a self-awareness and communication tool, not as a diagnostic instrument." },
      { q: "Can my DISC type change?", a: "Your natural DISC style tends to be relatively stable, but it can shift in different contexts (work vs. home) and over time as you develop. Major life changes, new roles, or deliberate personal development can all influence your behavioral style." },
      { q: "What's the difference between DISC and 16 Personalities?", a: "DISC measures observable behavior (how you act), while 16 Personalities measures cognitive preferences (how you think). You might be a high-I in DISC (outgoing, enthusiastic) and an INTP in 16 Personalities (introverted thinker). They're complementary, not contradictory — which is exactly why our test gives you both." },
      { q: "Do you store my data?", a: "No. Your assessment is processed entirely in your browser using JavaScript. Your answers never leave your device. Progress is saved in your browser's localStorage so you can resume if you close the tab." },
    ],
    metaTitle: "Free DISC Personality Test | 1Test.me",
    metaDesc:
      "Free DISC personality assessment — plus get your 16 Personalities, Enneagram, and Top 5 Strengths. Free basic results, optional full unlock.",
  },

  enneagram: {
    slug: "enneagram",
    name: "Enneagram",
    fullName: "Enneagram Personality Test",
    color: "#7c3aed",
    icon: "◎",
    heroSubtitle:
      "Discover your core motivations, fears, and growth path — what drives you at the deepest level. Plus get three more frameworks free.",
    what: "The Enneagram is a personality framework that describes nine interconnected personality types, each defined by a core motivation and a core fear. Unlike behavioral assessments (like DISC) that describe what you do, or cognitive assessments (like 16 Personalities) that describe how you think, the Enneagram describes why you do what you do — your deepest unconscious drivers. Two people can behave identically but for completely different reasons. An Enneagram Type 3 (Achiever) and Type 1 (Reformer) both work hard, but the 3 is driven by a desire for admiration, while the 1 is driven by a desire for moral correctness. Understanding this difference is transformative for self-awareness, relationships, and personal growth.",
    history:
      "The Enneagram's origins are debated — elements trace back to ancient Greek philosophy (Pythagoras, Plotinus), Christian mysticism (the Desert Fathers), and Sufi traditions. The modern Enneagram of Personality was developed in the 1960s-70s by Oscar Ichazo (who identified the nine types and their fixations) and Claudio Naranjo (who connected them to modern psychology). It was popularized in the West by Don Riso and Russ Hudson (The Enneagram Institute), Helen Palmer, and Richard Rohr. Today it's used in therapy, executive coaching, spiritual direction, and increasingly in corporate team development. The Enneagram is not trademarked or owned by any organization — it's a shared body of knowledge.",
    dimensionsTitle: "The 9 Enneagram Types",
    dimensions: [
      { name: "Type 1 — The Reformer", desc: "Principled, purposeful, self-controlled, and perfectionist. Core motivation: to be good, ethical, and correct. Core fear: being corrupt, evil, or defective. At their best, they are wise, discerning, and inspiring. Under stress, they become rigid, critical, and resentful. Growth direction: toward spontaneity and joy (integrating to 7)." },
      { name: "Type 2 — The Helper", desc: "Generous, demonstrative, people-pleasing, and possessive. Core motivation: to be loved and needed. Core fear: being unwanted or unworthy of love. At their best, they are genuinely altruistic and unconditionally loving. Under stress, they become manipulative and martyr-like. Growth direction: toward self-care and boundaries (integrating to 4)." },
      { name: "Type 3 — The Achiever", desc: "Adaptable, excelling, driven, and image-conscious. Core motivation: to be valuable, successful, and admired. Core fear: being worthless or a failure. At their best, they are authentic, inspiring, and genuinely excellent. Under stress, they become deceptive, narcissistic, or hostile. Growth direction: toward cooperation and loyalty (integrating to 6)." },
      { name: "Type 4 — The Individualist", desc: "Expressive, dramatic, self-absorbed, and temperamental. Core motivation: to be unique and authentically themselves. Core fear: having no identity or personal significance. At their best, they are profoundly creative, emotionally honest, and compassionate. Under stress, they become envious, withdrawn, and self-destructive. Growth direction: toward objectivity and discipline (integrating to 1)." },
      { name: "Type 5 — The Investigator", desc: "Perceptive, innovative, secretive, and isolated. Core motivation: to be competent, knowledgeable, and self-sufficient. Core fear: being useless, helpless, or overwhelmed. At their best, they are visionary, pioneering, and intellectually generous. Under stress, they become detached, hoarding, and provocative. Growth direction: toward confidence and action (integrating to 8)." },
      { name: "Type 6 — The Loyalist", desc: "Engaging, responsible, anxious, and suspicious. Core motivation: to have security, support, and guidance. Core fear: being without support or guidance. At their best, they are courageous, loyal, and self-reliant. Under stress, they become anxious, suspicious, and either aggressively confrontational or paralyzed by indecision. Growth direction: toward inner peace and relaxation (integrating to 9)." },
      { name: "Type 7 — The Enthusiast", desc: "Spontaneous, versatile, acquisitive, and scattered. Core motivation: to be happy, satisfied, and free from pain. Core fear: being trapped in pain or deprivation. At their best, they are joyful, accomplished, and deeply grateful. Under stress, they become scattered, escapist, and impulsive. Growth direction: toward depth and focus (integrating to 5)." },
      { name: "Type 8 — The Challenger", desc: "Self-confident, decisive, willful, and confrontational. Core motivation: to be strong, protect themselves, and control their situation. Core fear: being controlled or harmed by others. At their best, they are magnanimous, empowering, and heroically protective. Under stress, they become domineering, ruthless, and combative. Growth direction: toward vulnerability and openness (integrating to 2)." },
      { name: "Type 9 — The Peacemaker", desc: "Receptive, reassuring, complacent, and resigned. Core motivation: to have inner stability, peace, and harmony. Core fear: loss, separation, and fragmentation. At their best, they are deeply accepting, harmonizing, and present. Under stress, they become disengaged, stubborn, and passive-aggressive. Growth direction: toward action and self-assertion (integrating to 3)." },
    ],
    interpretation: [
      "Your Enneagram type is your 'home base' — the core pattern you return to under pressure. Most people identify with two or three types, but one will resonate most deeply, especially when you read about its core fear.",
      "Wings are the types adjacent to yours on the Enneagram circle. A Type 3 can have a 2-wing (3w2, 'The Star') or a 4-wing (3w4, 'The Professional'). Your wing adds flavor to your core type but doesn't change it.",
      "The Enneagram describes patterns of motivation, not behavior. Two Type 8s can look completely different on the surface — one might be a loud CEO, another a quiet martial artist — but both are driven by the same core need for strength and independence.",
      "Growth in the Enneagram means integrating the healthy qualities of your 'integration' type. For example, Type 3s grow by adopting the loyalty and team-orientation of Type 6. This isn't about becoming a different type — it's about expanding your range.",
    ],
    useCases: [
      { title: "Self-Awareness & Therapy", desc: "The Enneagram reveals unconscious patterns that other assessments miss. Understanding your core fear can explain decades of behavior in a single insight." },
      { title: "Relationships", desc: "Knowing your partner's Enneagram type transforms conflict. A Type 1's criticism isn't personal — it's their way of caring. A Type 5's withdrawal isn't rejection — it's how they recharge." },
      { title: "Leadership & Coaching", desc: "Different types need different management. Type 3s need recognition for authentic effort (not just results). Type 6s need consistent reassurance. Type 8s need autonomy and direct feedback." },
      { title: "Spiritual Growth", desc: "The Enneagram has deep roots in contemplative traditions. Each type has a specific 'holy idea' and virtue to cultivate — a map for spiritual development unique to your pattern." },
      { title: "Team Dynamics", desc: "Enneagram-aware teams can predict and prevent conflict. A 1-8 pairing will clash over control and standards. A 2-5 pairing will struggle with emotional needs. Knowing this in advance allows proactive communication." },
    ],
    howItWorks: [
      "Our assessment presents 120 statements rated on a continuous slider. Each statement maps to one of 20 underlying strengths — behavioral patterns that correlate with Enneagram motivations.",
      "Your strength scores are then weighted against Enneagram type patterns. For example, high Winner + Deliverer + Storyteller scores strongly correlate with Type 3 (achievement and image). High Brainstormer + Chameleon + Catalyst scores correlate with Type 7 (novelty and freedom).",
      "We calculate a score for all 9 types, determine your wing (highest adjacent type), and identify your tritype (strongest type from each of the three centers: gut, heart, and head).",
      "Because we measure 20 different strengths, we have enough signal to differentiate between types that look similar behaviorally but differ in motivation — like Type 3 (achievement-driven) and Type 8 (power-driven), which can both appear dominant and competitive.",
    ],
    whyOurs: [
      "Most Enneagram tests are 144+ questions for just one framework — ours gives you four frameworks from 120 questions",
      "Free basic results (your Top 5 strengths and type teasers) with the option to unlock everything",
      "See your full 9-type spectrum with scores, not just your top type",
      "Wing and tritype included — many free tests skip these",
      "Cross-reference your Enneagram with your DISC, 16 Personalities, and Strengths for deeper insight",
      "Privacy-first: answers processed in your browser, never sent to a server",
    ],
    comparison: [
      { aspect: "Price", others: "Enneagram Institute (RHETI): $12. Truity: $19. Certified coach: $100+", ours: "Free" },
      { aspect: "Frameworks included", others: "Enneagram only", ours: "Enneagram + DISC + 16 Personalities + Strengths" },
      { aspect: "Questions", others: "144 (RHETI) or 105 (Truity)", ours: "120 questions, four frameworks" },
      { aspect: "Wing & tritype", others: "Often extra cost or not included", ours: "Included free" },
      { aspect: "Account required", others: "Yes", ours: "No" },
      { aspect: "Full spectrum", others: "Usually just top 1-3 types", ours: "All 9 types scored and ranked" },
    ],
    faqs: [
      { q: "Can you really determine Enneagram type from a questionnaire?", a: "No questionnaire can determine your type with certainty — the Enneagram community generally agrees that typing requires self-reflection, often with a coach. However, a well-designed assessment can narrow it down to 1-2 likely types. Our assessment gives you a scored ranking of all 9 types with confidence levels, so you can explore your top candidates and decide for yourself." },
      { q: "Why might my result be different from another Enneagram test?", a: "The Enneagram measures motivation, which is harder to assess through behavioral questions than, say, DISC (which measures behavior directly). Different tests use different methodologies. If your result doesn't feel right, look at your top 2-3 types and read their core fears — the one that hits hardest is usually your type." },
      { q: "What are wings and tritype?", a: "Wings are the two types adjacent to yours on the Enneagram circle. Everyone leans toward one wing more than the other (e.g., 3w4 vs 3w2). Your tritype is your dominant type from each of the three centers: gut (8, 9, 1), heart (2, 3, 4), and head (5, 6, 7). Together, wing and tritype add nuance to your core type." },
      { q: "Is the Enneagram scientifically validated?", a: "The Enneagram has less academic validation than the Big Five but more than many popular frameworks. Research by Wagner (1981), Newgent et al. (2004), and others has found moderate psychometric support. Its primary value is as a self-development and relationship tool, supported by extensive clinical and coaching experience rather than purely empirical research." },
      { q: "Can my Enneagram type change?", a: "Your core type is generally considered stable throughout life — it forms in childhood. However, your level of health within your type (from average to healthy to unhealthy), your wing emphasis, and your stress/growth patterns can all shift significantly. Personal development doesn't change your type; it changes how you express it." },
      { q: "Do you store my answers?", a: "No. Everything is processed in your browser. Your answers are saved in localStorage so you can resume if you close the tab, but they are never sent to any server." },
    ],
    metaTitle: "Free Enneagram Test with Wing & Tritype | 1Test.me",
    metaDesc:
      "Free Enneagram personality test — see your type scored, plus your wing and tritype. Free basic results, optional full unlock. Also get DISC, 16 Personalities, and Strengths.",
  },

  personality: {
    slug: "personality",
    name: "16 Personalities",
    fullName: "16 Personalities Test",
    color: "#6366f1",
    icon: "■",
    heroSubtitle:
      "Discover your cognitive preferences — how you get energy, process information, make decisions, and structure your life. Plus get three more frameworks free.",
    what: "The 16 Personalities framework (based on Carl Jung's theory of cognitive functions, later developed into practical assessments by Katharine Cook Briggs and Isabel Briggs Myers) categorizes people along four dimensions, producing 16 distinct personality types. Each type is represented by a four-letter code like ENTP, ISFJ, or INTJ. This is the world's most popular personality framework — over 100 million people have taken some version of it. The framework measures cognitive preferences, not abilities. Being an 'Introvert' doesn't mean you can't give a great presentation — it means you recharge through alone time rather than social interaction. Being a 'Thinker' doesn't mean you don't have feelings — it means you naturally lead with logic when making decisions.",
    history:
      "Carl Jung published 'Psychological Types' in 1921, proposing that people have innate preferences for how they perceive the world and make decisions. In the 1940s, Katharine Cook Briggs and her daughter Isabel Briggs Myers developed a questionnaire to make Jung's theory accessible. Their assessment instrument became commercially available in 1962 and has been administered to hundreds of millions of people. Today, the 16 Personalities framework based on their work is widely available through platforms like 16Personalities.com, Truity, and our assessment. The underlying theory (the four dimensions, the 16 types, the cognitive functions) is in the public domain and not owned by any single company.",
    dimensionsTitle: "The 4 Dimensions",
    dimensions: [
      { name: "E/I — Extraversion vs. Introversion (Energy)", desc: "Where do you get your energy? Extraverts (E) are energized by interaction with others, think out loud, and prefer breadth of experience. Introverts (I) are energized by solitude, think before speaking, and prefer depth of experience. This is about energy management, not social skill — introverts can be excellent public speakers, and extraverts can enjoy solitude." },
      { name: "S/N — Sensing vs. Intuition (Information)", desc: "How do you take in information? Sensors (S) focus on concrete facts, details, and present reality. They trust experience and prefer proven methods. Intuitives (N) focus on patterns, possibilities, and future potential. They trust insights and prefer innovation. About 73% of the population are Sensors, making Intuitives a minority — which explains why 'big picture' thinkers sometimes feel misunderstood." },
      { name: "T/F — Thinking vs. Feeling (Decisions)", desc: "How do you make decisions? Thinkers (T) prioritize logic, consistency, and objective truth. They make decisions from the head. Feelers (F) prioritize harmony, values, and individual circumstances. They make decisions from the heart. This dimension has the strongest gender correlation — about 65% of women prefer Feeling and 65% of men prefer Thinking — though this is cultural as much as innate." },
      { name: "J/P — Judging vs. Perceiving (Structure)", desc: "How do you structure your life? Judgers (J) prefer planned, organized, decided. They like closure, lists, and deadlines. Perceivers (P) prefer flexible, spontaneous, open. They like keeping options open and adapting as they go. This is often the dimension people feel most strongly about — J types feel anxious without a plan, P types feel trapped by one." },
    ],
    interpretation: [
      "Your four-letter type is a starting point, not a box. No one is 100% Extraverted or 100% Introverted — we all exist on a spectrum for each dimension. Pay attention to the strength of each preference: a slight Thinking preference means you balance logic and values well, while a strong Thinking preference means you lead heavily with logic.",
      "The 16 types cluster into four temperaments: Analysts (NT), Diplomats (NF), Sentinels (SJ), and Explorers (SP). Your temperament often matters more than your specific four-letter type for predicting career satisfaction and communication style.",
      "Your type describes your natural preferences under normal conditions. Under stress, many people flip to their 'shadow' functions — an ENTP under extreme stress may behave like an unhealthy ISFJ, becoming hyper-focused on details and past hurts. This is temporary and part of normal type dynamics.",
      "The most valuable insight from 16 Personalities isn't knowing your own type — it's understanding that other types genuinely perceive the world differently. An ISTJ isn't being 'boring' when they want a detailed plan. An ENFP isn't being 'flaky' when they change direction. They're processing reality through different cognitive hardware.",
    ],
    useCases: [
      { title: "Career Planning", desc: "Your type strongly correlates with career satisfaction (not performance). ENTPs thrive in startup environments where they can brainstorm freely. ISTJs thrive in structured roles with clear expectations. Mismatched types and careers lead to chronic burnout." },
      { title: "Relationship Compatibility", desc: "Understanding your partner's type explains 80% of recurring conflicts. An ENTJ who makes fast decisions married to an INFP who needs time to process values isn't a mismatch — it's a communication gap with a known solution." },
      { title: "Team Composition", desc: "High-performing teams need cognitive diversity. A team of all NTs will produce brilliant strategies but miss human impact. A team of all SFs will build harmony but struggle with hard decisions. Balance matters." },
      { title: "Communication", desc: "Sensors want specifics and examples. Intuitives want concepts and possibilities. Thinkers want logical arguments. Feelers want personal relevance. Adjusting your communication to your audience's type dramatically improves reception." },
      { title: "Personal Growth", desc: "Your inferior function (the opposite of your dominant) is your growth edge. For ENTPs (dominant Intuition), developing Sensing — attention to details, follow-through, present-moment awareness — is the path to becoming a more complete person." },
    ],
    howItWorks: [
      "Our 120-question assessment measures 20 underlying strengths. These strengths map to the four personality dimensions through weighted correlations derived from personality psychology research.",
      "For example, high scores on Commander, Storyteller, and Catalyst strengths pull toward Extraversion. High scores on Thinker, Analyst, and Focus Expert pull toward Introversion. High Brainstormer and Strategist scores pull toward Intuition, while Time Keeper and Deliverer pull toward Sensing.",
      "Each dimension gets a confidence score showing how strongly you lean in one direction. A 90% Extraversion score means you're clearly an Extravert. A 55% score means you're near the middle — what some call an 'ambivert' — and could relate to both sides.",
      "Unlike commercial personality assessments (which can cost $50+ and only give you your type), our assessment gives you your type alongside DISC, Enneagram, and a full strengths ranking — four frameworks for the time investment of one.",
    ],
    whyOurs: [
      "Four frameworks from one 15-minute test — personality type, DISC, Enneagram, and strengths",
      "See your confidence score for each dimension, not just a binary letter",
      "Free basic results with option to unlock everything",
      "Based on the IPIP, a public domain instrument used in thousands of peer-reviewed studies",
      "Cross-reference your type with your DISC profile and Enneagram for a multi-dimensional understanding",
      "Privacy-first: your answers stay in your browser",
    ],
    comparison: [
      { aspect: "Price", others: "16Personalities: free basic, $32 premium. Truity TypeFinder: $19. Commercial assessments: $50+", ours: "Free" },
      { aspect: "Frameworks", others: "16 Personalities only", ours: "16 Personalities + DISC + Enneagram + Strengths" },
      { aspect: "Questions", others: "60–100+ depending on the assessment", ours: "120 questions, four frameworks" },
      { aspect: "Dimension scores", others: "Often just the 4 letters, no percentages", ours: "Percentage confidence for each dimension" },
      { aspect: "Account required", others: "Yes (16Personalities requires email for results)", ours: "No" },
      { aspect: "Additional insights", others: "One framework", ours: "Career paths, communication tips, stress patterns, books — powered by all four frameworks" },
    ],
    faqs: [
      { q: "Is this the same as commercial personality assessments?", a: "No. There are commercial personality assessments that measure the same four dimensions based on Jung's theory, but they are trademarked instruments. Our assessment measures the same four dimensions based on Jung's public-domain theory, similar to how 16Personalities.com and Truity's TypeFinder work. The underlying theory (E/I, S/N, T/F, J/P, 16 types) is not owned by anyone." },
      { q: "How accurate is it compared to commercial personality assessments?", a: "Studies show that different personality type instruments agree on your type about 75-85% of the time — whether you take a commercial assessment, 16Personalities, Truity, or our assessment. The remaining 15-25% disagreement usually occurs when someone is near the middle of one dimension. If you score 52% Thinking, you might test as T on one assessment and F on another." },
      { q: "Can my type change?", a: "Your core type tends to be stable, but the strength of your preferences can shift over time. Many people develop their weaker functions as they mature — a young ENTP who was 90% P might become 65% P in midlife as they develop more structure. The letters may stay the same even as the percentages shift." },
      { q: "Is personality type scientifically valid?", a: "The four dimensions have strong research support — particularly Extraversion/Introversion and Thinking/Feeling, which correlate well with Big Five personality traits. The main academic criticism is the 'type' model (putting people in 16 boxes) versus the 'trait' model (measuring on continuous scales). Our assessment gives you both — a type label plus dimensional percentages." },
      { q: "What's the difference between 16 Personalities and Big Five?", a: "The Big Five (OCEAN: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism) is the gold standard in academic psychology. The 16 Personalities framework is more practical for self-development and relationship understanding. They overlap significantly — Extraversion maps directly, Agreeableness ≈ Thinking/Feeling, Openness ≈ Sensing/Intuition." },
      { q: "Do you store my data?", a: "No. Your answers are processed entirely in your browser and saved in localStorage for session persistence. Nothing is sent to any server." },
    ],
    metaTitle: "Free 16 Personalities Test | 1Test.me",
    metaDesc:
      "Free 16 Personalities test with confidence scores — plus get your DISC, Enneagram, and Top 5 Strengths. Free basic results, optional full unlock.",
  },

  strengths: {
    slug: "strengths",
    name: "Strengths",
    fullName: "Top 5 Strengths Test",
    color: "#f59e0b",
    icon: "★",
    heroSubtitle:
      "Discover what you naturally do best — your top 5 strengths across 20 dimensions, organized in four domains. Plus get three more frameworks free.",
    what: "Strengths-based assessments identify your natural talents — the recurring patterns of thought, feeling, and behavior that come effortlessly and energize you. The strengths approach, pioneered by positive psychology researcher Martin Seligman and popularized through various commercial assessments, is built on a simple but powerful insight: you'll grow more by developing your strengths than by fixing your weaknesses. Our assessment measures 20 strengths across four domains: Doing (execution and organization), Thinking (analysis and ideas), Feeling (relationships and empathy), and Motivating (leadership and drive). Your top 5 strengths are your signature — the unique combination that defines how you contribute at your best.",
    history:
      "The strengths movement in psychology began with Martin Seligman's presidential address to the American Psychological Association in 1998, where he argued that psychology had become too focused on pathology and should also study what makes people thrive. This led to the VIA Character Strengths project (Peterson & Seligman, 2004) identifying 24 universal character strengths, and various commercial assessments identifying talent themes based on decades of research. Our assessment draws on the International Personality Item Pool (IPIP), a public domain item bank containing over 3,000 items validated against multiple psychological constructs, including the VIA character strengths. The specific 20-strength framework we use maps these items into practical, workplace-relevant categories.",
    dimensionsTitle: "The 4 Strength Domains",
    dimensions: [
      { name: "Doing", desc: "People strong in Doing know how to organize, meet goals, and make things happen. They are the executors — reliable, focused, and driven to deliver. Strengths: Believer (values-driven), Deliverer (follows through), Focus Expert (deep concentration), Problem Solver (diagnoses and fixes), Time Keeper (deadlines and processes)." },
      { name: "Thinking", desc: "People strong in Thinking absorb and analyze information, consider what could be, and generate ideas. They are the strategists — curious, analytical, and always exploring. Strengths: Analyst (data and logic), Brainstormer (creative ideas), Philomath (love of learning), Strategist (big picture), Thinker (intellectual depth)." },
      { name: "Feeling", desc: "People strong in Feeling build relationships that hold teams together and make them greater than the sum of their parts. They are the connectors — empathetic, adaptive, and socially intelligent. Strengths: Chameleon (adapts to any situation), Coach (develops others), Empathizer (reads emotions), Optimist (sees the bright side), Peacekeeper (builds bridges)." },
      { name: "Motivating", desc: "People strong in Motivating take charge, speak up, and ensure the team is heard. They are the catalysts — bold, persuasive, and driven to lead. Strengths: Catalyst (starts things), Commander (takes charge), Self-Believer (independent confidence), Storyteller (communicates powerfully), Winner (competitive drive)." },
    ],
    interpretation: [
      "Your top 5 strengths are your signature — lean into them. Research shows that people who use their strengths daily are 6x more likely to be engaged at work and 3x more likely to report excellent quality of life (Gallup, 2015).",
      "Your domain distribution matters as much as individual strengths. If your top 5 are all Thinking strengths, you're a powerhouse of ideas but may need teammates strong in Doing to execute them. Balance doesn't mean being good at everything — it means surrounding yourself with complementary people.",
      "Your bottom 5 strengths are not weaknesses to fix — they're areas to manage. Delegate, partner with others who are strong where you're not, or build systems that compensate. A Brainstormer who struggles with Time Keeping should use tools and partners, not force themselves to become something they're not.",
      "Strengths can become liabilities when overused. A Commander who always takes charge can stifle others' initiative. A Philomath who always wants to learn more can struggle to act on incomplete information. Self-awareness of your strengths' shadow side is as important as knowing the strengths themselves.",
    ],
    useCases: [
      { title: "Career Alignment", desc: "Your strengths predict where you'll thrive, not just what you can do. A Brainstormer-Strategist belongs in product innovation, not process compliance. A Deliverer-Time Keeper thrives in operations, not open-ended R&D. Match your role to your strengths for sustainable performance." },
      { title: "Team Building", desc: "Map your team's strengths to find gaps and overlaps. A team heavy on Thinking strengths needs a Doing-strong executor. A team of all Motivators needs a Feeling-strong peacekeeper. The best teams have diversity across all four domains." },
      { title: "Performance Reviews", desc: "Frame feedback around strengths, not just competencies. 'You're a natural Brainstormer — let's find ways to apply that more' is more motivating than 'You need to improve your time management.' Strengths-based feedback increases engagement and retention." },
      { title: "Hiring", desc: "Define roles by the strengths they require, then assess candidates against those strengths. A customer success role needs Coach + Empathizer + Optimist. A data analyst role needs Analyst + Focus Expert + Problem Solver. Cultural fit is about complementary strengths, not identical personalities." },
      { title: "Personal Development", desc: "The fastest path to excellence is developing your strengths, not remediating your weaknesses. If you're a natural Storyteller, invest in presentation coaching, writing workshops, and public speaking — not spreadsheet training." },
    ],
    howItWorks: [
      "Our assessment presents 120 statements, 6 for each of the 20 strengths. You rate each statement on a continuous slider from 'Strongly Disagree' to 'Strongly Agree.' The questions are shuffled so that you don't see all 6 questions for one strength in a row.",
      "For each strength, your 6 slider values are averaged (reversed items are flipped). This produces a score from 0 to 100 for each of the 20 strengths. All 20 scores are then ranked to produce your unique strength sequence.",
      "Your top 5 are your signature strengths — the ones that define how you operate at your best. Your bottom 5 reveal areas where you may need support or complementary partners. The middle 10 are your supporting strengths — they can be developed if needed but aren't your natural go-to.",
      "The same 120 answers also produce your 16 Personalities type, DISC profile, and Enneagram type through weighted derivation — no extra questions needed.",
    ],
whyOurs: [
      "Commercial strengths assessments cost $25–$60 — get your Top 5 free and unlock all 20 for less",
      "Four frameworks from one test — strengths, personality type, DISC, and Enneagram",
      "Based on the IPIP, a public domain research instrument used in thousands of academic studies",
      "Instant results in your browser — no account needed for free results",
      "See energizers and drainers for each strength, not just a name and definition",
      "Privacy-first: answers never leave your browser",
    ],
    comparison: [
      { aspect: "Price", others: "Other strengths tests: $25 (top 5 only) / $60 (full). HIGH5: free basic / $29 full. VIA: free basic / $49 full", ours: "Free, all 20 ranked" },
      { aspect: "Frameworks", others: "Strengths only", ours: "Strengths + 16 Personalities + DISC + Enneagram" },
      { aspect: "Questions", others: "120–177 depending on assessment", ours: "120 questions, four frameworks" },
      { aspect: "Strengths measured", others: "34 (Gallup), 24 (VIA), or 20 (HIGH5)", ours: "20 strengths, 4 domains" },
      { aspect: "Account required", others: "Yes", ours: "No" },
      { aspect: "Action insights", others: "Strengths descriptions only", ours: "Strengths + career paths + communication tips + stress patterns + books" },
    ],
    faqs: [
      { q: "How does this compare to other strengths assessments?", a: "Commercial strengths assessments typically measure 34 talent themes using a forced-choice format with a time limit per question. Our assessment measures 20 strengths using a Likert-scale format (sliders) with no time pressure. The frameworks are similar in concept but different in methodology. Commercial tools use ipsative scoring (choosing one statement forces down another), while ours is normative (each rating is independent). Both approaches have trade-offs." },
      { q: "Are 20 strengths enough? Other assessments have 34.", a: "More isn't necessarily better. Our 20 strengths cover the same four domains as other popular frameworks with enough granularity to produce actionable insights. The difference is that we also derive three additional frameworks (DISC, 16 Personalities, Enneagram) from the same data — something no 34-theme assessment offers." },
      { q: "Can my strengths change over time?", a: "Your core strengths are relatively stable — they reflect natural patterns that have been with you for most of your life. However, the relative ranking can shift as you develop, change roles, or go through major life experiences. Retaking the assessment every 1-2 years can reveal interesting shifts." },
      { q: "Should I focus on my strengths and ignore my weaknesses?", a: "Focus on your strengths for excellence, manage your weaknesses to prevent failure. If your bottom strength is Time Keeper, you don't need to become great at it — you need a system (calendar, partner, tool) that prevents it from derailing you. Invest development energy in your top 5." },
      { q: "Is this based on real science?", a: "Yes. Our questions come from the International Personality Item Pool (IPIP), a public domain item bank created by psychologist Lewis Goldberg and used in thousands of peer-reviewed studies. The IPIP-VIA scales have been validated against the VIA Character Strengths survey (Peterson & Seligman, 2004) and show strong psychometric properties (Cronbach's alpha > 0.70 for all scales)." },
      { q: "Do you store my data?", a: "No. Your answers are processed entirely in your browser using JavaScript. Progress is saved in localStorage so you can resume, but nothing is sent to any server." },
    ],
    metaTitle: "Free Strengths Test — Top 5 of 20 | 1Test.me",
    metaDesc:
      "Free strengths assessment — your Top 5 strengths free, plus DISC, 16 Personalities, and Enneagram from one 15-minute test. Optional full unlock for all 20.",
  },
};
