import { useEffect } from "react";

export function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy — 1Test";
  }, []);

  return (
    <div className="legal-page">
      <h1>Privacy Policy</h1>
      <p className="legal-updated">Last updated: April 2026</p>

      <section>
        <h2>1. Overview</h2>
        <p>
          1Test.me ("we", "us", "our") operates the website 1test.me and related
          services. This privacy policy explains how we collect, use, and protect
          your information when you use our services.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <h3>Assessment Responses</h3>
        <p>
          Your assessment answers are processed entirely in your browser using
          JavaScript. We do not transmit your answers to any server. Results are
          calculated locally on your device.
        </p>
        <h3>Payment Information</h3>
        <p>
          When you purchase a Full Profile, payment processing is handled by
          Stripe. We never see or store your credit card details. Stripe may
          collect your email address for receipt delivery.
        </p>
        <h3>Usage Data</h3>
        <p>
          We may collect anonymous usage analytics (page views, assessment
          completions, conversion rates) to improve our service. This data is
          aggregated and cannot identify you personally.
        </p>
        <h3>Cookies</h3>
        <p>
          We use essential cookies for site functionality (e.g., saving your
          assessment progress) and analytics cookies to understand how visitors
          use our site. You can manage your cookie preferences at any time.
        </p>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <ul>
          <li>To deliver your assessment results</li>
          <li>To process payments for paid features</li>
          <li>To send purchase receipts (via Stripe)</li>
          <li>To improve our service through anonymous analytics</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      <section>
        <h2>4. Data Storage and Security</h2>
        <p>
          Assessment data stays on your device in browser localStorage. We do
          not maintain a database of user responses. Payment records are
          processed by Stripe and stored according to their security standards.
        </p>
      </section>

      <section>
        <h2>5. Your Rights (GDPR)</h2>
        <p>Under GDPR, you have the right to:</p>
        <ul>
          <li><strong>Access:</strong> Request a copy of any personal data we hold about you</li>
          <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
          <li><strong>Erasure:</strong> Request deletion of your personal data</li>
          <li><strong>Restriction:</strong> Request that we limit how we use your data</li>
          <li><strong>Data portability:</strong> Receive your data in a machine-readable format</li>
          <li><strong>Object:</strong> Object to processing of your data</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at privacy@1test.me. We
          will respond within 30 days.
        </p>
      </section>

      <section>
        <h2>6. Data Sharing</h2>
        <p>We do not sell, rent, or share your personal data with third parties except:</p>
        <ul>
          <li>Stripe (for payment processing, subject to their privacy policy)</li>
          <li>When required by law</li>
          <li>With your explicit consent</li>
        </ul>
      </section>

      <section>
        <h2>7. International Users</h2>
        <p>
          Our service is operated from the United States. If you access our
          service from the European Economic Area, your data is protected under
          GDPR as described in this policy.
        </p>
      </section>

      <section>
        <h2>8. Children's Privacy</h2>
        <p>
          Our service is not directed to children under 16. We do not
          knowingly collect personal information from children under 16.
        </p>
      </section>

      <section>
        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this policy from time to time. We will notify you of
          material changes by posting the updated policy on this page with a
          revised "Last updated" date.
        </p>
      </section>

      <section>
        <h2>10. Contact</h2>
        <p>
          For privacy questions or data requests, contact: privacy@1test.me
        </p>
      </section>
    </div>
  );
}