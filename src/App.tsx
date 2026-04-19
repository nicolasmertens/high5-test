import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAssessment } from "./hooks/useAssessment";
import { QuestionCard } from "./components/QuestionCard";
import { ResultsScreen } from "./components/ResultsScreen";
import { EmailGate } from "./components/EmailGate";
import { PaymentProvider, usePayment } from "./contexts/PaymentContext";
import { SEOHead } from "./components/SEOHead";
import { InviteBanner } from "./components/InviteBanner";
import {
  trackTestStarted,
  trackTestCompleted,
} from "./utils/analytics";
import { getVariant, trackExperimentView } from "./utils/abTesting";
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

  const { t } = useTranslation();
  const { checkSession } = usePayment();
  const prevPhase = useRef(phase);
  const trackedStartRef = useRef(false);
  const emailCaptureVariant = useRef(getVariant("email_capture_moment"));
  const [emailGatePassed, setEmailGatePassed] = useState(false);

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
    if (phase === "test" && !trackedStartRef.current) {
      trackTestStarted("all");
      trackedStartRef.current = true;
    }
    if (prevPhase.current === "test" && phase === "results") {
      trackTestCompleted("strengths", totalQuestions);
      storeProfile(results);
      trackExperimentView("email_capture_moment", emailCaptureVariant.current);
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

  return (
    <div className="app">
      <SEOHead
        title="1Test — One Test. Four Frameworks. Know Yourself."
        description="Take one free 15-minute test and get your Strengths, 16 Personalities, DISC, and Enneagram results. No extra tests needed."
        canonicalUrl="https://1test.me/"
      />
      <InviteBanner />
      {phase === "intro" && hasSavedProgress && (
        <div className="resume-card">
          <p className="resume-card-prompt">{t("intro.continueWhere")}</p>
          <div className="resume-card-actions">
            <button className="btn-start" onClick={resume}>
              {t("intro.continueWhere")}
            </button>
            <button className="btn-start btn-start-secondary" onClick={start}>
              {t("intro.startOver")}
            </button>
          </div>
        </div>
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

      {phase === "results" && emailCaptureVariant.current === "B" && !emailGatePassed && (
        <EmailGate
          frameworkName="Strengths"
          frameworkType={results[0]?.strength?.name || "Achiever"}
          oneSentenceTraitSummary={results[0]?.strength?.description || "You have unique strengths that set you apart"}
          onUnlocked={() => setEmailGatePassed(true)}
        />
      )}

      {phase === "results" && (emailCaptureVariant.current !== "B" || emailGatePassed) && (
        <ResultsScreen
          results={results}
          onRestart={() => {
            restart();
            setEmailGatePassed(false);
          }}
          emailCaptureVariant={emailCaptureVariant.current}
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