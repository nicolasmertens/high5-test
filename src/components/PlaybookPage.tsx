import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SEOHead } from "./SEOHead";
import { UpgradePrompt } from "./UpgradePrompt";
import { usePayment } from "../contexts/PaymentContext";
import { getCareerSuggestions, getStressInfo, getLeadershipStyle } from "./ActionBranches";

interface PlaybookData {
  personalityType: string;
  personalityLabel: string;
  discStyle: string;
  discPrimary: string;
  enneagramWing: string;
  enneagramPrimary: number;
  topStrengths: string[];
  strengthScores: Record<string, number>;
}

function getGrowthPlan(personalityType: string): { phase: string; focus: string; actions: string[] }[] {
  const plans: Record<string, { phase: string; focus: string; actions: string[] }[]> = {
    NT: [
      { phase: "Days 1–30", focus: "Build systems", actions: ["Document your decision-making framework", "Set up a weekly review process", "Identify one area where you overthink and set a time limit"] },
      { phase: "Days 31–60", focus: "Expand influence", actions: ["Share your analytical insights publicly (blog, LinkedIn)", "Seek feedback from someone with a different style", "Lead one meeting with a structured agenda"] },
      { phase: "Days 61–90", focus: "Deepen impact", actions: ["Teach your framework to someone else", "Take on a cross-functional project", "Identify your next skill to master"] },
    ],
    NF: [
      { phase: "Days 1–30", focus: "Clarify purpose", actions: ["Write your personal mission statement", "Identify three causes you care about deeply", "Schedule one meaningful conversation per week"] },
      { phase: "Days 31–60", focus: "Build connections", actions: ["Join or create a community around your values", "Mentor someone who shares your passion", "Practice saying no to things that don't align"] },
      { phase: "Days 61–90", focus: "Create change", actions: ["Launch one initiative that serves others", "Write or speak about what you've learned", "Design your ideal work-life rhythm"] },
    ],
    SJ: [
      { phase: "Days 1–30", focus: "Optimize systems", actions: ["Audit your current workflows for inefficiency", "Create a 90-day plan with clear milestones", "Build one new habit that supports your goals"] },
      { phase: "Days 31–60", focus: "Develop flexibility", actions: ["Try one approach outside your comfort zone", "Delegate a task you normally handle yourself", "Schedule unstructured time for creative thinking"] },
      { phase: "Days 61–90", focus: "Scale your reliability", actions: ["Document your processes so others can follow", "Train someone to take over one responsibility", "Set up systems that run without you"] },
    ],
    SP: [
      { phase: "Days 1–30", focus: "Channel energy", actions: ["Pick one project and commit to finishing it", "Set up accountability with a friend or coach", "Create a daily routine that includes reflection"] },
      { phase: "Days 31–60", focus: "Build depth", actions: ["Go deeper in one skill instead of starting something new", "Get feedback from someone you trust", "Practice patience in one area where you usually rush"] },
      { phase: "Days 61–90", focus: "Create lasting impact", actions: ["Turn your best idea into a repeatable process", "Teach someone what you've learned by doing", "Plan the next quarter before acting on it"] },
    ],
  };

  const group = personalityType.includes("NT") ? "NT"
    : personalityType.includes("NF") ? "NF"
    : personalityType.includes("SJ") ? "SJ"
    : "SP";

  return plans[group] || plans["NT"];
}

