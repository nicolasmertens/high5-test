import { useEffect } from "react";

export function TermsOfService() {
  useEffect(() => {
    document.title = "Terms of Service — 1Test";
  }, []);

  return (
    <div className="legal-page">
      <h1>Terms of Service</h1>
      <p className="legal-updated">Last updated: April 2026</p>

      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By using 1test.me ("the Service"), you agree to these Terms of
          Service. If you do not agree, do not use the Service.
        </p>
      </section>

      <section>
        <h2>2. Description of Service</h2>
        <p>
          1Test provides personality assessments based on publicly available
          psychological frameworks. Our free assessment delivers your Top 5
          strengths with teasers of your 16 Personalities type, DISC profile,
          and Enneagram type. Our paid Full Profile unlocks detailed results
          across all four frameworks.
        </p>
      </section>

      <section>
        <h2>3. Free Assessment</h2>
        <p>
          The free assessment is provided at no cost. No account is required.
          Results are processed entirely in your browser and stored locally on
          your device.
        </p>
      </section>

      <section>
        <h2>4. Paid Full Profile</h2>
        <p>
          The Full Profile is a one-time purchase that unlocks all results for
          your assessment session. Payment is processed by Stripe. The current
          price is displayed on the results page at the time of purchase. Prices
          may change; the price shown at checkout is the price you pay.
        </p>
        <h3>Refund Policy</h3>
        <p>
          If you are not satisfied with your Full Profile purchase, contact us
          at support@1test.me within 14 days for a full refund.
        </p>
      </section>

      <section>
        <h2>5. Not a Diagnostic Tool</h2>
        <p>
          1Test provides personality assessments for self-awareness and
          entertainment purposes only. Results are not medical, psychological,
          or diagnostic advice. They should not be used as a substitute for
          professional counseling, diagnosis, or treatment. If you are
          experiencing mental health difficulties, please consult a licensed
          professional.
        </p>
      </section>

      <section>
        <h2>6. Accuracy of Results</h2>
        <p>
          Our assessments are derived from your self-reported answers and are
          estimates, not certified results. Different assessments may produce
          different results. Personality frameworks are models for understanding,
          not definitive categories.
        </p>
      </section>

      <section>
        <h2>7. Intellectual Property</h2>
        <p>
          The 1Test website, assessment content, and results presentation are
          owned by 1Test. You may share your results for personal,
          non-commercial purposes (e.g., on social media). You may not
          reproduce, redistribute, or sell our assessment content.
        </p>
        <p>
          The personality frameworks we use (16 Personalities, DISC, Enneagram,
          Strengths) are based on publicly available models and theories. We are
          not affiliated with, endorsed by, or connected to any trademark
          holders of proprietary personality assessments.
        </p>
      </section>

      <section>
        <h2>8. User Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service for any unlawful purpose</li>
          <li>Attempt to reverse-engineer, decompile, or disrupt the Service</li>
          <li>Create multiple accounts to circumvent payment requirements</li>
          <li>Use automated tools to scrape or harvest assessment content</li>
          <li>Misrepresent your identity or information</li>
        </ul>
      </section>

      <section>
        <h2>9. Disclaimer of Warranties</h2>
        <p>
          The Service is provided "as is" without warranties of any kind, either
          express or implied, including but not limited to merchantability,
          fitness for a particular purpose, and non-infringement.
        </p>
      </section>

      <section>
        <h2>10. Limitation of Liability</h2>
        <p>
          1Test shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages arising from your use of the
          Service.
        </p>
      </section>

      <section>
        <h2>11. Governing Law</h2>
        <p>
          These terms are governed by applicable law. Any disputes shall be
          resolved through arbitration or in the courts of the applicable
          jurisdiction.
        </p>
      </section>

      <section>
        <h2>12. Changes</h2>
        <p>
          We may update these terms from time to time. Continued use of the
          Service after changes constitutes acceptance of the updated terms.
        </p>
      </section>

      <section>
        <h2>13. Contact</h2>
        <p>
          For questions about these terms, contact: support@1test.me
        </p>
      </section>
    </div>
  );
}