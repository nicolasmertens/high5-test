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
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
          </Routes>
        </AnalyticsProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);