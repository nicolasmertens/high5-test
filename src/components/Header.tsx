import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { trackCTAClicked } from "../utils/analytics";

const NAV_LINKS = [
  { label: "Take the Test", to: "/test" },
  { label: "Pricing", to: "/pricing" },
  { label: "Blog", to: "/blog" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const handleNavClick = (label: string) => {
    trackCTAClicked({ ctaText: label, ctaLocation: "intro_hero", pagePath: location.pathname });
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="header-logo" onClick={() => handleNavClick("Logo")}>
          <span className="header-logo-icon">&#9889;</span>
          <span className="header-logo-text">1Test</span>
        </Link>

        <nav className={`header-nav ${menuOpen ? "header-nav-open" : ""}`}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`header-nav-link ${location.pathname === link.to ? "header-nav-active" : ""}`}
              onClick={() => handleNavClick(link.label)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className={`header-hamburger ${menuOpen ? "header-hamburger-open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </div>
    </header>
  );
}