function getCommunicationGuide(discCode: string): { style: string; tips: string[] } {
  const guides: Record<string, { style: string; tips: string[] }> = {
    D: {
      style: "Direct and results-driven",
      tips: [
        "Lead with conclusions, then provide supporting data",
        "When disagreeing, focus on outcomes not process",
        "Give others time to process — don't rush decisions",
        "Practice asking 'What do you think?' before deciding",
      ],
    },
    I: {
      style: "Enthusiastic and people-focused",
      tips: [
        "Balance stories with concrete next steps",
        "Follow up enthusiasm with written commitments",
        "Listen for the details behind others' excitement",
        "Check in on quiet team members who may not speak up",
      ],
    },
    S: {
      style: "Patient and supportive",
      tips: [
        "Practice speaking up early in meetings",
        "Prepare your points before discussions so you're ready",
        "Don't over-accommodate — your opinion matters too",
        "Set boundaries when others lean on you too heavily",
      ],
    },
    C: {
      style: "Thorough and detail-oriented",
      tips: [
        "Share your analysis in stages, not all at once",
        "Lead with the recommendation, then show the work",
        "Accept 'good enough' when speed matters more than perfection",
        "Build trust by delivering on time, not just accurately",
      ],
    },
  };
  return guides[discCode] || guides["I"];
}

