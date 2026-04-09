import { useState, useMemo, useCallback, useEffect } from "react";
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

const STORAGE_KEY = "top5-progress";

interface SavedProgress {
  answers: Record<number, number>;
  currentIndex: number;
  shuffleOrder: number[]; // question IDs in shuffled order
}

function loadProgress(): SavedProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveProgress(data: SavedProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full or unavailable
  }
}

function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}

export function useAssessment() {
  const saved = useMemo(() => loadProgress(), []);

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  // If we have saved progress, reconstruct the same shuffle order
  const shuffled = useMemo(() => {
    if (saved) {
      const byId = new Map(questions.map((q) => [q.id, q]));
      const restored = saved.shuffleOrder
        .map((id) => byId.get(id))
        .filter((q): q is Question => q !== undefined);
      if (restored.length === questions.length) return restored;
    }
    return shuffleQuestions(questions);
  }, [saved]);

  const hasSavedProgress = saved !== null && Object.keys(saved.answers).length > 0;

  const currentQuestion: Question | undefined = shuffled[currentIndex];
  const progress = (Object.keys(answers).length / shuffled.length) * 100;

  // Persist to localStorage on every answer
  useEffect(() => {
    if (phase === "test" && Object.keys(answers).length > 0) {
      saveProgress({
        answers,
        currentIndex,
        shuffleOrder: shuffled.map((q) => q.id),
      });
    }
  }, [answers, currentIndex, phase, shuffled]);

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
      clearProgress();
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
    clearProgress();
  }, []);

  const resume = useCallback(() => {
    if (saved) {
      setPhase("test");
      setCurrentIndex(saved.currentIndex);
      setAnswers(saved.answers);
    }
  }, [saved]);

  const restart = useCallback(() => {
    setPhase("intro");
    setCurrentIndex(0);
    setAnswers({});
    clearProgress();
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
      const avg =
        vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
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
    hasSavedProgress,
    setAnswer,
    next,
    prev,
    start,
    resume,
    restart,
  };
}
