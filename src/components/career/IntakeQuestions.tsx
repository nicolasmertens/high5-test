import { useState, useEffect, useRef } from "react";
import {
  type IntakeAnswers,
  type AgeRange,
  type CareerStage,
  type TestReason,
  AGE_RANGES,
  CAREER_STAGES,
  TEST_REASONS,
  saveIntakeAnswers,
  loadIntakeAnswers,
} from "../../careerData/segmentConfig";
import { trackCTAClicked, trackCareerIntakeCompleted } from "../../utils/analytics";

interface Props {
  onComplete: (answers: IntakeAnswers) => void;
  personalityType: string;
}

export function IntakeQuestions({ onComplete, personalityType: pType }: Props) {
  const [ageRange, setAgeRange] = useState<AgeRange | "">("");
  const [careerStage, setCareerStage] = useState<CareerStage | "">("");
  const [testReason, setTestReason] = useState<TestReason | "">("");
  const [collapsed, setCollapsed] = useState(false);
  const alreadyCompleted = useRef(false);

  useEffect(() => {
    const stored = loadIntakeAnswers();
    if (stored && !alreadyCompleted.current) {
      alreadyCompleted.current = true;
      setCollapsed(true);
      onComplete(stored);
    }
  }, [onComplete]);

  const canSubmit = ageRange && careerStage && testReason;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const answers: IntakeAnswers = {
      ageRange,
      careerStage,
      testReason,
    };
    saveIntakeAnswers(answers);
    trackCTAClicked({
      ctaText: "Submit career intake",
      ctaLocation: "career_intake",
    });
    trackCareerIntakeCompleted({
      ageRange: answers.ageRange,
      careerStage: answers.careerStage,
      testReason: answers.testReason,
      personalityType: pType,
    });
    alreadyCompleted.current = true;
    onComplete(answers);
  };

  if (collapsed) return null;

  return (
    <section className="branch-card career-intake">
      <div className="branch-icon">🧭</div>
      <h3>Where Are You In Your Career?</h3>
      <p className="branch-desc">
        Answer 3 quick questions so we can tailor career advice to your situation.
      </p>

      <div className="intake-form">
        <div className="intake-question">
          <label className="intake-label">What is your age range?</label>
          <div className="intake-options">
            {AGE_RANGES.map((opt) => (
              <button
                key={opt.value}
                className={`intake-option ${ageRange === opt.value ? "intake-option-selected" : ""}`}
                onClick={() => setAgeRange(opt.value)}
                type="button"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="intake-question">
          <label className="intake-label">What best describes your career stage?</label>
          <div className="intake-options">
            {CAREER_STAGES.map((opt) => (
              <button
                key={opt.value}
                className={`intake-option ${careerStage === opt.value ? "intake-option-selected" : ""}`}
                onClick={() => setCareerStage(opt.value)}
                type="button"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="intake-question">
          <label className="intake-label">Why are you taking this test?</label>
          <div className="intake-options">
            {TEST_REASONS.map((opt) => (
              <button
                key={opt.value}
                className={`intake-option ${testReason === opt.value ? "intake-option-selected" : ""}`}
                onClick={() => setTestReason(opt.value)}
                type="button"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          className="btn-start btn-career-submit"
          disabled={!canSubmit}
          onClick={handleSubmit}
          type="button"
        >
          See My Career Path
        </button>
      </div>
    </section>
  );
}