export function PlaybookPage() {
  const [searchParams] = useSearchParams();
  const { isPaid, email } = usePayment();
  const [playbookStatus, setPlaybookStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<PlaybookData | null>(null);

  useEffect(() => {
    const hash = searchParams.get("profile");
    if (!hash) {
      setLoading(false);
      return;
    }

    Promise.all([
      fetch(`/api/get-profile?hash=${hash}`).then((r) => r.ok ? r.json() : null),
      email ? fetch(`/api/playbook/status?email=${encodeURIComponent(email)}`).then((r) => r.ok ? r.json() : null) : Promise.resolve(null),
    ])
      .then(([profile, status]) => {
        if (profile) {
          setProfileData({
            personalityType: profile.personalityType,
            personalityLabel: "",
            discStyle: profile.discStyle,
            discPrimary: profile.discPrimary,
            enneagramWing: profile.enneagramWing,
            enneagramPrimary: profile.enneagramPrimary,
            topStrengths: profile.topStrengths,
            strengthScores: profile.strengthScores,
          });
        }
        if (status) {
          setPlaybookStatus(status.status);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [searchParams, email]);

  const growthPlan = useMemo(() => {
    if (!profileData) return [];
    return getGrowthPlan(profileData.personalityType);
  }, [profileData]);

  const commGuide = useMemo(() => {
    if (!profileData) return null;
    return getCommunicationGuide(profileData.discPrimary);
  }, [profileData]);

  const careers = useMemo(() => {
    if (!profileData) return [];
    return getCareerSuggestions(profileData.personalityType, profileData.topStrengths.map((s, i) => ({ strength: { id: s, name: s }, score: 100 - i * 5 } as any)));
  }, [profileData]);

  const stress = useMemo(() => {
    if (!profileData) return null;
    return getStressInfo(profileData.enneagramPrimary);
  }, [profileData]);

  const leadership = useMemo(() => {
    if (!profileData) return "";
    return getLeadershipStyle(profileData.discPrimary, profileData.personalityType);
  }, [profileData]);

  if (loading) {
    return (
      <div className="playbook-page">
        <SEOHead title="AI Playbook — 1Test" description="Your personalized growth plan" canonicalUrl="https://1test.me/playbook" />
        <div className="playbook-loading">
          <div className="compare-spinner" />
          <p>Loading your playbook...</p>
        </div>
      </div>
    );
  }

  if (!isPaid || !profileData) {
    return (
      <div className="playbook-page">
        <SEOHead title="AI Playbook — 1Test" description="Your personalized growth plan" canonicalUrl="https://1test.me/playbook" />
        <div className="playbook-locked">
          <h2>Your Personalized Playbook</h2>
          <p>Unlock your AI-generated playbook with career paths, communication guide, and 30/60/90 day growth plan.</p>
          <UpgradePrompt variant="teaser" />
        </div>
      </div>
    );
  }

  const handleGenerate = async () => {
    if (!email || !profileData) return;
    try {
      await fetch("/api/playbook/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          profileHash: searchParams.get("profile"),
          personalityType: profileData.personalityType,
          topStrengths: profileData.topStrengths,
          discStyle: profileData.discStyle,
          enneagramWing: profileData.enneagramWing,
        }),
      });
      setPlaybookStatus("pending");
    } catch {}
  };

  return (
    <div className="playbook-page">
      <SEOHead
        title={`Playbook for ${profileData.personalityType} — 1Test`}
        description={`Your personalized AI playbook: growth plan, career paths, and communication guide for ${profileData.personalityType}`}
        canonicalUrl="https://1test.me/playbook"
      />

      <div className="playbook-header">
        <span className="playbook-badge">AI PLAYBOOK</span>
        <h1>Your Personalized Growth Plan</h1>
        <p className="playbook-subtitle">
          Built for <strong>{profileData.personalityType}</strong> with {profileData.discStyle} DISC and Enneagram {profileData.enneagramWing}
        </p>
      </div>

      {playbookStatus === "not_requested" && (
        <div className="playbook-generate-section">
          <p>Your playbook is ready to generate. This creates a personalized action plan based on your unique profile.</p>
          <button className="btn-start btn-upgrade" onClick={handleGenerate}>
            Generate My Playbook
          </button>
        </div>
      )}

      {playbookStatus === "pending" && (
        <div className="playbook-generate-section">
          <p>Your playbook is being generated. This usually takes 1-2 minutes.</p>
          <button className="btn-start" onClick={() => window.location.reload()}>
            Check Status
          </button>
        </div>
      )}

      {(playbookStatus === "completed" || !playbookStatus || playbookStatus === "not_requested") && (
        <>
          <section className="playbook-section">
            <div className="playbook-section-icon">📈</div>
            <h2>30 / 60 / 90 Day Growth Plan</h2>
            <div className="growth-phases">
              {growthPlan.map((phase) => (
                <div key={phase.phase} className="growth-phase">
                  <h3>{phase.phase}</h3>
                  <p className="growth-focus">{phase.focus}</p>
                  <ul className="growth-actions">
                    {phase.actions.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="playbook-section">
            <div className="playbook-section-icon">💼</div>
            <h2>Career Paths Matched to You</h2>
            <p className="playbook-section-desc">
              Based on your {profileData.personalityType} profile, these directions align with your natural strengths and thinking style.
            </p>
            <div className="career-tags">
              {careers.map((c) => (
                <span key={c} className="career-tag">{c}</span>
              ))}
            </div>
          </section>

          {commGuide && (
            <section className="playbook-section">
              <div className="playbook-section-icon">💬</div>
              <h2>Communication Guide</h2>
              <p className="playbook-section-desc">
                Your style: <strong>{commGuide.style}</strong>
              </p>
              <ul className="comm-guide-tips">
                {commGuide.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </section>
          )}

          {stress && (
            <section className="playbook-section">
              <div className="playbook-section-icon">⚡</div>
              <h2>Stress Management</h2>
              <div className="stress-grid">
                <div className="stress-item stress-normal">
                  <strong>At your best</strong>
                  <p>{stress.best}</p>
                </div>
                <div className="stress-item stress-bad">
                  <strong>Under stress</strong>
                  <p>{stress.stress}</p>
                </div>
              </div>
            </section>
          )}

          <section className="playbook-section">
            <div className="playbook-section-icon">👑</div>
            <h2>Leadership Development</h2>
            <p className="playbook-section-desc">{leadership}</p>
          </section>

          <section className="playbook-section playbook-top-strengths">
            <div className="playbook-section-icon">💪</div>
            <h2>Your Strengths Profile</h2>
            <div className="playbook-strength-list">
              {profileData.topStrengths.map((s, i) => (
                <div key={s} className="playbook-strength-item">
                  <span className="playbook-strength-rank">#{i + 1}</span>
                  <span className="playbook-strength-name">{s}</span>
                  <span className="playbook-strength-score">{profileData.strengthScores[s] || 0}%</span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <div className="playbook-actions">
        <a href="/" className="btn-start">Back to Home</a>
      </div>
    </div>
  );
}
