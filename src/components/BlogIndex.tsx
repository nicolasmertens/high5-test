import { SEOHead } from "./SEOHead";
import { useNavigate } from "react-router-dom";
import { blogPosts } from "../data/blog-content";

const CATEGORIES = [
  { label: "DISC", filter: (slug: string) => slug.startsWith("disc-") || slug.includes("-disc-") },
  { label: "Enneagram", filter: (slug: string) => slug.startsWith("enneagram-") || slug.includes("-enneagram-") },
  { label: "16 Personalities", filter: (slug: string) => slug.startsWith("16-personalities") || slug.includes("16-personalities") || slug.endsWith("-personality-type") },
  { label: "Strengths", filter: (slug: string) => slug.startsWith("strengths-") || slug.includes("-strengths") },
  { label: "Career", filter: (slug: string) => slug.includes("career") || slug.includes("job") || slug.includes("work") || slug.includes("manager") },
  { label: "Relationships", filter: (slug: string) => slug.includes("relationship") || slug.includes("couple") || slug.includes("friend") || slug.includes("compati") },
];

const ALL_POSTS = Object.values(blogPosts).map((post) => ({
  slug: post.slug,
  title: post.metaTitle,
  description: post.metaDesc,
}));

export function BlogIndex() {
  const navigate = useNavigate();

  return (
    <div className="blog-index">
      <SEOHead
        title="Blog — 1Test | Personality Test Guides & Insights"
        description="100+ guides on DISC, Enneagram, 16 Personalities, and Strengths assessments. Practical advice for career, teams, and personal growth."
        canonicalUrl="https://1test.me/blog"
      />

      <header className="blog-index-header">
        <h1>1Test Blog</h1>
        <p>
          Personality insights, framework guides, and practical advice for
          understanding yourself and working better with others.
        </p>
      </header>

      <nav className="blog-category-nav" aria-label="Blog categories">
        {CATEGORIES.map((cat) => (
          <a
            key={cat.label}
            href={`#cat-${cat.label.toLowerCase().replace(/\s+/g, "-")}`}
            className="blog-category-pill"
          >
            {cat.label}
          </a>
        ))}
      </nav>

      {CATEGORIES.map((cat) => {
        const posts = ALL_POSTS.filter((p) => cat.filter(p.slug));
        if (posts.length === 0) return null;
        return (
          <section
            key={cat.label}
            id={`cat-${cat.label.toLowerCase().replace(/\s+/g, "-")}`}
            className="blog-category-section"
          >
            <h2 className="blog-category-heading">{cat.label}</h2>
            <div className="blog-index-grid">
              {posts.map((post) => (
                <a
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="blog-index-card"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/blog/${post.slug}`);
                  }}
                >
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                </a>
              ))}
            </div>
          </section>
        );
      })}

      <section className="blog-category-section">
        <h2 className="blog-category-heading">All Posts ({ALL_POSTS.length})</h2>
        <div className="blog-index-grid">
          {ALL_POSTS.map((post) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="blog-index-card"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/blog/${post.slug}`);
              }}
            >
              <h3>{post.title}</h3>
              <p>{post.description}</p>
            </a>
          ))}
        </div>
      </section>

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
