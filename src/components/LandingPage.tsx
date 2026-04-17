import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { frameworkContent } from "../data/landing-content";
import { trackTestStarted, trackCTAClicked } from "../utils/analytics";
import { SEOHead, buildFAQSchema } from "./SEOHead";

interface Props {
  framework: string;
}

const FRAMEWORK_COLORS: Record<string, string> = {
  disc: "#e53e3e",
  enneagram: "#7c3aed",
  personality: "#6366f1",
  strengths: "#f59e0b",
};

const FRAMEWORK_ICONS: Record<string, string> = {
  disc: "\u25C6",
  enneagram: "\u25CE",
  personality: "\u25A0",
  strengths: "\u2605",
};

export function LandingPage({ framework }: Props) {
  const navigate = useNavigate();
  const fw = frameworkContent[framework];

  const handleCTA = useCallback((location: "landing_hero" | "landing_bottom") => {
    trackTestStarted(
      framework as "disc" | "personality" | "enneagram" | "strengths",
      `/free-${framework}-test`
    );
    trackCTAClicked({
      ctaText: location === "landing_hero" ? "Take the Free Test →" : "Start the Assessment →",
      ctaLocation: location,
      pagePath: `/free-${framework}-test`,
    });
    navigate("/");
  }, [framework, navigate]);

  if (!fw) {
    navigate("/");
    return null;
  }

  const faqSchema = buildFAQSchema(fw.faqs);

  return (
    <div className="landing">
      <SEOHead
        title={fw.metaTitle}
        description={fw.metaDesc}
        canonicalUrl={fw.canonicalUrl}
        jsonLd={[faqSchema]}
      />

      <div className="landing-hero">
        <span
          className="landing-icon"
          style={{ color: FRAMEWORK_COLORS[framework] }}
        >
          {FRAMEWORK_ICONS[framework]}
        </span>
        <h1>{fw.h1}</h1>
        <div
          className="landing-tagline"
          dangerouslySetInnerHTML={{ __html: fw.intro }}
        />
        <div className="trust-bar">
          <span className="trust-item">&#9989; 100% free</span>
          <span className="trust-item">&#128274; Private results</span>
          <span className="trust-item">&#127891; Research-backed</span>
        </div>
        <button className="btn-start" onClick={() => handleCTA("landing_hero")}>
          Take the Free Test &rarr;
        </button>
      </div>

      {fw.sections.map((section, i) => (
        <section key={i} className="landing-section">
          <h2>{section.heading}</h2>
          <div
            className="content-html"
            dangerouslySetInnerHTML={{ __html: section.html }}
          />
        </section>
      ))}

      <section className="landing-section">
        <h2>Frequently Asked Questions</h2>
        <div className="landing-faqs">
          {fw.faqs.map((faq) => (
            <details key={faq.question} className="landing-faq">
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="landing-cta">
        <h2>Ready to discover your {fw.name.toLowerCase()}?</h2>
        <p>One test. Four frameworks. Completely free. ~15 minutes.</p>
        <button className="btn-start" onClick={() => handleCTA("landing_bottom")}>
          Start the Assessment &rarr;
        </button>
      </div>

      <div className="landing-crosslinks">
        <p className="landing-crosslinks-label">
          Get the complete picture with all four frameworks:
        </p>
        <div className="landing-crosslinks-grid">
          {fw.crossLinks.map((link) => (
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

      <p className="intro-credit">
        Based on public domain research from the{" "}
        <a href="https://ipip.ori.org/" target="_blank" rel="noopener">
          International Personality Item Pool
        </a>
        . Not affiliated with any trademark holder.{" "}
        <a href="/privacy-draft">Privacy</a> &middot; <a href="/terms-draft">Terms</a>
      </p>
    </div>
  );
}