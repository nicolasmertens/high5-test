import { useNavigate } from "react-router-dom";

interface FrameworkInfo {
  slug: string;
  name: string;
  fullName: string;
  color: string;
  icon: string;
  what: string;
  dimensions: { name: string; desc: string }[];
  whyOurs: string[];
  metaDesc: string;
}

const frameworks: Record<string, FrameworkInfo> = {
  disc: {
    slug: "disc",
    name: "DISC",
    fullName: "DISC Personality Assessment",
    color: "#e53e3e",
    icon: "◆",
    what: "DISC measures your behavioral style across four dimensions: how you handle problems (Dominance), how you influence others (Influence), how you respond to pace (Steadiness), and how you approach rules (Conscientiousness). Created by psychologist William Marston in 1928, it's one of the most widely used workplace assessments in the world.",
    dimensions: [
      { name: "D — Dominance", desc: "Direct, results-oriented, competitive. Driven to overcome challenges." },
      { name: "I — Influence", desc: "Enthusiastic, optimistic, collaborative. Driven to persuade and inspire." },
      { name: "S — Steadiness", desc: "Patient, reliable, supportive. Driven to maintain harmony." },
      { name: "C — Conscientiousness", desc: "Analytical, systematic, quality-focused. Driven to ensure accuracy." },
    ],
    whyOurs: [
      "Most DISC tests only give you DISC — ours gives you DISC plus three more frameworks",
      "No account required, no email gate — see your results instantly",
      "Based on public domain research, not a proprietary black box",
    ],
    metaDesc: "Free DISC personality test — plus get your 16 Personalities, Enneagram, and Top 5 Strengths from the same assessment. No signup required.",
  },
  enneagram: {
    slug: "enneagram",
    name: "Enneagram",
    fullName: "Enneagram Personality Test",
    color: "#7c3aed",
    icon: "◎",
    what: "The Enneagram maps nine core personality types, each driven by a distinct motivation and fear. Unlike behavioral assessments, it reveals why you do what you do — your deepest drivers, defense mechanisms, and growth paths. It's used in therapy, coaching, spiritual direction, and increasingly in the workplace.",
    dimensions: [
      { name: "Type 1 — The Reformer", desc: "Principled, purposeful, perfectionist. Fears being corrupt." },
      { name: "Type 2 — The Helper", desc: "Generous, people-pleasing, possessive. Fears being unloved." },
      { name: "Type 3 — The Achiever", desc: "Adaptable, driven, image-conscious. Fears being worthless." },
      { name: "Type 4 — The Individualist", desc: "Expressive, dramatic, temperamental. Fears having no identity." },
      { name: "Type 5 — The Investigator", desc: "Perceptive, innovative, isolated. Fears being incapable." },
      { name: "Type 6 — The Loyalist", desc: "Responsible, anxious, suspicious. Fears being without support." },
      { name: "Type 7 — The Enthusiast", desc: "Spontaneous, versatile, scattered. Fears being trapped." },
      { name: "Type 8 — The Challenger", desc: "Confident, decisive, confrontational. Fears being controlled." },
      { name: "Type 9 — The Peacemaker", desc: "Receptive, reassuring, complacent. Fears loss and conflict." },
    ],
    whyOurs: [
      "Most Enneagram tests are 144+ questions — ours derives your type from 120 questions alongside three other frameworks",
      "See your full spectrum (all 9 types scored), wing, and tritype",
      "Completely free, no account required",
    ],
    metaDesc: "Free Enneagram personality test with wing and tritype — plus get your DISC, 16 Personalities, and Top 5 Strengths from one assessment.",
  },
  personality: {
    slug: "personality",
    name: "16 Personalities",
    fullName: "16 Personalities Test",
    color: "#6366f1",
    icon: "■",
    what: "The 16 Personalities framework (based on Jung's theory of cognitive functions) categorizes people along four dimensions: where you get energy (Extraversion/Introversion), how you take in information (Sensing/Intuition), how you make decisions (Thinking/Feeling), and how you structure your life (Judging/Perceiving). The result is one of 16 types like ENTP, ISFJ, or INTJ.",
    dimensions: [
      { name: "E/I — Energy", desc: "Extraversion (outward focus) vs. Introversion (inward focus)" },
      { name: "S/N — Information", desc: "Sensing (concrete facts) vs. Intuition (patterns and possibilities)" },
      { name: "T/F — Decisions", desc: "Thinking (logic-first) vs. Feeling (values-first)" },
      { name: "J/P — Structure", desc: "Judging (planned and organized) vs. Perceiving (flexible and spontaneous)" },
    ],
    whyOurs: [
      "Other personality tests charge $50+ or require long 177-question assessments",
      "We derive your type alongside DISC, Enneagram, and Strengths — four frameworks, one sitting",
      "See your confidence score for each dimension, not just a binary letter",
    ],
    metaDesc: "Free 16 Personalities test — plus get your DISC, Enneagram, and Top 5 Strengths from one 15-minute assessment. No signup required.",
  },
  strengths: {
    slug: "strengths",
    name: "Strengths",
    fullName: "Top 5 Strengths Test",
    color: "#f59e0b",
    icon: "★",
    what: "Strengths-based assessments identify your natural talents — recurring patterns of thought, feeling, and behavior that come naturally and energize you. Rather than fixing weaknesses, the strengths approach focuses on doubling down on what you're already great at. Our assessment measures 20 strengths across four domains: Doing, Thinking, Feeling, and Motivating.",
    dimensions: [
      { name: "Doing", desc: "Organize, meet goals, and make things happen. (Believer, Deliverer, Focus Expert, Problem Solver, Time Keeper)" },
      { name: "Thinking", desc: "Absorb and analyze information, consider what could be. (Analyst, Brainstormer, Philomath, Strategist, Thinker)" },
      { name: "Feeling", desc: "Build relationships that hold teams together. (Chameleon, Coach, Empathizer, Optimist, Peacekeeper)" },
      { name: "Motivating", desc: "Take charge, speak up, drive others forward. (Catalyst, Commander, Self-Believer, Storyteller, Winner)" },
    ],
    whyOurs: [
      "Similar assessments charge $25-60 — ours is completely free",
      "120 questions based on the IPIP public domain research (used by thousands of academic studies)",
      "Plus you get DISC, 16 Personalities, and Enneagram from the same test",
    ],
    metaDesc: "Free strengths assessment — discover your Top 5 strengths across 20 dimensions, plus get your DISC, 16 Personalities, and Enneagram results.",
  },
};

