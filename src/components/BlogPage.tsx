import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SEOHead, buildFAQSchema, buildArticleSchema } from "./SEOHead";
import { trackTestStarted, trackCTAClicked } from "../utils/analytics";
import { blogPosts } from "../data/blog-content";

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  disc: ["disc", "dominance", "influence", "steadiness", "conscientiousness", "behavioral", "communication-style"],
  enneagram: ["enneagram", "ennea", "type-1", "type-2", "type-3", "type-4", "type-5", "type-6", "type-7", "type-8", "type-9"],
  personality: ["16-personalities", "16p", "mbti", "introvert", "extrovert", "intuitive", "sensing", "feeling", "thinking", "judging", "perceiving"],
  strengths: ["strengths", "talent", "gallup", "clifton"],
  career: ["career", "job", "work", "manager", "leadership", "remote", "team"],
  relationships: ["relationship", "couple", "friend", "compati", "partner"],
};

function getRelatedPosts(currentSlug: string, limit = 3): Array<{ slug: string; title: string; description: string }> {
  const allSlugs = Object.keys(blogPosts).filter((s) => s !== currentSlug);

  // find which category current slug belongs to
  const currentCategories = Object.entries(CATEGORY_KEYWORDS)
    .filter(([, kws]) => kws.some((kw) => currentSlug.includes(kw)))
    .map(([cat]) => cat);

  // score each candidate by shared category + keyword overlap
  const scored = allSlugs.map((s) => {
    const sharedCategories = Object.entries(CATEGORY_KEYWORDS)
      .filter(([, kws]) => kws.some((kw) => s.includes(kw)))
      .map(([cat]) => cat)
      .filter((cat) => currentCategories.includes(cat)).length;
    // bonus for shared slug tokens
    const currentTokens = currentSlug.split("-");
    const candidateTokens = s.split("-");
    const sharedTokens = candidateTokens.filter((t) => t.length > 3 && currentTokens.includes(t)).length;
    return { slug: s, score: sharedCategories * 3 + sharedTokens };
  });

  scored.sort((a, b) => b.score - a.score || Math.random() - 0.5);

  return scored.slice(0, limit).map(({ slug }) => ({
    slug,
    title: blogPosts[slug].metaTitle,
    description: blogPosts[slug].metaDesc,
  }));
}

interface Props {
  slug: string;
}

export function BlogPage({ slug }: Props) {
  const navigate = useNavigate();
  const post = blogPosts[slug];
  const relatedPosts = useMemo(() => getRelatedPosts(slug), [slug]);

  const handleCTA = useCallback(() => {
    if (post) {
      trackTestStarted(post.ctaFramework, post.ctaUrl);
      trackCTAClicked({
        ctaText: "Take the Free Test",
        ctaLocation: "landing_bottom",
        pagePath: `/blog/${slug}`,
      });
    }
    navigate("/test");
  }, [post, navigate, slug]);

  if (!post) {
    navigate("/test");
    return null;
  }

  const faqSchema = post.faqs.length > 0 ? buildFAQSchema(post.faqs) : null;
  const articleSchema = buildArticleSchema({
    headline: post.h1,
    description: post.metaDesc,
    url: post.canonicalUrl,
    datePublished: post.datePublished,
    dateModified: post.datePublished,
  });

  const jsonLd = [articleSchema, ...(faqSchema ? [faqSchema] : [])];

  return (
    <div className="blog">
      <SEOHead
        title={post.metaTitle}
        description={post.metaDesc}
        canonicalUrl={post.canonicalUrl}
        jsonLd={jsonLd}
        ogType="article"
      />

      <article className="blog-article">
        <header className="blog-header">
          <h1>{post.h1}</h1>
        </header>

        {post.sections.map((section, i) => (
          <>
            <section key={i} className="blog-section">
              {section.heading && <h2>{section.heading}</h2>}
              <div
                className="content-html"
                dangerouslySetInnerHTML={{ __html: section.html }}
              />
            </section>
            {i === 2 && (
              <aside key="mid-cta" className="blog-mid-cta">
                <div className="blog-mid-cta-inner">
                  <p className="blog-mid-cta-label">Free personality test</p>
                  <p className="blog-mid-cta-text">
                    Discover your {post.ctaFramework === "strengths" ? "top 5 strengths" : post.ctaFramework === "disc" ? "DISC profile" : post.ctaFramework === "enneagram" ? "Enneagram type" : "personality type"} — plus DISC, Enneagram, and 16 Personalities. One test, all four frameworks.
                  </p>
                  <button className="blog-mid-cta-btn" onClick={() => {
                    trackCTAClicked({ ctaText: "Take the free test", ctaLocation: "blog_mid_article", pagePath: `/blog/${slug}` });
                    navigate("/test");
                  }}>
                    Take the free test &rarr;
                  </button>
                </div>
              </aside>
            )}
          </>
        ))}

        {post.faqs.length > 0 && (
          <section className="blog-section">
            <h2>Frequently Asked Questions</h2>
            <div className="landing-faqs">
              {post.faqs.map((faq) => (
                <details key={faq.question} className="landing-faq">
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}
      </article>

      {relatedPosts.length > 0 && (
        <section className="blog-related">
          <h2 className="blog-related-heading">Related Articles</h2>
          <div className="blog-related-grid">
            {relatedPosts.map((p) => (
              <a
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="blog-related-card"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/blog/${p.slug}`);
                }}
              >
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      <div className="landing-cta">
        <h2>{post.ctaHeading}</h2>
        <p>{post.ctaSubtext}</p>
        <button className="btn-start" onClick={handleCTA}>
          Take the Free Test &rarr;
        </button>
      </div>

      <div className="landing-crosslinks">
        <p className="landing-crosslinks-label">
          Explore all four frameworks:
        </p>
        <div className="landing-crosslinks-grid">
          {post.crossLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              className="landing-crosslink-card"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}