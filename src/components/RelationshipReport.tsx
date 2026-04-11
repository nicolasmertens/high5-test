import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { trackRelationshipReportViewed } from "../utils/analytics";

interface ProfileSummary {
  personalityType: string;
  personalityLabel: string;
  discStyle: string;
  discPrimary: string;
  enneagramWing: string;
  topStrengths: string[];
}

interface DISCCompatibilityDetail {
  score: number;
  typeA: string;
  typeB: string;
  howACommunicatesWithB: string;
  howBCommunicatesWithA: string;
  bestMeetingFormat: string;
  tips: string[];
}

interface StrengthsOverlapDetail {
  score: number;
  shared: string[];
  complementA: string[];
  complementB: string[];
  friction: string[];
}

interface PersonalityPairDetail {
  score: number;
  typeA: string;
  typeB: string;
  label: string;
  dynamic: string;
  tip: string;
}

interface EnneagramPairDetail {
  typeA: number;
  typeB: number;
  label: string;
  dynamic: string;
  atBest: string;
  underStress: string;
}

interface RelationshipReport {
  id: string;
  profileA: string;
  profileB: string;
  compatibilityScore: number;
  discCompatibility: DISCCompatibilityDetail;
  strengthsOverlap: StrengthsOverlapDetail;
  personalityInteraction: PersonalityPairDetail;
  enneagramConnection: EnneagramPairDetail;
  profileASummary: ProfileSummary;
  profileBSummary: ProfileSummary;
  createdAt: number;
}

const STRENGTH_NAMES: Record<string, string> = {
  believer: "Believer", deliverer: "Deliverer", focus_expert: "Focus Expert",
  problem_solver: "Problem Solver", time_keeper: "Time Keeper",
  analyst: "Analyst", brainstormer: "Brainstormer", philomath: "Philomath",
  strategist: "Strategist", thinker: "Thinker",
  chameleon: "Chameleon", coach: "Coach", empathizer: "Empathizer",
  optimist: "Optimist", peacekeeper: "Peacekeeper",
  catalyst: "Catalyst", commander: "Commander", self_believer: "Self-Believer",
  storyteller: "Storyteller", winner: "Winner",
};

function strengthName(id: string): string {
  return STRENGTH_NAMES[id] || id;
}

function scoreColor(score: number): string {
  if (score >= 75) return "#10b981";
  if (score >= 55) return "#f59e0b";
  return "#ef4444";
}