interface Props {
  framework: string;
}

export function LandingPage({ framework }: Props) {
  const navigate = useNavigate();
  const fw = frameworks[framework];

  if (!fw) {
    navigate("/");
    return null;
  }

  const otherFrameworks = Object.values(frameworks).filter(
    (f) => f.slug !== framework
  );

  return (
    <div className="landing">
      <div className="landing-hero">
        <span className="landing-icon" style={{ color: fw.color }}>
          {fw.icon}
        </span>
        <span className="beta-badge">BETA</span>
        <h1>Free {fw.fullName}</h1>
        <p className="landing-tagline">
          Take one 15-minute test — get your {fw.name} results{" "}
          <strong>plus three more frameworks</strong>, no extra tests needed.
        </p>
        <button className="btn-start" onClick={() => navigate("/")}>
          Take the Free Test &rarr;
        </button>
      </div>

      <section className="landing-section">
        <h2>What is {fw.name}?</h2>
        <p>{fw.what}</p>
      </section>

      <section className="landing-section">
        <h2>
          {fw.name === "16 Personalities"
            ? "The 4 Dimensions"
            : fw.name === "Enneagram"
              ? "The 9 Types"
              : fw.name === "DISC"
                ? "The 4 Dimensions"
                : "The 4 Domains"}
        </h2>
        <div className="landing-dims">
          {fw.dimensions.map((d) => (
            <div key={d.name} className="landing-dim">
              <h4>{d.name}</h4>
              <p>{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <h2>Why take {fw.name} on 1Test?</h2>
        <ul className="landing-reasons">
          {fw.whyOurs.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </section>

      <section className="landing-section landing-also">
        <h2>You'll also get</h2>
        <p className="landing-also-sub">
          From the same 120 questions, we derive your results across all four
          frameworks:
        </p>
        <div className="landing-also-grid">
          {otherFrameworks.map((f) => (
            <div
              key={f.slug}
              className="landing-also-card"
              onClick={() => navigate(`/free-${f.slug}-test`)}
            >
              <span className="landing-also-icon" style={{ color: f.color }}>
                {f.icon}
              </span>
              <span className="landing-also-name">{f.name}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="landing-cta">
        <h2>Ready?</h2>
        <p>
          One test. Four frameworks. Completely free. ~15 minutes.
        </p>
        <button className="btn-start" onClick={() => navigate("/")}>
          Start the Assessment &rarr;
        </button>
      </div>

      <p className="intro-credit">
        Based on public domain research from the{" "}
        <a href="https://ipip.ori.org/" target="_blank" rel="noopener">
          International Personality Item Pool
        </a>
        . Not affiliated with Myers-Briggs, Gallup, Wiley, or any trademark
        holder.
      </p>
    </div>
  );
}
