import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SEOHead, buildFAQSchema, buildArticleSchema } from "./SEOHead";
import { trackTestStarted, trackCTAClicked } from "../utils/analytics";
import { blogPosts } from "../data/blog-content";

interface Props {
  slug: string;
}

export function BlogPage({ slug }: Props) {
  const navigate = useNavigate();
  const post = blogPosts[slug];

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
          <section key={i} className="blog-section">
            {section.heading && <h2>{section.heading}</h2>}
            <div
              className="content-html"
              dangerouslySetInnerHTML={{ __html: section.html }}
            />
          </section>
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