import { useState, useMemo, useCallback } from "react";
import {
  questions,
  strengths,
  shuffleQuestions,
  type Question,
  type Strength,
} from "../data/strengths";

export interface StrengthScore {
  strength: Strength;
  score: number; // 0-100
  rank: number;
}

export type Phase = "intro" | "test" | "results";

export function useAssessment() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const shuffled = useMemo(() => shuffleQuestions(questions), []);

  const currentQuestion: Question | undefined = shuffled[currentIndex];
  const progress = (Object.keys(answers).length / shuffled.length) * 100;

  const setAnswer = useCallback(
    (questionId: number, value: number) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    },
    []
  );

  const next = useCallback(() => {
    if (currentIndex < shuffled.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setPhase("results");
    }
  }, [currentIndex, shuffled.length]);

  const prev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const start = useCallback(() => {
    setPhase("test");
    setCurrentIndex(0);
    setAnswers({});
  }, []);

  const restart = useCallback(() => {
    setPhase("intro");
    setCurrentIndex(0);
    setAnswers({});
  }, []);

  // Scoring: for each strength, average its 6 question scores (0-100)
  // Reversed items: score = 100 - raw
  const results: StrengthScore[] = useMemo(() => {
    if (phase !== "results") return [];

    const scoreMap: Record<string, number[]> = {};
    for (const q of questions) {
      const raw = answers[q.id];
      if (raw === undefined) continue;
      const adjusted = q.keyed === "minus" ? 100 - raw : raw;
      if (!scoreMap[q.strengthId]) scoreMap[q.strengthId] = [];
      scoreMap[q.strengthId].push(adjusted);
    }

    const scored = strengths.map((s) => {
      const vals = scoreMap[s.id] || [];
      const avg = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      return { strength: s, score: Math.round(avg), rank: 0 };
    });

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);
    scored.forEach((s, i) => (s.rank = i + 1));

    return scored;
  }, [phase, answers]);

  return {
    phase,
    currentIndex,
    currentQuestion,
    totalQuestions: shuffled.length,
    progress,
    answers,
    results,
    setAnswer,
    next,
    prev,
    start,
    restart,
  };
}
