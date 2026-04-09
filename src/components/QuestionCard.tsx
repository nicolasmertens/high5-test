import { type Question } from "../data/strengths";

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
  const sliderValue = value ?? 50;
  const hasAnswered = value !== undefined;

  return (
    <div className="question-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="progress-text">
        {index + 1} / {total}
      </div>

      <div className="question-card">
        <p className="question-text">"{question.text}"</p>

        <div className="slider-container">
          <input
            type="range"
            min={0}
            max={100}
            value={sliderValue}
            onChange={(e) => onAnswer(question.id, Number(e.target.value))}
            className="slider"
          />
          <div className="slider-labels">
            {labels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>

        <div className="question-nav">
          <button
            className="btn-nav"
            onClick={onPrev}
            disabled={!canGoPrev}
          >
            Back
          </button>
          <button
            className="btn-nav btn-next"
            onClick={onNext}
            disabled={!hasAnswered}
          >
            {index === total - 1 ? "See Results" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
