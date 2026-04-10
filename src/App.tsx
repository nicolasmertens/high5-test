import { useEffect, useRef } from "react";
import { useAssessment } from "./hooks/useAssessment";
import { IntroScreen } from "./components/IntroScreen";
import { QuestionCard } from "./components/QuestionCard";
import { ResultsScreen } from "./components/ResultsScreen";
import { PaymentProvider, usePayment } from "./contexts/PaymentContext";
import {
  trackTestStarted,
  trackTestCompleted,
  trackResultsViewed,
} from "./utils/analytics";
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
  const resultsTracked = useRef(false);

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
    }
    prevPhase.current = phase;
  }, [phase, totalQuestions]);

  useEffect(() => {
    if (phase === "results" && results.length > 0 && !resultsTracked.current) {
      resultsTracked.current = true;
      const top5 = results.slice(0, 5);
      trackResultsViewed({
        framework: "strengths",
        top_strength: top5[0]?.strength?.name,
      });
    }
  }, [phase, results]);

  const handleStart = () => {
    start();
  };

  const handleResume = () => {
    trackTestStarted("all");
    resume();
  };

  return (
    <div className="app">
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
            resultsTracked.current = false;
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