export function RelationshipReportPage() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<RelationshipReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchReport(id);
  }, [id]);

  async function fetchReport(reportId: string) {
    try {
      const res = await fetch(`/api/relationship?id=${encodeURIComponent(reportId)}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to load report");
      }
      const data = await res.json();
      setReport(data);
      trackRelationshipReportViewed(reportId, "viewer");
    } catch (err: any) {
      setError(err.message || "Failed to load relationship report");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="relationship-report">
        <div className="relationship-loading">
          <div className="relationship-loading-spinner" />
          <p>Loading relationship report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="relationship-report">
        <div className="relationship-error">
          <h2>Report Not Found</h2>
          <p>{error || "This relationship report could not be loaded."}</p>
          <Link to="/" className="btn-start">Take the Assessment</Link>
        </div>
      </div>
    );
  }

  const a = report.profileASummary;
  const b = report.profileBSummary;

  return (
    <div className="relationship-report">
      <div className="relationship-report-header">
        <div className="relationship-brand">1Test</div>
        <h1>Relationship Report</h1>
        <div className="relationship-hero">
          <div className="relationship-hero-profile">
            <span className="relationship-hero-type">{a.personalityType}</span>
            <span className="relationship-hero-label">{a.personalityLabel}</span>
            <span className="relationship-hero-detail">{a.discStyle} · {a.enneagramWing}</span>
          </div>
          <div className="relationship-hero-vs">
            <div className="relationship-hero-score" style={{ color: scoreColor(report.compatibilityScore) }}>
              {report.compatibilityScore}%
            </div>
            <div className="relationship-hero-score-label">Compatibility</div>
          </div>
          <div className="relationship-hero-profile">
            <span className="relationship-hero-type">{b.personalityType}</span>
            <span className="relationship-hero-label">{b.personalityLabel}</span>
            <span className="relationship-hero-detail">{b.discStyle} · {b.enneagramWing}</span>
          </div>
        </div>
      </div>

      <section className="relationship-section">
        <h2>💬 Communication Compatibility (DISC)</h2>
        <div className="relationship-score-bar">
          <div className="relationship-score-fill" style={{ width: `${report.discCompatibility.score}%`, background: scoreColor(report.discCompatibility.score) }} />
          <span className="relationship-score-value">{report.discCompatibility.score}%</span>
        </div>
        <p className="relationship-types">
          {report.discCompatibility.typeA} style + {report.discCompatibility.typeB} style
        </p>
        <div className="relationship-advice">
          <div className="relationship-advice-card">
            <h4>How {a.personalityType} communicates with {b.personalityType}</h4>
            <p>{report.discCompatibility.howACommunicatesWithB}</p>
          </div>
          <div className="relationship-advice-card">
            <h4>How {b.personalityType} communicates with {a.personalityType}</h4>
            <p>{report.discCompatibility.howBCommunicatesWithA}</p>
          </div>
          <div className="relationship-advice-card">
            <h4>Best meeting format</h4>
            <p>{report.discCompatibility.bestMeetingFormat}</p>
          </div>
        </div>
        {report.discCompatibility.tips.length > 0 && (
          <div className="relationship-tips">
            <h4>Tips</h4>
            <ul>
              {report.discCompatibility.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="relationship-section">
        <h2>💪 Strengths Overlap</h2>
        <div className="relationship-score-bar">
          <div className="relationship-score-fill" style={{ width: `${report.strengthsOverlap.score}%`, background: scoreColor(report.strengthsOverlap.score) }} />
          <span className="relationship-score-value">{report.strengthsOverlap.score}%</span>
        </div>
        {report.strengthsOverlap.shared.length > 0 && (
          <div className="relationship-strength-group">
            <h4>Shared Strengths</h4>
            <div className="relationship-strength-tags">
              {report.strengthsOverlap.shared.map((s) => (
                <span key={s} className="relationship-strength-tag shared">{strengthName(s)}</span>
              ))}
            </div>
          </div>
        )}
        {(report.strengthsOverlap.complementA.length > 0 || report.strengthsOverlap.complementB.length > 0) && (
          <div className="relationship-strength-group">
            <h4>Complementary Strengths</h4>
            {report.strengthsOverlap.complementA.length > 0 && (
              <p>{b.personalityType}'s strengths fill gaps for {a.personalityType}: {report.strengthsOverlap.complementA.map(strengthName).join(", ")}</p>
            )}
            {report.strengthsOverlap.complementB.length > 0 && (
              <p>{a.personalityType}'s strengths fill gaps for {b.personalityType}: {report.strengthsOverlap.complementB.map(strengthName).join(", ")}</p>
            )}
          </div>
        )}
        {report.strengthsOverlap.friction.length > 0 && (
          <div className="relationship-strength-group">
            <h4>Potential Friction</h4>
            <p>These differences may require attention: {report.strengthsOverlap.friction.map(strengthName).join(", ")}</p>
          </div>
        )}
      </section>

      <section className="relationship-section">
        <h2>🧠 Personality Interaction</h2>
        <div className="relationship-score-bar">
          <div className="relationship-score-fill" style={{ width: `${report.personalityInteraction.score}%`, background: scoreColor(report.personalityInteraction.score) }} />
          <span className="relationship-score-value">{report.personalityInteraction.score}%</span>
        </div>
        <p className="relationship-pair-label">{report.personalityInteraction.label}</p>
        <p>{report.personalityInteraction.dynamic}</p>
        <div className="relationship-tip-box">
          <strong>Tip:</strong> {report.personalityInteraction.tip}
        </div>
      </section>

      <section className="relationship-section">
        <h2>🔮 Enneagram Connection</h2>
        <p className="relationship-pair-label">{report.enneagramConnection.label}</p>
        <div className="relationship-enneagram-grid">
          <div className="relationship-enneagram-card">
            <h4>At Your Best</h4>
            <p>{report.enneagramConnection.atBest}</p>
          </div>
          <div className="relationship-enneagram-card">
            <h4>Under Stress</h4>
            <p>{report.enneagramConnection.underStress}</p>
          </div>
        </div>
      </section>

      <div className="relationship-cta">
        <p>Curious about your own profile?</p>
        <Link to="/" className="btn-start">Take the Free Assessment</Link>
      </div>
    </div>
  );
}