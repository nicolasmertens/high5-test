import { useState, useEffect, useRef, useCallback } from "react";
import { type PersonalityResult, type DISCResult } from "../../../data/derivations";
import {
  INDUSTRY_OPTIONS,
  type IndustryOption,
  computeCareerAlignment,
  type CareerAlignmentResult,
  type IndustryMatch,
} from "../../../data/careerAlignmentData";
import {
  trackCareerAlignmentViewed,
  trackCareerAlignmentSubmitted,
  trackLinkedInConnect,
  trackLinkedInDisconnect,
} from "../../../utils/analytics";
import { getStoredProfileHash } from "../../../utils/profile";

const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID as string | undefined;
const LINKEDIN_LS_KEY = "1test-linkedin-connected";

interface LinkedInData {
  name: string;
  headline: string | null;
  pictureUrl: string | null;
}

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
  strong: "#10b981",
  partial: "#f59e0b",
  mismatch: "#ef4444",
};

function ScoreGauge({ score }: { score: number }) {
  return (
    <div className="ca-gauge-wrap">
      <div className="ca-gauge-bar">
        <div
          className="ca-gauge-fill"
          style={{
            width: `${score}%`,
            background: score >= 70 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444",
          }}
        />
      </div>
      <span className="ca-gauge-score">
        {score}
        <span className="ca-gauge-max">/100</span>
      </span>
    </div>
  );
}

function buildLinkedInAuthUrl(profileHash: string): string {
  const state = btoa(profileHash);
  const params = new URLSearchParams({
    response_type: "code",
    client_id: LINKEDIN_CLIENT_ID!,
    redirect_uri: `${window.location.origin}/api/linkedin/callback`,
    state,
    scope: "openid profile email r_profile_basicinfo w_member_social",
  });
  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}

export function CareerAlignmentBlock({ personality, disc }: Props) {
  const [state, setState] = useState<State>("idle");
  const [jobTitle, setJobTitle] = useState("");
  const [industry, setIndustry] = useState<IndustryOption | "">("");
  const [result, setResult] = useState<CareerAlignmentResult | null>(null);
  const [linkedIn, setLinkedIn] = useState<LinkedInData | null>(null);
  const [linkedInLoading, setLinkedInLoading] = useState(false);
  const tracked = useRef(false);

  // Fetch LinkedIn profile if we know user has connected
  const fetchLinkedIn = useCallback(async (profileHash: string) => {
    setLinkedInLoading(true);
    try {
      const res = await fetch(`/api/linkedin/get?profileHash=${profileHash}`);
      if (!res.ok) {
        localStorage.removeItem(LINKEDIN_LS_KEY);
        return;
      }
      const data = await res.json() as { connected: boolean; name?: string; headline?: string | null; pictureUrl?: string | null };
      if (data.connected) {
        setLinkedIn({ name: data.name ?? "", headline: data.headline ?? null, pictureUrl: data.pictureUrl ?? null });
        if (data.headline) setJobTitle(data.headline);
      } else {
        localStorage.removeItem(LINKEDIN_LS_KEY);
      }
    } catch {
      // silently ignore fetch errors
    } finally {
      setLinkedInLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true;
      trackCareerAlignmentViewed();
    }

    const profileHash = getStoredProfileHash();
    if (!profileHash) return;

    // Check URL param from OAuth return
    const params = new URLSearchParams(window.location.search);
    if (params.get("linkedin_connected") === "true") {
      localStorage.setItem(LINKEDIN_LS_KEY, "true");
      // Clean URL param
      const clean = new URL(window.location.href);
      clean.searchParams.delete("linkedin_connected");
      window.history.replaceState({}, "", clean.toString());
      fetchLinkedIn(profileHash);
      return;
    }

    if (localStorage.getItem(LINKEDIN_LS_KEY) === "true") {
      fetchLinkedIn(profileHash);
    }
  }, [fetchLinkedIn]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!jobTitle.trim() || !industry) return;
    const r = computeCareerAlignment(
      jobTitle.trim(),
      industry as IndustryOption,
      disc.style,
      personality.type,
    );
    setResult(r);
    setState("done");
    trackCareerAlignmentSubmitted(disc.style, personality.type, r.roleScore, r.industryMatch);
  }

  function handleReset() {
    setState("idle");
    setResult(null);
    if (!linkedIn?.headline) setJobTitle("");
    setIndustry("");
  }

  async function handleDisconnect() {
    const profileHash = getStoredProfileHash();
    if (profileHash) {
      await fetch("/api/linkedin/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileHash }),
      }).catch(() => {});
    }
    localStorage.removeItem(LINKEDIN_LS_KEY);
    setLinkedIn(null);
    setJobTitle("");
    setIndustry("");
    setState("idle");
    setResult(null);
    trackLinkedInDisconnect();
  }

  function handleLinkedInConnect() {
    const profileHash = getStoredProfileHash();
    if (!profileHash || !LINKEDIN_CLIENT_ID) return;
    trackLinkedInConnect();
    window.location.href = buildLinkedInAuthUrl(profileHash);
  }

  const showOAuthButton = !!LINKEDIN_CLIENT_ID && !linkedIn;

  return (
    <section className="branch-card">
      <div className="branch-icon">🎯</div>
      <h3>Career Alignment Analysis</h3>
      <p className="branch-desc">
        {linkedIn
          ? `Welcome, ${linkedIn.name}. We've pre-filled your current title from LinkedIn — adjust if needed and analyze your fit.`
          : `Enter your current role and industry — we'll show how well your career aligns with your `}
        {!linkedIn && (
          <>
            <strong>{disc.style} DISC</strong> style and <strong>{personality.type}</strong>{" "}
            personality.
          </>
        )}
      </p>

      {linkedIn && (
        <div className="ca-linkedin-badge">
          {linkedIn.pictureUrl && (
            <img className="ca-linkedin-pic" src={linkedIn.pictureUrl} alt="" />
          )}
          <span className="ca-linkedin-name">{linkedIn.name}</span>
          <button className="ca-linkedin-disconnect" onClick={() => void handleDisconnect()}>
            Disconnect
          </button>
        </div>
      )}

      {state === "idle" && (
        <form className="ca-form" onSubmit={handleSubmit}>
          <div className="ca-field">
            <label className="ca-label" htmlFor="ca-job-title">
              Current job title
            </label>
            <input
              id="ca-job-title"
              className="ca-input"
              type="text"
              placeholder={linkedInLoading ? "Loading from LinkedIn…" : "e.g. Senior Software Engineer"}
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              maxLength={100}
              disabled={linkedInLoading}
            />
          </div>
          <div className="ca-field">
            <label className="ca-label" htmlFor="ca-industry">
              Industry
            </label>
            <select
              id="ca-industry"
              className="ca-input ca-select"
              value={industry}
              onChange={(e) => setIndustry(e.target.value as IndustryOption)}
            >
              <option value="">Select your industry…</option>
              {INDUSTRY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="ca-actions">
            <button
              type="submit"
              className="ca-submit"
              disabled={!jobTitle.trim() || !industry || linkedInLoading}
            >
              Analyze my alignment
            </button>

            {showOAuthButton && (
              <button type="button" className="ca-linkedin-btn" onClick={handleLinkedInConnect}>
                <span className="ca-linkedin-icon">in</span>
                Auto-fill from LinkedIn
              </button>
            )}
          </div>
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
                <span key={role} className="career-tag">
                  {role}
                </span>
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
