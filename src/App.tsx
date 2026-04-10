import { useEffect } from "react";
import { useAssessment } from "./hooks/useAssessment";
import { IntroScreen } from "./components/IntroScreen";
import { QuestionCard } from "./components/QuestionCard";
import { ResultsScreen } from "./components/ResultsScreen";
import { PaymentProvider, usePayment } from "./contexts/PaymentContext";
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (sessionId) {
      checkSession(sessionId).then(() => {
        window.history.replaceState({}, "", window.location.pathname);
      });
    }
  }, [checkSession]);

  return (
    <div className="app">
      {phase === "intro" && (
        <IntroScreen
          onStart={start}
          onResume={resume}
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
        <ResultsScreen results={results} onRestart={restart} />
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