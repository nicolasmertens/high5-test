import { useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { SEOHead } from "./SEOHead";
import { ShareButtons } from "./ShareButtons";
import { UpgradePrompt } from "./UpgradePrompt";
import { trackCompareViewed } from "../utils/analytics";
import { usePayment } from "../contexts/PaymentContext";

interface StoredProfile {
  profileHash: string;
  personalityType: string;
  discStyle: string;
  discPrimary: string;
  discPrimaryScore: number;
  discSecondary: string;
  discSecondaryScore: number;
  enneagramPrimary: number;
  enneagramPrimaryScore: number;
  enneagramWing: string;
  topStrengths: string[];
  strengthScores: Record<string, number>;
}

type CompatibilityLabel = "Great Match" | "Solid Partnership" | "Growth Opportunity" | "Different Worlds";

function getPersonalityCompatibility(typeA: string, typeB: string): { label: string; description: string } {
  const key = [typeA, typeB].sort().join("+");
  const same = typeA === typeB;
  const pairKey = same ? "same" : key;

  const pairs: Record<string, { label: string; description: string }> = {
    same: { label: "Two of a Kind", description: "You understand each other instinctively. You share the same lens on the world — just make sure you challenge each other to grow beyond your comfort zones." },
    "ENTJ+INTP": { label: "The Strategist Duo", description: "You share a love of systems and logic. ENTJ drives execution, INTP provides depth. Together you can build anything — watch out for analysis paralysis vs. impatience." },
    "ENTJ+INTJ": { label: "The Power Couple", description: "Both strategic and decisive. You'll agree on direction quickly — the risk is missing emotional nuance. Make time to check in on how you feel, not just what you're building." },
    "ENTP+INFJ": { label: "Visionary + Counselor", description: "ENTP pushes boundaries, INFJ provides depth and meaning. You challenge each other in the best way — the dreamer meets the architect." },
    "ENFP+INTJ": { label: "Champion + Architect", description: "Imagination meets execution. ENFP brings ideas and energy, INTJ brings structure and follow-through. A classic complementary pair." },
    "ENFJ+INFP": { label: "Teacher + Healer", description: "Both driven by values and connection. ENFJ leads outward, INFP dives deep. You understand each other's heart — just don't over-protect each other from hard truths." },
    "ENFP+INTP": { label: "Spark + Depth", description: "ENFP lights up the room, INTP fills it with insight. You're both curious but in different directions. Magic when aligned, scattered when not." },
    "ESTJ+ISFP": { label: "Order + Art", description: "ESTJ builds the structure, ISFP fills it with beauty. Very different rhythms — you'll either complement perfectly or frustrate each other." },
    "ESTP+ISTJ": { label: "Action + Process", description: "ESTP acts fast, ISTJ plans carefully. You cover each other's blind spots — if you can agree on the pace." },
    "ESFJ+ISFJ": { label: "The Care Team", description: "Both committed to others' wellbeing. ESFJ organizes externally, ISFJ supports quietly. A warm and reliable partnership — watch out for avoiding conflict." },
    "ISTP+ESTJ": { label: "Mechanic + Executive", description: "ISTP fixes what's broken, ESTJ runs the system. Practical and efficient together. The risk is too much pragmatism, not enough vision." },
    "ISTJ+ESFP": { label: "Reliable + Vibrant", description: "ISTJ provides stability, ESFP brings the fun. Opposites that attract — you'll either love the contrast or feel unheard." },
    "ISFJ+ENFP": { label: "Guardian + Champion", description: "ISFJ grounds ENFP's energy, ENFP opens ISFJ's world. A warm, supportive pair — just make sure ISFJ's needs aren't always second." },
    "INFJ+ENTP": { label: "Counselor + Visionary", description: "INFJ sees the depth, ENTP explores the edges. You push each other to grow. A pairing that produces both insight and action." },
    "INTJ+ENFP": { label: "Architect + Champion", description: "Logic meets imagination. INTJ builds the framework, ENFP fills it with possibility. One of the most complementary pairings." },
  };

  if (pairs[pairKey]) return pairs[pairKey];

  const groupA = getTypeGroup(typeA);
  const groupB = getTypeGroup(typeB);

  if (groupA === groupB) {
    return { label: "Kindred Spirits", description: `You share a ${groupA} approach to the world. You'll understand each other quickly — the challenge is pushing beyond what comes naturally.` };
  }

  return { label: "Growth Partners", description: `Your ${groupA} and ${groupB} approaches create tension and opportunity. You see what the other misses — if you can appreciate the difference, you'll grow together.` };
}

function getTypeGroup(type: string): string {
  if (type.includes("NT")) return "Analytical";
  if (type.includes("NF")) return "Idealistic";
  if (type.includes("SJ")) return "Traditional";
  if (type.includes("SP")) return "Practical";
  return "Balanced";
}

function getDISCCompatibility(discA: string, discB: string): { fit: number; tip: string } {
  const codeA = discA[0];
  const codeB = discB[0];

  const pairs: Record<string, { fit: number; tip: string }> = {
    "DD": { fit: 60, tip: "Two drivers — you'll move fast but may clash on direction. Decide who leads what early." },
    "DI": { fit: 85, tip: "D directs, I inspires — a natural leadership duo. Just make sure the details don't fall through the cracks." },
    "DS": { fit: 75, tip: "D sets the pace, S provides the follow-through. You need each other — D must respect S's need for stability." },
    "DC": { fit: 70, tip: "D decides, C verifies — powerful if you trust each other's role. Don't let D skip the analysis C needs." },
    "II": { fit: 65, tip: "Two optimists — great energy, but who follows through? Assign a detail person or nothing gets finished." },
    "IS": { fit: 80, tip: "I brings energy, S brings patience — a warm and effective pair. I should push S to take more risks." },
    "IC": { fit: 55, tip: "I wants to go, C wants to check — the classic sales/ops tension. Respect each other's speed." },
    "SS": { fit: 60, tip: "Two stabilizers — deeply loyal but slow to change. Push each other to try new things." },
    "SC": { fit: 75, tip: "S implements, C refines — a careful and reliable pair. Don't let perfection delay action." },
    "CC": { fit: 55, tip: "Two perfectionists — high standards but slow progress. Pick your battles and accept 'good enough' sometimes." },
  };

  const key = [codeA, codeB].sort().join("");

  if (pairs[key]) return pairs[key];

  const fit = 70;
  const tips: Record<string, string> = {
    D: "Be direct, lead with results",
    I: "Be enthusiastic, share the vision",
    S: "Be patient, give time to process",
    C: "Be precise, bring data",
  };
  return { fit, tip: `Your styles complement each other. When communicating: ${tips[codeA]} for you, ${tips[codeB]} for them.` };
}

function getStrengthsSynergy(
  topA: string[],
  topB: string[],
  scoresA: Record<string, number>,
  scoresB: Record<string, number>,
): { shared: string[]; complementary: string[]; score: number } {
  const shared = topA.filter((s) => topB.includes(s));
  const complementary: string[] = [];

  for (const s of topA) {
    const scoreB = scoresB[s] ?? 50;
    if (scoreB < 40 && !topB.includes(s)) {
      complementary.push(s);
    }
  }
  for (const s of topB) {
    const scoreA = scoresA[s] ?? 50;
    if (scoreA < 40 && !topA.includes(s)) {
      complementary.push(s);
    }
  }

  const sharedBonus = shared.length * 15;
  const compBonus = Math.min(complementary.length, 4) * 10;
  const score = Math.min(100, 40 + sharedBonus + compBonus);

  return { shared, complementary, score };
}

function computeOverallScore(discFit: number, synergyScore: number): number {
  return Math.round(discFit * 0.4 + synergyScore * 0.6);
}

function getCompatibilityLabel(score: number): CompatibilityLabel {
  if (score >= 80) return "Great Match";
  if (score >= 65) return "Solid Partnership";
  if (score >= 45) return "Growth Opportunity";
  return "Different Worlds";
}

export function CompareScreen() {
  const { hashA, hashB } = useParams<{ hashA: string; hashB: string }>();
  const [profileA, setProfileA] = useState<StoredProfile | null>(null);
  const [profileB, setProfileB] = useState<StoredProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isPaid } = usePayment();
  const viewedTracked = useRef(false);

  useEffect(() => {
    if (!hashA || !hashB) {
      setError("Missing profile hashes in URL");
      setLoading(false);
      return;
    }

    Promise.all([
      fetch(`/api/get-profile?hash=${hashA}`).then((r) => {
        if (!r.ok) throw new Error("Profile A not found");
        return r.json();
      }),
      fetch(`/api/get-profile?hash=${hashB}`).then((r) => {
        if (!r.ok) throw new Error("Profile B not found");
        return r.json();
      }),
    ])
      .then(([a, b]) => {
        setProfileA(a);
        setProfileB(b);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [hashA, hashB]);

  const compat = useMemo(() => {
    if (!profileA || !profileB) return null;

    const personality = getPersonalityCompatibility(profileA.personalityType, profileB.personalityType);
    const disc = getDISCCompatibility(profileA.discStyle, profileB.discStyle);
    const strengths = getStrengthsSynergy(
      profileA.topStrengths,
      profileB.topStrengths,
      profileA.strengthScores,
      profileB.strengthScores,
    );
    const overall = computeOverallScore(disc.fit, strengths.score);
    const label = getCompatibilityLabel(overall);

    return { personality, disc, strengths, overall, label };
  }, [profileA, profileB]);

  useEffect(() => {
    if (compat && profileA && profileB && !viewedTracked.current) {
      viewedTracked.current = true;
      trackCompareViewed({
        personalityA: profileA.personalityType,
        personalityB: profileB.personalityType,
        discA: profileA.discStyle,
        discB: profileB.discStyle,
        isPaid,
      });
    }
  }, [compat, profileA, profileB, isPaid]);

  if (loading) {
    return (
      <div className="compare-page">
        <SEOHead title="Compare Profiles — 1Test" description="See how two personality profiles compare" canonicalUrl="https://1test.me/compare" />
        <div className="compare-loading">
          <div className="compare-spinner" />
          <p>Loading profiles...</p>
        </div>
      </div>
    );
  }

  if (error || !profileA || !profileB || !compat) {
    return (
      <div className="compare-page">
        <SEOHead title="Compare Profiles — 1Test" description="See how two personality profiles compare" canonicalUrl="https://1test.me/compare" />
        <div className="compare-error">
          <h2>Could Not Load Comparison</h2>
          <p>{error || "One or both profiles could not be found."}</p>
          <a href="/" className="btn-start">Take the Test</a>
        </div>
      </div>
    );
  }

  const compareUrl = `https://1test.me/compare/${hashA}/${hashB}`;
  const shareText = `I compared our personality profiles on 1Test — ${compat.label} (${compat.overall}%). See how you compare:`;

  return (
    <div className="compare-page">
      <SEOHead
        title={`${profileA.personalityType} + ${profileB.personalityType} — Profile Comparison | 1Test`}
        description={`How do ${profileA.personalityType} and ${profileB.personalityType} work together? See compatibility, communication tips, and strengths synergy.`}
        canonicalUrl={`https://1test.me/compare/${hashA}/${hashB}`}
      />

      <div className="compare-header">
        <h1>Profile Comparison</h1>
        <div className="compare-avatars">
          <div className="compare-avatar">
            <span className="compare-type">{profileA.personalityType}</span>
            <span className="compare-disc">{profileA.discStyle}</span>
          </div>
          <div className="compare-vs">⟷</div>
          <div className="compare-avatar">
            <span className="compare-type">{profileB.personalityType}</span>
            <span className="compare-disc">{profileB.discStyle}</span>
          </div>
        </div>
      </div>

      <div className="compare-score-section">
        <div className={`compare-score-ring score-${compat.label.toLowerCase().replace(/\s/g, "-")}`}>
          <span className="compare-score-number">{compat.overall}%</span>
        </div>
        <span className="compare-label">{compat.label}</span>
      </div>

      <section className="compare-block">
        <h3>Personality Compatibility</h3>
        <div className="compare-block-content">
          <span className="compare-block-icon">🧠</span>
          <p className="compare-block-title">{compat.personality.label}</p>
          <p className="compare-block-desc">{compat.personality.description}</p>
        </div>
      </section>

      <section className="compare-block">
        <h3>Communication Style</h3>
        <div className="compare-block-content">
          <span className="compare-block-icon">💬</span>
          <div className="disc-compare-row">
            <span className="disc-badge disc-badge-a">{profileA.discStyle}</span>
            <span className="disc-compare-arrow">↔</span>
            <span className="disc-badge disc-badge-b">{profileB.discStyle}</span>
          </div>
          <p className="compare-fit">Communication fit: <strong>{compat.disc.fit}%</strong></p>
          <p className="compare-block-desc">{compat.disc.tip}</p>
        </div>
      </section>

      {isPaid && (
        <>
          <section className="compare-block">
            <h3>Strengths Synergy</h3>
            <div className="compare-block-content">
              <span className="compare-block-icon">💪</span>
              <p className="compare-fit">Synergy score: <strong>{compat.strengths.score}%</strong></p>
              {compat.strengths.shared.length > 0 && (
                <div className="synergy-group">
                  <p className="synergy-label">Shared strengths</p>
                  <div className="synergy-tags">
                    {compat.strengths.shared.map((s) => (
                      <span key={s} className="synergy-tag tag-shared">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {compat.strengths.complementary.length > 0 && (
                <div className="synergy-group">
                  <p className="synergy-label">Complementary (one strong, one growth area)</p>
                  <div className="synergy-tags">
                    {compat.strengths.complementary.slice(0, 6).map((s) => (
                      <span key={s} className="synergy-tag tag-complement">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="compare-block">
            <h3>Working Together</h3>
            <div className="compare-block-content">
              <span className="compare-block-icon">🤝</span>
              <p className="compare-block-desc">
                As an <strong>{profileA.personalityType}</strong> working with an <strong>{profileB.personalityType}</strong>,
                your combined strengths create a well-rounded team. {compat.personality.label} means you
                {compat.overall >= 65 ? " naturally align on direction" : " bring different perspectives that expand each other's thinking"}.
                Lean into {compat.strengths.complementary.length > 0 ? "your complementary strengths" : "your shared strengths"} for maximum impact.
              </p>
            </div>
          </section>
        </>
      )}

      {!isPaid && (
        <div className="compare-upsell">
          <p><strong>Unlock full comparison:</strong> strengths synergy, working-together insights, and detailed Enneagram dynamics.</p>
          <UpgradePrompt variant="teaser" />
        </div>
      )}

      <section className="compare-share">
        <h3>Share This Comparison</h3>
        <ShareButtons
          shareText={shareText}
          shareUrl={compareUrl}
          framework="compare"
        />
      </section>

      <a href="/" className="btn-start" style={{ display: "block", textAlign: "center", margin: "2rem auto" }}>
        Take Your Own Test
      </a>
    </div>
  );
}
