import { SEOHead } from "./SEOHead";

const TIERS = [
  {
    name: "Free",
    price: "$0",
    description: "Your top 5 strengths, plus a preview of all four frameworks.",
    features: [
      "Top 5 Strengths with descriptions",
      "Personality type preview (16 Personalities)",
      "DISC style preview",
      "Enneagram type preview",
      "Shareable results card",
      "Invite colleagues for relationship reports",
    ],
    cta: "Take the Free Test",
    ctaLink: "/test",
    highlight: false,
  },
  {
    name: "Full Profile",
    price: "$12",
    description: "Your complete profile across all four frameworks.",
    features: [
      "All 20 strengths ranked with detailed insights",
      "Full personality type breakdown with dimension scores",
      "Complete DISC profile with traits and communication tips",
      "Enneagram wing, tritype, and stress/growth patterns",
      "Career paths, book recommendations, stress patterns",
      "Unified profile combining all four frameworks",
    ],
    cta: "Unlock Full Profile",
    ctaLink: "/test",
    highlight: true,
  },
  {
    name: "AI Playbook",
    price: "$19",
    description: "Personalized career paths, growth plan, and communication guide — AI-generated per your profile.",
    features: [
      "Career paths matched to your unique profile",
      "Personalized growth plan with actionable steps",
      "Book and course recommendations per your strengths",
      "Communication guide based on your personality type",
      "Includes everything in the Full Profile",
    ],
    cta: "Get AI Playbook",
    ctaLink: "/test",
    highlight: false,
  },
  {
    name: "Team",
    price: "$29",
    period: "/mo per seat",
    description: "Team insights, relationship reports, and a manager dashboard.",
    features: [
      "Everything in AI Playbook",
      "Invite colleagues and compare profiles",
      "Relationship reports: how your profiles interact",
      "Team strength maps",
      "Meeting prep tips for specific colleagues",
      "Manager dashboard",
    ],
    cta: "Start a Team",
    ctaLink: "/test",
    highlight: false,
    comingSoon: true,
  },
];

export function PricingPage() {
  return (
    <div className="pricing">
      <SEOHead
        title="1Test Pricing \u2014 Free Results, Always"
        description="Your free assessment gives you real value. Paid tiers go deeper when you're ready. Strengths, 16 Personalities, DISC, Enneagram \u2014 all from one test."
        canonicalUrl="https://1test.me/pricing"
      />

      <header className="pricing-header">
        <h1>Free Results, Always</h1>
        <p>
          Your free assessment gives you real value. Paid tiers go deeper when
          you are ready.
        </p>
      </header>

      <div className="pricing-grid">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`pricing-card ${tier.highlight ? "pricing-card-highlight" : ""}`}
          >
            {tier.highlight && (
              <span className="pricing-badge">Most Popular</span>
            )}
            {tier.comingSoon && (
              <span className="pricing-badge pricing-badge-soon">Coming Soon</span>
            )}
            <h2 className="pricing-tier-name">{tier.name}</h2>
            <div className="pricing-price">
              {tier.price}
              {tier.price !== "$0" && (
                <span className="pricing-period">{tier.period || "one-time"}</span>
              )}
            </div>
            <p className="pricing-description">{tier.description}</p>
            <ul className="pricing-features">
              {tier.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <a href={tier.ctaLink} className="btn-start pricing-cta">
              {tier.cta}
            </a>
          </div>
        ))}
      </div>

      <section className="pricing-faq">
        <h2>Frequently Asked Questions</h2>
        <details className="pricing-faq-item">
          <summary>Is the free test really free?</summary>
          <p>
            Yes. You get your top 5 strengths, a preview of your personality
            type, DISC style, and Enneagram — all at no cost, no signup
            required.
          </p>
        </details>
        <details className="pricing-faq-item">
          <summary>What do I get with the Full Profile?</summary>
          <p>
            All 20 strengths ranked, full personality type breakdown with
            dimension scores, complete DISC profile with traits, Enneagram
            with wing and tritype, plus career paths, book recommendations,
            and a unified profile view.
          </p>
        </details>
        <details className="pricing-faq-item">
          <summary>Is this a subscription?</summary>
          <p>
            No. Both the Full Profile and AI Playbook are one-time purchases.
            No recurring charges.
          </p>
        </details>
        <details className="pricing-faq-item">
          <summary>Can I share my results?</summary>
          <p>
            Yes. You can share a results card image or a link that lets others
            take the test and compare their profile with yours.
          </p>
        </details>
        <details className="pricing-faq-item">
          <summary>How is this different from taking four separate tests?</summary>
          <p>
            One test, four results. Instead of taking a Strengths test, then a
            personality test, then a DISC test, then an Enneagram test — each
            30-60 minutes — you answer our questions once and get all four
            results. And because all four frameworks come from the same
            assessment, you can see how they connect.
          </p>
        </details>
        <details className="pricing-faq-item">
          <summary>How long does the test take?</summary>
          <p>
            About 10-15 minutes. We use progress indicators and auto-save so
            you never lose your place.
          </p>
        </details>
        <details className="pricing-faq-item">
          <summary>Is my data private?</summary>
          <p>
            Yes. We follow GDPR guidelines. You can request deletion of your
            data at any time. We never sell your personality data. See our{" "}
            <a href="/privacy-draft">Privacy Policy</a>.
          </p>
        </details>
      </section>
    </div>
  );
}