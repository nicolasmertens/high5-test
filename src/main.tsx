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
import { ThankYouPage } from "./components/ThankYouPage.tsx";

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
            <Route
              path="/blog/strengths-based-interview"
              element={<BlogPage slug="strengths-based-interview" />}
            />
            <Route
              path="/blog/personality-test-stress-management"
              element={<BlogPage slug="personality-test-stress-management" />}
            />
            <Route
              path="/blog/disc-management-style"
              element={<BlogPage slug="disc-management-style" />}
            />
            <Route
              path="/blog/enneagram-in-workplace"
              element={<BlogPage slug="enneagram-in-workplace" />}
            />
            <Route
              path="/blog/personality-test-for-managers"
              element={<BlogPage slug="personality-test-for-managers" />}
            />
            <Route
              path="/blog/16-personalities-relationships"
              element={<BlogPage slug="16-personalities-relationships" />}
            />
            <Route
              path="/blog/personality-test-for-students"
              element={<BlogPage slug="personality-test-for-students" />}
            />
            <Route
              path="/blog/disc-personality-test-free"
              element={<BlogPage slug="disc-personality-test-free" />}
            />
            <Route
              path="/blog/enneagram-test-free-online"
              element={<BlogPage slug="enneagram-test-free-online" />}
            />
            <Route
              path="/blog/big-five-personality-traits"
              element={<BlogPage slug="big-five-personality-traits" />}
            />
            <Route
              path="/blog/personality-test-for-hiring"
              element={<BlogPage slug="personality-test-for-hiring" />}
            />
            <Route
              path="/blog/personality-test-accuracy"
              element={<BlogPage slug="personality-test-accuracy" />}
            />
            <Route
              path="/blog/personality-test-for-couples"
              element={<BlogPage slug="personality-test-for-couples" />}
            />
            <Route
              path="/blog/strengths-based-leadership"
              element={<BlogPage slug="strengths-based-leadership" />}
            />
            <Route
              path="/blog/personality-test-for-career-change"
              element={<BlogPage slug="personality-test-for-career-change" />}
            />
            <Route
              path="/blog/personality-test-for-entrepreneurs"
              element={<BlogPage slug="personality-test-for-entrepreneurs" />}
            />
            <Route
              path="/blog/disc-personality-in-sales"
              element={<BlogPage slug="disc-personality-in-sales" />}
            />
            <Route
              path="/blog/enneagram-growth-coaching"
              element={<BlogPage slug="enneagram-growth-coaching" />}
            />
            <Route
              path="/blog/personality-test-for-parents"
              element={<BlogPage slug="personality-test-for-parents" />}
            />
            <Route
              path="/blog/disc-leadership-style"
              element={<BlogPage slug="disc-leadership-style" />}
            />
            <Route
              path="/blog/16-personalities-in-the-workplace"
              element={<BlogPage slug="16-personalities-in-the-workplace" />}
            />
            <Route
              path="/blog/personality-test-for-friendships"
              element={<BlogPage slug="personality-test-for-friendships" />}
            />
            <Route
              path="/blog/strengths-and-weaknesses-guide"
              element={<BlogPage slug="strengths-and-weaknesses-guide" />}
            />
            <Route
              path="/blog/personality-test-for-remote-workers"
              element={<BlogPage slug="personality-test-for-remote-workers" />}
            />
            <Route
              path="/blog/personality-test-for-conflict-resolution"
              element={<BlogPage slug="personality-test-for-conflict-resolution" />}
            />
            <Route
              path="/blog/personality-test-for-self-confidence"
              element={<BlogPage slug="personality-test-for-self-confidence" />}
            />
            <Route
              path="/blog/personality-test-for-personal-growth"
              element={<BlogPage slug="personality-test-for-personal-growth" />}
            />
            <Route
              path="/blog/personality-test-for-mentorship"
              element={<BlogPage slug="personality-test-for-mentorship" />}
            />
            <Route
              path="/blog/disc-communication-in-remote-teams"
              element={<BlogPage slug="disc-communication-in-remote-teams" />}
            />
            <Route
              path="/blog/personality-test-for-retirement-planning"
              element={<BlogPage slug="personality-test-for-retirement-planning" />}
            />
            <Route
              path="/blog/personality-test-for-volunteers"
              element={<BlogPage slug="personality-test-for-volunteers" />}
            />
            <Route
              path="/blog/disc-conflict-resolution-at-work"
              element={<BlogPage slug="disc-conflict-resolution-at-work" />}
            />
            <Route
              path="/blog/personality-type-compatibility"
              element={<BlogPage slug="personality-type-compatibility" />}
            />
            <Route
              path="/blog/personality-test-for-teaching"
              element={<BlogPage slug="personality-test-for-teaching" />}
            />
            <Route
              path="/blog/enneagram-type-3-achiever"
              element={<BlogPage slug="enneagram-type-3-achiever" />}
            />
            <Route
              path="/blog/disc-type-d-dominance"
              element={<BlogPage slug="disc-type-d-dominance" />}
            />
            <Route
              path="/blog/personality-test-for-negotiation"
              element={<BlogPage slug="personality-test-for-negotiation" />}
            />
            <Route
              path="/blog/enneagram-type-9-peacemaker"
              element={<BlogPage slug="enneagram-type-9-peacemaker" />}
            />
            <Route
              path="/blog/disc-type-s-steadiness"
              element={<BlogPage slug="disc-type-s-steadiness" />}
            />
            <Route
              path="/blog/personality-test-for-networking"
              element={<BlogPage slug="personality-test-for-networking" />}
            />
            <Route
              path="/blog/enneagram-type-6-loyalist"
              element={<BlogPage slug="enneagram-type-6-loyalist" />}
            />
            <Route
              path="/blog/disc-type-i-influence"
              element={<BlogPage slug="disc-type-i-influence" />}
            />
            <Route path="/privacy-draft" element={<PrivacyPolicy />} />
            <Route path="/terms-draft" element={<TermsOfService />} />
            <Route path="/relationship/:id" element={<RelationshipReportPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
          </Routes>
          <Footer />
        </AnalyticsProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);