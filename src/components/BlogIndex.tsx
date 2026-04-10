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
        <button className="btn-start" onClick={() => navigate("/")}>
          Take the Free Test &rarr;
        </button>
      </div>
    </div>
  );
}