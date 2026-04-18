import { useState, useEffect, useRef } from "react";
import { type PersonalityResult, type DISCResult } from "../../../data/derivations";
import {
  INDUSTRY_OPTIONS,
  type IndustryOption,
  computeCareerAlignment,
  type CareerAlignmentResult,
  type IndustryMatch,
} from "../../../data/careerAlignmentData";
import { trackCareerAlignmentViewed, trackCareerAlignmentSubmitted } from "../../../utils/analytics";

interface Props {
  personality: PersonalityResult;
  disc: DISCResult;
}

type State = "idle" | "done";

const INDUSTRY_MATCH_LABEL: Record<IndustryMatch, string> = {
  strong: "Strong match",
  partial: "Partial match",
  mismatch: "Weak match",
};

const INDUSTRY_MATCH_COLOR: Record<IndustryMatch, string> = {
  strong: "#48bb78",
  partial: "#f6ad55",
  mismatch: "#e53e3e",
};

function ScoreGauge({ score }: { score: number }) {
  return (
    <div className="ca-gauge-wrap">
      <div className="ca-gauge-bar">
        <div
          className="ca-gauge-fill"
          style={{ width: `${score}%`, background: score >= 70 ? "#48bb78" : score >= 50 ? "#f6ad55" : "#e53e3e" }}
        />
      </div>
      <span className="ca-gauge-score">{score}<span className="ca-gauge-max">/100</span></span>
    </div>
  );
}

export function CareerAlignmentBlock({ personality, disc }: Props) {
  const [state, setState] = useState<State>("idle");
  const [jobTitle, setJobTitle] = useState("");
  const [industry, setIndustry] = useState<IndustryOption | "">("");
  const [result, setResult] = useState<CareerAlignmentResult | null>(null);
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true;
      trackCareerAlignmentViewed();
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!jobTitle.trim() || !industry) return;
    const r = computeCareerAlignment(jobTitle.trim(), industry as IndustryOption, disc.style, personality.type);
    setResult(r);
    setState("done");
    trackCareerAlignmentSubmitted(disc.style, personality.type, r.roleScore, r.industryMatch);
  }

  function handleReset() {
    setState("idle");
    setResult(null);
    setJobTitle("");
    setIndustry("");
  }

  return (
    <section className="branch-card">
      <div className="branch-icon">🎯</div>
      <h3>Career Alignment Analysis</h3>
      <p className="branch-desc">
        Enter your current role and industry — we'll show how well your career aligns with your{" "}
        <strong>{disc.style} DISC</strong> style and <strong>{personality.type}</strong> personality.
      </p>

      {state === "idle" && (
        <form className="ca-form" onSubmit={handleSubmit}>
          <div className="ca-field">
            <label className="ca-label" htmlFor="ca-job-title">Current job title</label>
            <input
              id="ca-job-title"
              className="ca-input"
              type="text"
              placeholder="e.g. Senior Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              maxLength={100}
            />
          </div>
          <div className="ca-field">
            <label className="ca-label" htmlFor="ca-industry">Industry</label>
            <select
              id="ca-industry"
              className="ca-input ca-select"
              value={industry}
              onChange={(e) => setIndustry(e.target.value as IndustryOption)}
            >
              <option value="">Select your industry…</option>
              {INDUSTRY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="ca-submit"
            disabled={!jobTitle.trim() || !industry}
          >
            Analyze my alignment
          </button>
        </form>
      )}

      {state === "done" && result && (
        <div className="ca-results">
          <div className="ca-result-row">
            <div className="ca-result-label">Role fit score</div>
            <ScoreGauge score={result.roleScore} />
          </div>

          <div className="ca-result-row">
            <div className="ca-result-label">Industry match</div>
            <span
              className="ca-match-badge"
              style={{ background: INDUSTRY_MATCH_COLOR[result.industryMatch] }}
            >
              {INDUSTRY_MATCH_LABEL[result.industryMatch]}
            </span>
          </div>

          <div className="ca-pivot-section">
            <div className="ca-pivot-title">Roles that fit your profile better</div>
            <div className="career-tags">
              {result.pivotRoles.map((role) => (
                <span key={role} className="career-tag">{role}</span>
              ))}
            </div>
          </div>

          <button className="ca-reset" onClick={handleReset}>
            Try a different role
          </button>
        </div>
      )}
    </section>
  );
}
