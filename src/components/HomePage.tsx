import { useEffect } from "react";
import { Link } from "react-router-dom";
import { SEOHead } from "./SEOHead";
import { trackCTAClicked, trackHomepageView, trackHeroCTAClick, trackFrameworkCardClick } from "../utils/analytics";

const FRAMEWORKS = [
  {
    icon: "&#9733;",
    color: "#f59e0b",
    name: "Strengths",
    description: "Your natural strengths, ranked — Discover what you do best without trying. 20 strengths ranked from strongest to developing, with practical guidance on how to use each one.",
  },
  {
    icon: "&#9632;",
    color: "#6366f1",
    name: "16 Personalities",
    description: "Your cognitive preferences — Understand how you process information, make decisions, and recharge. Your four-letter type with a full profile.",
  },
  {
    icon: "&#9650;",
    color: "#e53e3e",
    name: "DISC",
    description: "Your communication style — Learn how you come across to others, what drives you, and how to adapt your style when working with different people.",
  },
  {
    icon: "&#9675;",
    color: "#10b981",
    name: "Enneagram",
    description: "Your core motivation — Go deeper than behavior. The Enneagram reveals the why behind what you do — your fundamental drive, fear, and growth path.",
  },
];

const STEPS = [
  { number: "1", title: "Answer 120 questions", body: "about how you naturally think, decide, and interact. Takes 10\u201315 minutes." },
  { number: "2", title: "Get 4 results at once", body: "\u2014 Strengths, 16 Personalities, DISC, Enneagram. No need to take separate tests." },
  { number: "3", title: "Explore your profile", body: "\u2014 see what makes you unique, how you work with others, and what comes next." },
];

const FREE_FEATURES = [
  "Top 5 strengths with descriptions",
  "Personality type + summary",
  "DISC style + summary",
  "Enneagram type + summary",
  "Shareable result card",
  "No credit card required",
];

const PAID_FEATURES = [
  "All 20 strengths ranked with detailed descriptions",
  "Complete 16 Personalities deep-dive",
  "Complete DISC profile with communication tips",
  "Complete Enneagram profile with growth path",
  "Career paths matched to your profile",
  "PDF export for offline reference",
];

export function HomePage() {
  useEffect(() => {
    trackHomepageView();
  }, []);

  const handleHeroCTA = () => {
    trackHeroCTAClick("Start Free Assessment");
    trackCTAClicked({ ctaText: "Start Free Assessment", ctaLocation: "intro_hero", pagePath: "/" });
  };

  const handleSecondaryCTA = () => {
    trackHeroCTAClick("See How It Works");
    trackCTAClicked({ ctaText: "See How It Works", ctaLocation: "intro_hero", pagePath: "/" });
  };

  const handleFrameworkCardClick = (fw: string) => {
    trackFrameworkCardClick(fw);
  };

  return (
    <div className="homepage">
      <SEOHead
        title="Free Personality Test \u2014 Strengths, 16 Types, DISC, Enneagram | 1Test"
        description="Take one free 15-minute test and get your Strengths, 16 Personalities, DISC, and Enneagram results. No extra tests needed. Free results, always."
        canonicalUrl="https://1test.me/"
      />

      <section className="hero">
        <h1 className="hero-headline">One test. Four frameworks. Know yourself.</h1>
        <p className="hero-subtitle">
          Discover your strengths, personality type, communication style, and inner motivations
          \u2014 all from a single free assessment. No sign-up required.
        </p>
        <div className="hero-ctas">
          <Link to="/test" className="btn-start hero-cta-primary" onClick={handleHeroCTA}>
            Start Free Assessment
          </Link>
          <a href="#how-it-works" className="hero-cta-secondary" onClick={handleSecondaryCTA}>
            See How It Works
          </a>
        </div>
        <div className="trust-bar">
          <span className="trust-item">&#9989; 100% free</span>
          <span className="trust-item">&#128274; Private results</span>
          <span className="trust-item">&#127891; Research-backed</span>
          <span className="trust-item">4 frameworks in one test</span>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works">
        <h2 className="section-headline">One test. Your complete personality picture.</h2>
        <div className="steps">
          {STEPS.map((step) => (
            <div key={step.number} className="step">
              <span className="step-number">{step.number}</span>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-body">{step.body}</p>
            </div>
          ))}
        </div>
        <div className="section-cta">
          <Link to="/test" className="btn-start" onClick={handleHeroCTA}>
            Start Your Free Assessment
          </Link>
        </div>
      </section>

      <section className="framework-cards-section">
        <h2 className="section-headline">Four frameworks. One complete picture.</h2>
        <div className="framework-cards-grid">
          {FRAMEWORKS.map((fw) => (
            <div key={fw.name} className="fw-card" onClick={() => handleFrameworkCardClick(fw.name)} style={{ cursor: "pointer" }}>
              <span className="fw-card-icon" style={{ color: fw.color }} dangerouslySetInnerHTML={{ __html: fw.icon }} />
              <h3 className="fw-card-name">{fw.name}</h3>
              <p className="fw-card-desc">{fw.description}</p>
            </div>
          ))}
        </div>
        <p className="framework-cards-footer">
          All four results from one free test. No separate assessments needed.
        </p>
      </section>

      <section className="comparison-section">
        <h2 className="section-headline">Your free results are genuinely useful.</h2>
        <div className="comparison-grid">
          <div className="comparison-col comparison-free">
            <h3 className="comparison-tier">Free</h3>
            <ul className="comparison-features">
              {FREE_FEATURES.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <Link to="/test" className="btn-start comparison-cta" onClick={handleHeroCTA}>
              Take the Free Test
            </Link>
          </div>
          <div className="comparison-col comparison-paid">
            <span className="comparison-badge">Most Popular</span>
            <h3 className="comparison-tier">Full Profile \u2014 $12</h3>
            <p className="comparison-paid-note">Everything in Free, plus:</p>
            <ul className="comparison-features">
              {PAID_FEATURES.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <Link to="/pricing" className="btn-start comparison-cta" onClick={() => trackCTAClicked({ ctaText: "See All Plans", ctaLocation: "intro_hero", pagePath: "/" })}>
              See All Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
