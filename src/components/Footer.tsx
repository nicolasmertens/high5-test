import { Link } from "react-router-dom";

const TESTS = [
  { label: "16 Personalities", to: "/free-personality-test" },
  { label: "DISC Profile", to: "/free-disc-test" },
  { label: "Enneagram", to: "/free-enneagram-test" },
  { label: "Top 5 Strengths", to: "/free-strengths-test" },
];

const LEGAL = [
  { label: "Privacy Policy", to: "/privacy-draft" },
  { label: "Terms of Service", to: "/terms-draft" },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <span className="footer-logo">&#9889;</span>
        <span className="footer-name">1Test</span>
      </div>

      <nav className="footer-links">
        <div className="footer-col">
          <h4 className="footer-heading">Free Tests</h4>
          {TESTS.map((t) => (
            <Link key={t.to} to={t.to} className="footer-link">
              {t.label}
            </Link>
          ))}
        </div>
        <div className="footer-col">
          <h4 className="footer-heading">Learn</h4>
          <Link to="/blog" className="footer-link">
            Blog
          </Link>
        </div>
        <div className="footer-col">
          <h4 className="footer-heading">Legal</h4>
          {LEGAL.map((l) => (
            <Link key={l.to} to={l.to} className="footer-link">
              {l.label}
            </Link>
          ))}
        </div>
      </nav>

      <p className="footer-copy">
        &copy; {new Date().getFullYear()} 1Test. All rights reserved.
      </p>
    </footer>
  );
}