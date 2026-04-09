import { useAssessment } from "./hooks/useAssessment";
import { IntroScreen } from "./components/IntroScreen";
import { QuestionCard } from "./components/QuestionCard";
import { ResultsScreen } from "./components/ResultsScreen";
import "./App.css";

function App() {
  const {
    phase,
    currentIndex,
    currentQuestion,
    totalQuestions,
    progress,
    answers,
    results,
    setAnswer,
    next,
    prev,
    start,
    restart,
  } = useAssessment();

  return (
    <div className="app">
      {phase === "intro" && <IntroScreen onStart={start} />}

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

export default App;
