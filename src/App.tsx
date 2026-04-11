import { useEffect, useRef } from "react";
import { useAssessment } from "./hooks/useAssessment";
import { IntroScreen } from "./components/IntroScreen";
import { QuestionCard } from "./components/QuestionCard";
import { ResultsScreen } from "./components/ResultsScreen";
import { PaymentProvider, usePayment } from "./contexts/PaymentContext";
import { SEOHead } from "./components/SEOHead";
import { InviteBanner } from "./components/InviteBanner";
import {
  trackTestStarted,
  trackTestCompleted,
} from "./utils/analytics";
import {
  generateProfileHash,
  generateReferralCode,
  setStoredProfileHash,
  getStoredReferralCode,
  setStoredReferralCode,
  isProfileStored,
  setProfileStored,
  storeProfileToServer,
  extractStrengthScores,
  setInviteRef,
} from "./utils/profile";
import { type StrengthScore } from "./hooks/useAssessment";
import { derivePersonalityType, deriveEnneagram, deriveDISC } from "./data/derivations";
import "./App.css";

function AppInner() {
  const {
    phase,
    currentIndex,
    currentQuestion,
    totalQuestions,
    progress,
    answers,
    results,
    hasSavedProgress,
    setAnswer,
    next,
    prev,
    start,
    resume,
    restart,
  } = useAssessment();

  const { checkSession } = usePayment();
  const prevPhase = useRef(phase);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (sessionId) {
      checkSession(sessionId).then(() => {
        window.history.replaceState({}, "", window.location.pathname);
      });
    }
  }, [checkSession]);

  useEffect(() => {
    if (prevPhase.current === "intro" && phase === "test") {
      trackTestStarted("all");
    }
    if (prevPhase.current === "test" && phase === "results") {
      trackTestCompleted("strengths", totalQuestions);
      storeProfile(results);
    }
    prevPhase.current = phase;
  }, [phase, totalQuestions, results]);

  async function storeProfile(results: StrengthScore[]) {
    if (isProfileStored()) return;
    if (!results || results.length === 0) return;
    try {
      const profileHash = await generateProfileHash(results);
      setStoredProfileHash(profileHash);

      let referralCode = getStoredReferralCode();
      if (!referralCode) {
        referralCode = generateReferralCode();
        setStoredReferralCode(referralCode);
      }

      const personality = derivePersonalityType(results);
      const enneagram = deriveEnneagram(results);
      const disc = deriveDISC(results);
      const strengthScores = extractStrengthScores(results);

      await storeProfileToServer(
        profileHash,
        referralCode,
        personality.type,
        disc.style,
        disc.primary.code,
        disc.primary.score,
        disc.secondary.code,
        disc.secondary.score,
        enneagram.primary.type,
        enneagram.primary.score,
        enneagram.wingLabel,
        results.slice(0, 5).map((r) => r.strength.id),
        strengthScores,
      );
      setProfileStored();
    } catch (err) {
      console.error("Failed to store profile:", err);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      setInviteRef(ref);
    }
  }, []);

  const handleStart = () => {
    start();
  };

  const handleResume = () => {
    trackTestStarted("all");
    resume();
  };

  return (
    <div className="app">
      <SEOHead
        title="1Test — One Test. Four Frameworks. Know Yourself."
        description="Take one free 15-minute test and get your Strengths, 16 Personalities, DISC, and Enneagram results. No extra tests needed."
        canonicalUrl="https://1test.me/"
      />
      <InviteBanner />
      {phase === "intro" && (
        <IntroScreen
          onStart={handleStart}
          onResume={handleResume}
          hasSavedProgress={hasSavedProgress}
        />
      )}

      {phase === "test" && currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          index={currentIndex}
          total={totalQuestions}
          progress={progress}
          value={answers[currentQuestion.id]}
          onAnswer={setAnswer}
          onNext={next}
          onPrev={prev}
          canGoPrev={currentIndex > 0}
        />
      )}

      {phase === "results" && (
        <ResultsScreen
          results={results}
          onRestart={() => {
            restart();
          }}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <PaymentProvider>
      <AppInner />
    </PaymentProvider>
  );
}

export default App;