import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App.tsx";
import { LandingPage } from "./components/LandingPage.tsx";
import { BlogPage } from "./components/BlogPage.tsx";
import { BlogIndex } from "./components/BlogIndex.tsx";
import { PrivacyPolicy } from "./components/PrivacyPolicy.tsx";
import { TermsOfService } from "./components/TermsOfService.tsx";
import { AnalyticsProvider } from "./components/AnalyticsProvider.tsx";
import { Footer } from "./components/Footer.tsx";
import { RelationshipReportPage } from "./components/RelationshipReport.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AnalyticsProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route
              path="/free-disc-test"
              element={<LandingPage framework="disc" />}
            />
            <Route
              path="/free-enneagram-test"
              element={<LandingPage framework="enneagram" />}
            />
            <Route
              path="/free-personality-test"
              element={<LandingPage framework="personality" />}
            />
            <Route
              path="/free-strengths-test"
              element={<LandingPage framework="strengths" />}
            />
            <Route path="/blog" element={<BlogIndex />} />
            <Route
              path="/blog/best-free-strengths-assessment"
              element={<BlogPage slug="best-free-strengths-assessment" />}
            />
            <Route
              path="/blog/disc-communication-styles"
              element={<BlogPage slug="disc-communication-styles" />}
            />
            <Route
              path="/blog/enneagram-career-paths"
              element={<BlogPage slug="enneagram-career-paths" />}
            />
            <Route
              path="/blog/personality-test-for-career"
              element={<BlogPage slug="personality-test-for-career" />}
            />
            <Route
              path="/blog/disc-vs-enneagram-vs-strengths"
              element={<BlogPage slug="disc-vs-enneagram-vs-strengths" />}
            />
            <Route
              path="/blog/which-personality-test-right-for-you"
              element={<BlogPage slug="which-personality-test-right-for-you" />}
            />
            <Route
              path="/blog/understanding-16-personalities"
              element={<BlogPage slug="understanding-16-personalities" />}
            />
            <Route
              path="/blog/disc-type-work-style"
              element={<BlogPage slug="disc-type-work-style" />}
            />
            <Route
              path="/blog/disc-assessment-guide"
              element={<BlogPage slug="disc-assessment-guide" />}
            />
            <Route
              path="/blog/enneagram-career-guide"
              element={<BlogPage slug="enneagram-career-guide" />}
            />
            <Route
              path="/blog/strengths-finder-alternative"
              element={<BlogPage slug="strengths-finder-alternative" />}
            />
            <Route
              path="/blog/strengths-for-career"
              element={<BlogPage slug="strengths-for-career" />}
            />
            <Route
              path="/blog/disc-test-team-building"
              element={<BlogPage slug="disc-test-team-building" />}
            />
            <Route
              path="/blog/enneagram-growth-paths"
              element={<BlogPage slug="enneagram-growth-paths" />}
            />
            <Route
              path="/blog/enneagram-types-explained"
              element={<BlogPage slug="enneagram-types-explained" />}
            />
            <Route
              path="/blog/disc-personality-types-explained"
              element={<BlogPage slug="disc-personality-types-explained" />}
            />
            <Route
              path="/blog/introvert-extrovert-test"
              element={<BlogPage slug="introvert-extrovert-test" />}
            />
            <Route
              path="/blog/strengths-and-weaknesses-test"
              element={<BlogPage slug="strengths-and-weaknesses-test" />}
            />
            <Route
              path="/blog/disc-work-style"
              element={<BlogPage slug="disc-work-style" />}
            />
            <Route
              path="/blog/enneagram-career"
              element={<BlogPage slug="enneagram-career" />}
            />
            <Route
              path="/blog/personality-assessment-science"
              element={<BlogPage slug="personality-assessment-science" />}
            />
            <Route
              path="/blog/free-vs-paid-personality-tests"
              element={<BlogPage slug="free-vs-paid-personality-tests" />}
            />
            <Route
              path="/blog/personality-team-dynamics-founders"
              element={<BlogPage slug="personality-team-dynamics-founders" />}
            />
            <Route
              path="/blog/best-free-personality-test-2026"
              element={<BlogPage slug="best-free-personality-test-2026" />}
            />
            <Route
              path="/blog/personality-test-for-relationships"
              element={<BlogPage slug="personality-test-for-relationships" />}
            />
            <Route
              path="/blog/how-to-use-personality-test-results"
              element={<BlogPage slug="how-to-use-personality-test-results" />}
            />
            <Route
              path="/blog/personality-test-for-teams"
              element={<BlogPage slug="personality-test-for-teams" />}
            />
            <Route
              path="/blog/personality-test-for-leadership"
              element={<BlogPage slug="personality-test-for-leadership" />}
            />
            <Route
              path="/blog/disc-conflict-resolution"
              element={<BlogPage slug="disc-conflict-resolution" />}
            />
            <Route
              path="/blog/enneagram-wings-explained"
              element={<BlogPage slug="enneagram-wings-explained" />}
            />
            <Route
              path="/blog/personality-test-team-building"
              element={<BlogPage slug="personality-test-team-building" />}
            />
            <Route
              path="/blog/16-personalities-career"
              element={<BlogPage slug="16-personalities-career" />}
            />
            <Route
              path="/blog/disc-sales-training"
              element={<BlogPage slug="disc-sales-training" />}
            />
            <Route
              path="/blog/personality-test-self-awareness"
              element={<BlogPage slug="personality-test-self-awareness" />}
            />
            <Route path="/privacy-draft" element={<PrivacyPolicy />} />
            <Route path="/terms-draft" element={<TermsOfService />} />
            <Route path="/relationship/:id" element={<RelationshipReportPage />} />
          </Routes>
          <Footer />
        </AnalyticsProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);