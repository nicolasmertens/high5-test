import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { frameworkContent } from "../data/landing-content";

interface Props {
  framework: string;
}

export function LandingPage({ framework }: Props) {
  const navigate = useNavigate();
  const fw = frameworkContent[framework];

  // Set page title and meta
  useEffect(() => {
    if (fw) {
      document.title = fw.metaTitle;
      const desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute("content", fw.metaDesc);
    }
  }, [fw]);

  if (!fw) {
    navigate("/");
    return null;
  }

  const otherFrameworks = Object.values(frameworkContent).filter(
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
        <p className="landing-tagline">{fw.heroSubtitle}</p>
        <button className="btn-start" onClick={() => navigate("/")}>
          Take the Free Test &rarr;
        </button>
      </div>

      {/* What is it */}
      <section className="landing-section">
        <h2>What is {fw.name}?</h2>
        <p>{fw.what}</p>
      </section>

      {/* History */}
      <section className="landing-section">
        <h2>History & Origins</h2>
        <p>{fw.history}</p>
      </section>

      {/* Dimensions */}
      <section className="landing-section">
        <h2>{fw.dimensionsTitle}</h2>
        <div className="landing-dims">
          {fw.dimensions.map((d) => (
            <div key={d.name} className="landing-dim">
              <h4>{d.name}</h4>
              <p>{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How to interpret */}
      <section className="landing-section">
        <h2>How to Interpret Your Results</h2>
        {fw.interpretation.map((p, i) => (
          <p key={i} className="landing-para">{p}</p>
        ))}
      </section>

      {/* Use cases */}
      <section className="landing-section">
        <h2>What Can You Do With {fw.name}?</h2>
        <div className="landing-usecases">
          {fw.useCases.map((uc) => (
            <div key={uc.title} className="landing-usecase">
              <h4>{uc.title}</h4>
              <p>{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How our test works */}
      <section className="landing-section">
        <h2>How Our {fw.name} Test Works</h2>
        {fw.howItWorks.map((p, i) => (
          <p key={i} className="landing-para">{p}</p>
        ))}
      </section>

      {/* Why 1Test */}
      <section className="landing-section">
        <h2>Why Take {fw.name} on 1Test?</h2>
        <ul className="landing-reasons">
          {fw.whyOurs.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </section>

      {/* Comparison table */}
      <section className="landing-section">
        <h2>How We Compare</h2>
        <div className="landing-table-wrap">
          <table className="landing-table">
            <thead>
              <tr>
                <th></th>
                <th>Others</th>
                <th>1Test</th>
              </tr>
            </thead>
            <tbody>
              {fw.comparison.map((row) => (
                <tr key={row.aspect}>
                  <td className="landing-table-aspect">{row.aspect}</td>
                  <td>{row.others}</td>
                  <td className="landing-table-ours">{row.ours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Also get */}
      <section className="landing-section landing-also">
        <h2>You'll Also Get</h2>
        <p className="landing-also-sub">
          From the same 120 questions, we derive your results across all four
          personality frameworks:
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

      {/* FAQ */}
      <section className="landing-section">
        <h2>Frequently Asked Questions</h2>
        <div className="landing-faqs">
          {fw.faqs.map((faq) => (
            <details key={faq.q} className="landing-faq">
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <div className="landing-cta">
        <h2>Ready to Discover Your {fw.name}?</h2>
        <p>One test. Four frameworks. Completely free. ~15 minutes.</p>
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
