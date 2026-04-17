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
    ctaLink: "/",
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
    ctaLink: "/?start=1",
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
    ctaLink: "/?start=1",
    highlight: false,
  },
];

export function PricingPage() {
  return (
    <div className="pricing">
      <SEOHead
        title="Pricing — 1Test"
        description="1Test pricing: take the free personality assessment, or unlock your full profile across Strengths, 16 Personalities, DISC, and Enneagram."
        canonicalUrl="https://1test.me/pricing"
      />

      <header className="pricing-header">
        <h1>Simple, Transparent Pricing</h1>
        <p>
          Take the free test and get your top 5 strengths. Unlock your full
          profile whenever you are ready.
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
            <h2 className="pricing-tier-name">{tier.name}</h2>
            <div className="pricing-price">
              {tier.price}
              {tier.price !== "$0" && (
                <span className="pricing-period">one-time</span>
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
      </section>
    </div>
  );
}