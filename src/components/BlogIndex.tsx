import { SEOHead } from "./SEOHead";
import { useNavigate } from "react-router-dom";

const POSTS = [
  {
    slug: "best-free-strengths-assessment",
    title: "Best Free Strengths Assessment in 2026 — Complete Comparison",
    description:
      "Compare free strengths assessments: 1Test, HIGH5, Truity, VIA. Full results vs paywall, actionable insights, and which test is right for you.",
  },
  {
    slug: "disc-communication-styles",
    title: "DISC Communication Styles — Work Better With Every Type",
    description:
      "Learn the four DISC communication styles and how to adapt your approach for Dominance, Influence, Steadiness, and Conscientiousness. Free DISC test included.",
  },
  {
    slug: "enneagram-career-paths",
    title: "Enneagram Career Paths — What Your Type Means for Your Work",
    description:
      "Explore career paths for each Enneagram type. Learn which environments energize you, which drain you, and how to use your type for career decisions. Free Enneagram test.",
  },
  {
    slug: "personality-test-for-career",
    title: "Personality Test for Career — Find Work That Fits You",
    description:
      "Learn how your personality type connects to career fit. Practical guidance for every type. Take the free personality test with career insights.",
  },
  {
    slug: "disc-vs-enneagram-vs-strengths",
    title: "DISC vs Enneagram vs Strengths — Which Free Test Is Right for You?",
    description:
      "Not sure which personality assessment to take? Compare DISC, Enneagram, Strengths, and 16 Personalities side by side. Take all four free at 1Test.",
  },
  {
    slug: "which-personality-test-right-for-you",
    title: "Which Personality Test Is Right for You? Free Guide",
    description:
      "Not sure which personality test to take? This guide compares DISC, Enneagram, Strengths, and 16 Personalities so you can pick the right one — or take all four free at 1Test.",
  },
  {
    slug: "understanding-16-personalities",
    title: "16 Personalities Explained — Complete Guide to the Framework",
    description:
      "What are the 16 Personalities? Learn what each type means, how the framework works, and how it relates to DISC, Enneagram, and Strengths. Take all four free at 1Test.",
  },
  {
    slug: "disc-assessment-guide",
    title: "DISC Assessment Guide — What It Is, How It Works, Why It Matters",
    description:
      "Complete guide to the DISC assessment: what it measures, how to read your profile, and how to use DISC at work and in teams. Take the free DISC test at 1Test.",
  },
];

export function BlogIndex() {
  const navigate = useNavigate();

  return (
    <div className="blog-index">
      <SEOHead
        title="Blog — 1Test"
        description="Personality insights, framework guides, and practical self-development advice. Learn about Strengths, DISC, Enneagram, and 16 Personalities."
        canonicalUrl="https://1test.me/blog"
      />

      <header className="blog-index-header">
        <h1>1Test Blog</h1>
        <p>
          Personality insights, framework guides, and practical advice for
          understanding yourself better.
        </p>
      </header>

      <div className="blog-index-grid">
        {POSTS.map((post) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="blog-index-card"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/blog/${post.slug}`);
            }}
          >
            <h2>{post.title}</h2>
            <p>{post.description}</p>
          </a>
        ))}
      </div>

      <div className="landing-cta">
        <h2>Ready to discover your personality?</h2>
        <p>One test. Four frameworks. Completely free. ~15 minutes.</p>
        <button className="btn-start" onClick={() => navigate("/test")}>
          Take the Free Test &rarr;
        </button>
      </div>
    </div>
  );
}