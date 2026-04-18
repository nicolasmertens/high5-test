import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./i18n";
import "./index.css";
import App from "./App.tsx";
import { HomePage } from "./components/HomePage.tsx";
import { Header } from "./components/Header.tsx";
import { LandingPage } from "./components/LandingPage.tsx";
import { BlogPage } from "./components/BlogPage.tsx";
import { BlogIndex } from "./components/BlogIndex.tsx";
import { PrivacyPolicy } from "./components/PrivacyPolicy.tsx";
import { TermsOfService } from "./components/TermsOfService.tsx";
import { AnalyticsProvider } from "./components/AnalyticsProvider.tsx";
import { Footer } from "./components/Footer.tsx";
import { RelationshipReportPage } from "./components/RelationshipReport.tsx";
import { CompareScreen } from "./components/CompareScreen.tsx";
import { PlaybookPage } from "./components/PlaybookPage.tsx";
import { ThankYouPage } from "./components/ThankYouPage.tsx";
import { PricingPage } from "./components/PricingPage.tsx";
import { LanguageProvider, getLanguageAndBasename } from "./contexts/LanguageContext.tsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/test" element={<App />} />
      <Route path="/free-disc-test" element={<LandingPage framework="disc" />} />
      <Route path="/free-enneagram-test" element={<LandingPage framework="enneagram" />} />
      <Route path="/free-personality-test" element={<LandingPage framework="personality" />} />
      <Route path="/free-strengths-test" element={<LandingPage framework="strengths" />} />
      <Route path="/disc-test" element={<LandingPage framework="disc-test" />} />
      <Route path="/enneagram-test" element={<LandingPage framework="enneagram-test" />} />
      <Route path="/16-personalities-test" element={<LandingPage framework="16personalities-test" />} />
      <Route path="/strengths-test" element={<LandingPage framework="strengths-test" />} />
      <Route path="/enneagramm-test" element={<LandingPage framework="enneagram" />} />
      <Route path="/test-personnalite" element={<LandingPage framework="personality" />} />
      <Route path="/test-forces" element={<LandingPage framework="strengths" />} />
      <Route path="/blog" element={<BlogIndex />} />
      <Route path="/blog/best-free-strengths-assessment" element={<BlogPage slug="best-free-strengths-assessment" />} />
      <Route path="/blog/disc-communication-styles" element={<BlogPage slug="disc-communication-styles" />} />
      <Route path="/blog/enneagram-career-paths" element={<BlogPage slug="enneagram-career-paths" />} />
      <Route path="/blog/personality-test-for-career" element={<BlogPage slug="personality-test-for-career" />} />
      <Route path="/blog/disc-vs-enneagram-vs-strengths" element={<BlogPage slug="disc-vs-enneagram-vs-strengths" />} />
      <Route path="/blog/which-personality-test-right-for-you" element={<BlogPage slug="which-personality-test-right-for-you" />} />
      <Route path="/blog/understanding-16-personalities" element={<BlogPage slug="understanding-16-personalities" />} />
      <Route path="/blog/disc-type-work-style" element={<BlogPage slug="disc-type-work-style" />} />
      <Route path="/blog/disc-assessment-guide" element={<BlogPage slug="disc-assessment-guide" />} />
      <Route path="/blog/enneagram-career-guide" element={<BlogPage slug="enneagram-career-guide" />} />
      <Route path="/blog/strengths-finder-alternative" element={<BlogPage slug="strengths-finder-alternative" />} />
      <Route path="/blog/strengths-for-career" element={<BlogPage slug="strengths-for-career" />} />
      <Route path="/blog/disc-test-team-building" element={<BlogPage slug="disc-test-team-building" />} />
      <Route path="/blog/enneagram-growth-paths" element={<BlogPage slug="enneagram-growth-paths" />} />
      <Route path="/blog/enneagram-types-explained" element={<BlogPage slug="enneagram-types-explained" />} />
      <Route path="/blog/disc-personality-types-explained" element={<BlogPage slug="disc-personality-types-explained" />} />
      <Route path="/blog/introvert-extrovert-test" element={<BlogPage slug="introvert-extrovert-test" />} />
      <Route path="/blog/strengths-and-weaknesses-test" element={<BlogPage slug="strengths-and-weaknesses-test" />} />
      <Route path="/blog/disc-work-style" element={<BlogPage slug="disc-work-style" />} />
      <Route path="/blog/enneagram-career" element={<BlogPage slug="enneagram-career" />} />
      <Route path="/blog/personality-assessment-science" element={<BlogPage slug="personality-assessment-science" />} />
      <Route path="/blog/free-vs-paid-personality-tests" element={<BlogPage slug="free-vs-paid-personality-tests" />} />
      <Route path="/blog/personality-team-dynamics-founders" element={<BlogPage slug="personality-team-dynamics-founders" />} />
      <Route path="/blog/best-free-personality-test-2026" element={<BlogPage slug="best-free-personality-test-2026" />} />
      <Route path="/blog/personality-test-for-relationships" element={<BlogPage slug="personality-test-for-relationships" />} />
      <Route path="/blog/how-to-use-personality-test-results" element={<BlogPage slug="how-to-use-personality-test-results" />} />
      <Route path="/blog/personality-test-for-teams" element={<BlogPage slug="personality-test-for-teams" />} />
      <Route path="/blog/personality-test-for-leadership" element={<BlogPage slug="personality-test-for-leadership" />} />
      <Route path="/blog/disc-conflict-resolution" element={<BlogPage slug="disc-conflict-resolution" />} />
      <Route path="/blog/enneagram-wings-explained" element={<BlogPage slug="enneagram-wings-explained" />} />
      <Route path="/blog/personality-test-team-building" element={<BlogPage slug="personality-test-team-building" />} />
      <Route path="/blog/disc-vs-16-personalities" element={<BlogPage slug="disc-vs-16-personalities" />} />
      <Route path="/blog/16-personalities-vs-enneagram" element={<BlogPage slug="16-personalities-vs-enneagram" />} />
      <Route path="/blog/personality-test-comparison" element={<BlogPage slug="personality-test-comparison" />} />
      <Route path="/blog/16-personalities-career" element={<BlogPage slug="16-personalities-career" />} />
      <Route path="/blog/disc-sales-training" element={<BlogPage slug="disc-sales-training" />} />
      <Route path="/blog/personality-test-self-awareness" element={<BlogPage slug="personality-test-self-awareness" />} />
      <Route path="/blog/strengths-based-interview" element={<BlogPage slug="strengths-based-interview" />} />
      <Route path="/blog/personality-test-stress-management" element={<BlogPage slug="personality-test-stress-management" />} />
      <Route path="/blog/disc-management-style" element={<BlogPage slug="disc-management-style" />} />
      <Route path="/blog/enneagram-in-workplace" element={<BlogPage slug="enneagram-in-workplace" />} />
      <Route path="/blog/personality-test-for-managers" element={<BlogPage slug="personality-test-for-managers" />} />
      <Route path="/blog/16-personalities-relationships" element={<BlogPage slug="16-personalities-relationships" />} />
      <Route path="/blog/personality-test-for-students" element={<BlogPage slug="personality-test-for-students" />} />
      <Route path="/blog/disc-personality-test-free" element={<BlogPage slug="disc-personality-test-free" />} />
      <Route path="/blog/enneagram-test-free-online" element={<BlogPage slug="enneagram-test-free-online" />} />
      <Route path="/blog/big-five-personality-traits" element={<BlogPage slug="big-five-personality-traits" />} />
      <Route path="/blog/personality-test-for-hiring" element={<BlogPage slug="personality-test-for-hiring" />} />
      <Route path="/blog/personality-test-accuracy" element={<BlogPage slug="personality-test-accuracy" />} />
      <Route path="/blog/personality-test-for-couples" element={<BlogPage slug="personality-test-for-couples" />} />
      <Route path="/blog/strengths-based-leadership" element={<BlogPage slug="strengths-based-leadership" />} />
      <Route path="/blog/personality-test-for-career-change" element={<BlogPage slug="personality-test-for-career-change" />} />
      <Route path="/blog/personality-test-for-entrepreneurs" element={<BlogPage slug="personality-test-for-entrepreneurs" />} />
      <Route path="/blog/disc-personality-in-sales" element={<BlogPage slug="disc-personality-in-sales" />} />
      <Route path="/blog/enneagram-growth-coaching" element={<BlogPage slug="enneagram-growth-coaching" />} />
      <Route path="/blog/personality-test-for-parents" element={<BlogPage slug="personality-test-for-parents" />} />
      <Route path="/blog/disc-leadership-style" element={<BlogPage slug="disc-leadership-style" />} />
      <Route path="/blog/16-personalities-in-the-workplace" element={<BlogPage slug="16-personalities-in-the-workplace" />} />
      <Route path="/blog/personality-test-for-friendships" element={<BlogPage slug="personality-test-for-friendships" />} />
      <Route path="/blog/strengths-and-weaknesses-guide" element={<BlogPage slug="strengths-and-weaknesses-guide" />} />
      <Route path="/blog/personality-test-for-remote-workers" element={<BlogPage slug="personality-test-for-remote-workers" />} />
      <Route path="/blog/personality-test-for-conflict-resolution" element={<BlogPage slug="personality-test-for-conflict-resolution" />} />
      <Route path="/blog/personality-test-for-self-confidence" element={<BlogPage slug="personality-test-for-self-confidence" />} />
      <Route path="/blog/personality-test-for-personal-growth" element={<BlogPage slug="personality-test-for-personal-growth" />} />
      <Route path="/blog/personality-test-for-mentorship" element={<BlogPage slug="personality-test-for-mentorship" />} />
      <Route path="/blog/disc-communication-in-remote-teams" element={<BlogPage slug="disc-communication-in-remote-teams" />} />
      <Route path="/blog/personality-test-for-retirement-planning" element={<BlogPage slug="personality-test-for-retirement-planning" />} />
      <Route path="/blog/personality-test-for-volunteers" element={<BlogPage slug="personality-test-for-volunteers" />} />
      <Route path="/blog/disc-conflict-resolution-at-work" element={<BlogPage slug="disc-conflict-resolution-at-work" />} />
      <Route path="/blog/personality-type-compatibility" element={<BlogPage slug="personality-type-compatibility" />} />
      <Route path="/blog/personality-test-for-teaching" element={<BlogPage slug="personality-test-for-teaching" />} />
      <Route path="/blog/enneagram-type-3-achiever" element={<BlogPage slug="enneagram-type-3-achiever" />} />
      <Route path="/blog/disc-type-d-dominance" element={<BlogPage slug="disc-type-d-dominance" />} />
      <Route path="/blog/personality-test-for-negotiation" element={<BlogPage slug="personality-test-for-negotiation" />} />
      <Route path="/blog/enneagram-type-9-peacemaker" element={<BlogPage slug="enneagram-type-9-peacemaker" />} />
      <Route path="/blog/disc-type-s-steadiness" element={<BlogPage slug="disc-type-s-steadiness" />} />
      <Route path="/blog/personality-test-for-networking" element={<BlogPage slug="personality-test-for-networking" />} />
      <Route path="/blog/enneagram-type-6-loyalist" element={<BlogPage slug="enneagram-type-6-loyalist" />} />
      <Route path="/blog/disc-type-i-influence" element={<BlogPage slug="disc-type-i-influence" />} />
      <Route path="/blog/enneagram-type-8-challenger" element={<BlogPage slug="enneagram-type-8-challenger" />} />
      <Route path="/blog/disc-type-c-conscientiousness" element={<BlogPage slug="disc-type-c-conscientiousness" />} />
      <Route path="/blog/16-personalities-career-guide" element={<BlogPage slug="16-personalities-career-guide" />} />
      <Route path="/blog/enneagram-type-1-reformer" element={<BlogPage slug="enneagram-type-1-reformer" />} />
      <Route path="/blog/enneagram-type-2-helper" element={<BlogPage slug="enneagram-type-2-helper" />} />
      <Route path="/blog/personality-test-for-addiction-recovery" element={<BlogPage slug="personality-test-for-addiction-recovery" />} />
      <Route path="/blog/enneagram-type-4-individualist" element={<BlogPage slug="enneagram-type-4-individualist" />} />
      <Route path="/blog/enneagram-type-5-investigator" element={<BlogPage slug="enneagram-type-5-investigator" />} />
      <Route path="/blog/enneagram-type-7-enthusiast" element={<BlogPage slug="enneagram-type-7-enthusiast" />} />
      <Route path="/blog/personality-test-for-job-interviews" element={<BlogPage slug="personality-test-for-job-interviews" />} />
      <Route path="/blog/personality-test-for-college-students" element={<BlogPage slug="personality-test-for-college-students" />} />
      <Route path="/blog/disc-personality-in-the-workplace" element={<BlogPage slug="disc-personality-in-the-workplace" />} />
      <Route path="/blog/personality-test-for-career-counselors" element={<BlogPage slug="personality-test-for-career-counselors" />} />
      <Route path="/blog/personality-test-for-couples-counseling" element={<BlogPage slug="personality-test-for-couples-counseling" />} />
      <Route path="/blog/strengths-swot-analysis" element={<BlogPage slug="strengths-swot-analysis" />} />
      <Route path="/blog/disc-personality-test-results" element={<BlogPage slug="disc-personality-test-results" />} />
      <Route path="/blog/personality-test-for-first-time-managers" element={<BlogPage slug="personality-test-for-first-time-managers" />} />
      <Route path="/blog/16-personalities-test-free" element={<BlogPage slug="16-personalities-test-free" />} />
      <Route path="/blog/personality-test-for-midlife-career-change" element={<BlogPage slug="personality-test-for-midlife-career-change" />} />
      <Route path="/blog/disc-conflict-management" element={<BlogPage slug="disc-conflict-management" />} />
      <Route path="/blog/enneagram-wing-influence" element={<BlogPage slug="enneagram-wing-influence" />} />
      <Route path="/blog/infp-personality-type" element={<BlogPage slug="infp-personality-type" />} />
      <Route path="/blog/infj-personality-type" element={<BlogPage slug="infj-personality-type" />} />
      <Route path="/blog/intj-personality-type" element={<BlogPage slug="intj-personality-type" />} />
      <Route path="/blog/intp-personality-type" element={<BlogPage slug="intp-personality-type" />} />
      <Route path="/blog/enfp-personality-type" element={<BlogPage slug="enfp-personality-type" />} />
      <Route path="/blog/enfj-personality-type" element={<BlogPage slug="enfj-personality-type" />} />
      <Route path="/blog/entj-personality-type" element={<BlogPage slug="entj-personality-type" />} />
      <Route path="/blog/entp-personality-type" element={<BlogPage slug="entp-personality-type" />} />
      <Route path="/blog/istj-personality-type" element={<BlogPage slug="istj-personality-type" />} />
      <Route path="/blog/isfj-personality-type" element={<BlogPage slug="isfj-personality-type" />} />
      <Route path="/blog/estj-personality-type" element={<BlogPage slug="estj-personality-type" />} />
      <Route path="/blog/esfj-personality-type" element={<BlogPage slug="esfj-personality-type" />} />
      <Route path="/blog/istp-personality-type" element={<BlogPage slug="istp-personality-type" />} />
      <Route path="/blog/isfp-personality-type" element={<BlogPage slug="isfp-personality-type" />} />
      <Route path="/blog/estp-personality-type" element={<BlogPage slug="estp-personality-type" />} />
      <Route path="/blog/esfp-personality-type" element={<BlogPage slug="esfp-personality-type" />} />
      <Route path="/blog/infp-vs-infj" element={<BlogPage slug="infp-vs-infj" />} />
      <Route path="/blog/intj-vs-intp" element={<BlogPage slug="intj-vs-intp" />} />
      <Route path="/blog/enfp-vs-enfj" element={<BlogPage slug="enfp-vs-enfj" />} />
      <Route path="/blog/intj-vs-entj" element={<BlogPage slug="intj-vs-entj" />} />
      <Route path="/blog/infp-vs-enfp" element={<BlogPage slug="infp-vs-enfp" />} />
      <Route path="/blog/istj-vs-intj" element={<BlogPage slug="istj-vs-intj" />} />
      <Route path="/blog/infj-vs-intj" element={<BlogPage slug="infj-vs-intj" />} />
      <Route path="/blog/enfp-vs-infj" element={<BlogPage slug="enfp-vs-infj" />} />
      <Route path="/blog/entp-vs-intj" element={<BlogPage slug="entp-vs-intj" />} />
      <Route path="/blog/isfj-vs-infj" element={<BlogPage slug="isfj-vs-infj" />} />
      <Route path="/blog/istp-vs-intp" element={<BlogPage slug="istp-vs-intp" />} />
      <Route path="/blog/enfj-vs-entj" element={<BlogPage slug="enfj-vs-entj" />} />
      <Route path="/blog/isfp-vs-infp" element={<BlogPage slug="isfp-vs-infp" />} />
      <Route path="/blog/estp-vs-entp" element={<BlogPage slug="estp-vs-entp" />} />
      <Route path="/blog/estj-vs-entj" element={<BlogPage slug="estj-vs-entj" />} />
      <Route path="/blog/istp-vs-istj" element={<BlogPage slug="istp-vs-istj" />} />
      <Route path="/blog/esfp-vs-enfp" element={<BlogPage slug="esfp-vs-enfp" />} />
      <Route path="/blog/esfj-vs-isfj" element={<BlogPage slug="esfj-vs-isfj" />} />
      <Route path="/blog/intp-vs-infp" element={<BlogPage slug="intp-vs-infp" />} />
      <Route path="/blog/intj-vs-infj" element={<BlogPage slug="intj-vs-infj" />} />
      <Route path="/blog/entp-vs-enfp" element={<BlogPage slug="entp-vs-enfp" />} />
      <Route path="/blog/infj-vs-enfj" element={<BlogPage slug="infj-vs-enfj" />} />
      <Route path="/blog/isfj-vs-istj" element={<BlogPage slug="isfj-vs-istj" />} />
      <Route path="/blog/intp-vs-infj" element={<BlogPage slug="intp-vs-infj" />} />
      <Route path="/blog/infp-careers" element={<BlogPage slug="infp-careers" />} />
      <Route path="/blog/intj-careers" element={<BlogPage slug="intj-careers" />} />
      <Route path="/blog/infj-careers" element={<BlogPage slug="infj-careers" />} />
      <Route path="/blog/enfp-careers" element={<BlogPage slug="enfp-careers" />} />
      <Route path="/blog/entp-careers" element={<BlogPage slug="entp-careers" />} />
      <Route path="/blog/intp-careers" element={<BlogPage slug="intp-careers" />} />
      <Route path="/blog/istj-careers" element={<BlogPage slug="istj-careers" />} />
      <Route path="/blog/isfj-careers" element={<BlogPage slug="isfj-careers" />} />
      <Route path="/blog/enfj-careers" element={<BlogPage slug="enfj-careers" />} />
      <Route path="/blog/entj-careers" element={<BlogPage slug="entj-careers" />} />
      <Route path="/blog/estj-careers" element={<BlogPage slug="estj-careers" />} />
      <Route path="/blog/istp-careers" element={<BlogPage slug="istp-careers" />} />
      <Route path="/blog/isfp-careers" element={<BlogPage slug="isfp-careers" />} />
      <Route path="/blog/estp-careers" element={<BlogPage slug="estp-careers" />} />
      <Route path="/blog/esfp-careers" element={<BlogPage slug="esfp-careers" />} />
      <Route path="/blog/esfj-careers" element={<BlogPage slug="esfj-careers" />} />
      <Route path="/blog/enneagram-type-4-vs-type-5" element={<BlogPage slug="enneagram-type-4-vs-type-5" />} />
      <Route path="/blog/enneagram-type-1-vs-type-6" element={<BlogPage slug="enneagram-type-1-vs-type-6" />} />
      <Route path="/blog/enneagram-type-2-vs-type-9" element={<BlogPage slug="enneagram-type-2-vs-type-9" />} />
      <Route path="/blog/enneagram-type-3-vs-type-7" element={<BlogPage slug="enneagram-type-3-vs-type-7" />} />
      <Route path="/blog/enneagram-type-4-vs-type-9" element={<BlogPage slug="enneagram-type-4-vs-type-9" />} />
      <Route path="/blog/enneagram-type-5-vs-type-9" element={<BlogPage slug="enneagram-type-5-vs-type-9" />} />
      <Route path="/blog/enneagram-type-1-vs-type-9" element={<BlogPage slug="enneagram-type-1-vs-type-9" />} />
      <Route path="/blog/enneagram-type-2-vs-type-3" element={<BlogPage slug="enneagram-type-2-vs-type-3" />} />
      <Route path="/blog/enneagram-type-3-vs-type-8" element={<BlogPage slug="enneagram-type-3-vs-type-8" />} />
      <Route path="/blog/enneagram-type-6-vs-type-9" element={<BlogPage slug="enneagram-type-6-vs-type-9" />} />
      <Route path="/blog/enneagram-type-7-vs-type-8" element={<BlogPage slug="enneagram-type-7-vs-type-8" />} />
      <Route path="/blog/infp-enneagram-type" element={<BlogPage slug="infp-enneagram-type" />} />
      <Route path="/blog/intj-enneagram-type" element={<BlogPage slug="intj-enneagram-type" />} />
      <Route path="/blog/infj-enneagram-type" element={<BlogPage slug="infj-enneagram-type" />} />
      <Route path="/blog/enfp-enneagram-type" element={<BlogPage slug="enfp-enneagram-type" />} />
      <Route path="/blog/intp-enneagram-type" element={<BlogPage slug="intp-enneagram-type" />} />
      <Route path="/blog/entp-enneagram-type" element={<BlogPage slug="entp-enneagram-type" />} />
      <Route path="/blog/istj-enneagram-type" element={<BlogPage slug="istj-enneagram-type" />} />
      <Route path="/blog/isfj-enneagram-type" element={<BlogPage slug="isfj-enneagram-type" />} />
      <Route path="/blog/infp-disc-profile" element={<BlogPage slug="infp-disc-profile" />} />
      <Route path="/blog/intj-disc-profile" element={<BlogPage slug="intj-disc-profile" />} />
      <Route path="/blog/infj-disc-profile" element={<BlogPage slug="infj-disc-profile" />} />
      <Route path="/blog/enfp-disc-profile" element={<BlogPage slug="enfp-disc-profile" />} />
      <Route path="/blog/intp-disc-profile" element={<BlogPage slug="intp-disc-profile" />} />
      <Route path="/blog/entp-disc-profile" element={<BlogPage slug="entp-disc-profile" />} />
      <Route path="/blog/istj-disc-profile" element={<BlogPage slug="istj-disc-profile" />} />
      <Route path="/blog/isfj-disc-profile" element={<BlogPage slug="isfj-disc-profile" />} />
      <Route path="/blog/enfj-disc-profile" element={<BlogPage slug="enfj-disc-profile" />} />
      <Route path="/blog/entj-disc-profile" element={<BlogPage slug="entj-disc-profile" />} />
      <Route path="/blog/estp-disc-profile" element={<BlogPage slug="estp-disc-profile" />} />
      <Route path="/blog/estj-disc-profile" element={<BlogPage slug="estj-disc-profile" />} />
      <Route path="/blog/esfp-disc-profile" element={<BlogPage slug="esfp-disc-profile" />} />
      <Route path="/blog/esfj-disc-profile" element={<BlogPage slug="esfj-disc-profile" />} />
      <Route path="/blog/istp-disc-profile" element={<BlogPage slug="istp-disc-profile" />} />
      <Route path="/blog/isfp-disc-profile" element={<BlogPage slug="isfp-disc-profile" />} />
      <Route path="/blog/enfj-enneagram-type" element={<BlogPage slug="enfj-enneagram-type" />} />
      <Route path="/blog/entj-enneagram-type" element={<BlogPage slug="entj-enneagram-type" />} />
      <Route path="/blog/estp-enneagram-type" element={<BlogPage slug="estp-enneagram-type" />} />
      <Route path="/blog/estj-enneagram-type" element={<BlogPage slug="estj-enneagram-type" />} />
      <Route path="/blog/esfp-enneagram-type" element={<BlogPage slug="esfp-enneagram-type" />} />
      <Route path="/blog/esfj-enneagram-type" element={<BlogPage slug="esfj-enneagram-type" />} />
      <Route path="/blog/istp-enneagram-type" element={<BlogPage slug="istp-enneagram-type" />} />
      <Route path="/blog/isfp-enneagram-type" element={<BlogPage slug="isfp-enneagram-type" />} />
      <Route path="/blog/estp-vs-istp" element={<BlogPage slug="estp-vs-istp" />} />
      <Route path="/blog/esfp-vs-isfp" element={<BlogPage slug="esfp-vs-isfp" />} />
      <Route path="/blog/estj-vs-istj" element={<BlogPage slug="estj-vs-istj" />} />
      <Route path="/blog/entp-vs-intp" element={<BlogPage slug="entp-vs-intp" />} />
      <Route path="/blog/enfp-vs-esfp" element={<BlogPage slug="enfp-vs-esfp" />} />
      <Route path="/blog/entj-vs-entp" element={<BlogPage slug="entj-vs-entp" />} />
      <Route path="/blog/esfj-vs-estj" element={<BlogPage slug="esfj-vs-estj" />} />
      <Route path="/blog/intj-vs-infp" element={<BlogPage slug="intj-vs-infp" />} />
      <Route path="/blog/infj-compatible-types" element={<BlogPage slug="infj-compatible-types" />} />
      <Route path="/blog/intj-compatible-types" element={<BlogPage slug="intj-compatible-types" />} />
      <Route path="/blog/enfp-compatible-types" element={<BlogPage slug="enfp-compatible-types" />} />
      <Route path="/blog/infp-compatible-types" element={<BlogPage slug="infp-compatible-types" />} />
      <Route path="/blog/intp-compatible-types" element={<BlogPage slug="intp-compatible-types" />} />
      <Route path="/blog/entj-compatible-types" element={<BlogPage slug="entj-compatible-types" />} />
      <Route path="/blog/entp-compatible-types" element={<BlogPage slug="entp-compatible-types" />} />
      <Route path="/blog/enfj-compatible-types" element={<BlogPage slug="enfj-compatible-types" />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/relationship/:id" element={<RelationshipReportPage />} />
      <Route path="/compare/:hashA/:hashB" element={<CompareScreen />} />
      <Route path="/playbook" element={<PlaybookPage />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
      <Route path="/pricing" element={<PricingPage />} />
    </Routes>
  );
}

function Root() {
  const [basename, setBasename] = useState(() => {
    const { basename: b } = getLanguageAndBasename();
    return b;
  });

  useEffect(() => {
    const { basename: b } = getLanguageAndBasename();
    if (b !== basename) {
      setBasename(b);
    }
  }, [basename]);

  return (
    <StrictMode>
      <HelmetProvider>
        <BrowserRouter basename={basename || undefined}>
          <LanguageProvider>
            <AnalyticsProvider>
              <Header />
              <AppRoutes />
              <Footer />
            </AnalyticsProvider>
          </LanguageProvider>
        </BrowserRouter>
      </HelmetProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")!).render(<Root />);