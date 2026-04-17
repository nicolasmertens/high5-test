import { useEffect, useCallback, useState, useRef } from "react";
import { type Question } from "../data/strengths";
import { trackQuestionAnswered } from "../utils/analytics";

interface Props {
  question: Question;
  index: number;
  total: number;
  progress: number;
  value: number | undefined;
  onAnswer: (questionId: number, value: number) => void;
  onNext: () => void;
  onPrev: () => void;
  canGoPrev: boolean;
}

const labels = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];

const MILESTONES = [25, 50, 75, 100];

export function QuestionCard({
  question,
  index,
  total,
  progress,
  value,
  onAnswer,
  onNext,
  onPrev,
  canGoPrev,
}: Props) {
  const hasAnswered = value !== undefined;
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [showSaved, setShowSaved] = useState(false);
  const trackedMilestones = useRef(new Set<number>());

  useEffect(() => {
    const completionPct = Math.round(((index + 1) / total) * 100);
    for (const milestone of MILESTONES) {
      if (completionPct >= milestone && !trackedMilestones.current.has(milestone)) {
        trackedMilestones.current.add(milestone);
        trackQuestionAnswered(index + 1, total, "strengths");
      }
    }
  }, [index, total]);

  // Transition animation on question change
  useEffect(() => {
    setAnimating(true);
    const t = setTimeout(() => setAnimating(false), 200);
    return () => clearTimeout(t);
  }, [question.id]);

  const handleNext = useCallback(() => {
    if (!hasAnswered) return;
    setDirection("next");
    onNext();
  }, [hasAnswered, onNext]);

  const handlePrev = useCallback(() => {
    if (!canGoPrev) return;
    setDirection("prev");
    onPrev();
  }, [canGoPrev, onPrev]);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        // Nudge slider up by 5
        const current = value ?? 50;
        onAnswer(question.id, Math.min(100, current + 5));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const current = value ?? 50;
        onAnswer(question.id, Math.max(0, current - 5));
      } else if (e.key >= "1" && e.key <= "5") {
        e.preventDefault();
        // Quick select: 1=0, 2=25, 3=50, 4=75, 5=100
        const val = (Number(e.key) - 1) * 25;
        onAnswer(question.id, val);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleNext, handlePrev, value, question.id, onAnswer]);

  const handleSliderClick = () => {
    if (!hasAnswered) {
      onAnswer(question.id, 50);
    }
  };

  useEffect(() => {
    if (value !== undefined) {
      setShowSaved(true);
      const t = setTimeout(() => setShowSaved(false), 1500);
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <div className="question-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="progress-text">
        {index + 1} / {total}
        {showSaved && <span className="progress-saved">Progress saved</span>}
      </div>

      <div
        className={`question-card ${animating ? `slide-${direction}` : ""}`}
      >
        <p className="question-text">&ldquo;{question.text}&rdquo;</p>

        <div
          className={`slider-container ${!hasAnswered ? "slider-inactive" : ""}`}
          onClick={handleSliderClick}
        >
          <input
            type="range"
            min={0}
            max={100}
            value={hasAnswered ? value : 50}
            onChange={(e) => onAnswer(question.id, Number(e.target.value))}
            className={`slider ${!hasAnswered ? "slider-hidden" : ""}`}
          />
          <div className="slider-labels">
            {labels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          {!hasAnswered && (
            <p className="slider-prompt">
              Drag the slider or press 1-5 to answer
            </p>
          )}
        </div>

        <div className="question-nav">
          <button
            className="btn-nav"
            onClick={handlePrev}
            disabled={!canGoPrev}
          >
            Back
          </button>
          <button
            className="btn-nav btn-next"
            onClick={handleNext}
            disabled={!hasAnswered}
          >
            {index === total - 1 ? "See Results" : "Next"}
          </button>
        </div>

        <div className="keyboard-legend">
          <span><kbd>&larr;</kbd> Back</span>
          <span><kbd>&uarr;</kbd><kbd>&darr;</kbd> Adjust</span>
          <span><kbd>1</kbd>-<kbd>5</kbd> Quick pick</span>
          <span><kbd>&rarr;</kbd> Next</span>
        </div>
      </div>
    </div>
  );
}
