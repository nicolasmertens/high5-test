import { useState, useMemo, useEffect, useRef } from "react";
import { type StrengthScore } from "../hooks/useAssessment";
import { domainColors, domainLabels } from "../data/strengths";
import { derivePersonalityType, deriveEnneagram, deriveDISC } from "../data/derivations";
import { DetailedResults } from "./DetailedResults";
import { ActionBranches } from "./ActionBranches";
import { FreeValueBlocks } from "./FreeValueBlocks";
import { UpgradePrompt } from "./UpgradePrompt";
import { ShareCard } from "./ShareCard";
import { ShareButtons } from "./ShareButtons";
import { EmailCapture } from "./EmailCapture";
import { InviteSection } from "./InviteSection";
import { SEOHead } from "./SEOHead";
import { useShareImage } from "../hooks/useShareImage";
import { usePayment } from "../contexts/PaymentContext";
import { trackUpgradeViewed, trackResultsViewed, trackBlockViewed, trackUpsellClick, trackCTAClicked } from "../utils/analytics";
import { getStoredReferralCode } from "../utils/profile";

interface Props {
  results: StrengthScore[];
  onRestart: () => void;
}

function BlockTracker({ name }: { name: string }) {
  const tracked = useRef(false);
  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true;
      trackBlockViewed(name, false);
    }
  }, [name]);
  return null;
}

export function ResultsScreen({ results, onRestart }: Props) {
  const [showDetailed, setShowDetailed] = useState(false);
  const { isPaid } = usePayment();
  const { cardRef, downloadImage } = useShareImage();
  const upgradeViewedTracked = useRef(false);
  const resultsViewedTracked = useRef(false);
  const top5 = results.slice(0, 5);

  const handlePlaybookClick = () => {
    trackUpsellClick({ tier: "ai_playbook", sourceSection: "playbook_teaser" });
    trackCTAClicked({ ctaText: "Get AI Playbook — $19", ctaLocation: "playbook_teaser" });
    fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier: "ai_playbook" }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Checkout failed");
        return res.json();
      })
      .then((data) => {
        window.location.href = data.url;
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (!isPaid && !upgradeViewedTracked.current && top5.length > 0) {
      upgradeViewedTracked.current = true;
      trackUpgradeViewed("strengths", "results_page", "full_profile");
    }
  }, [isPaid, top5.length]);

  const personality = useMemo(() => derivePersonalityType(results), [results]);
  const enneagram = useMemo(() => deriveEnneagram(results), [results]);
  const disc = useMemo(() => deriveDISC(results), [results]);

  useEffect(() => {
    if (!resultsViewedTracked.current && top5.length > 0) {
      resultsViewedTracked.current = true;
      trackResultsViewed({
        framework: "strengths",
        top_strength: top5[0]?.strength?.name,
        top_strengths: top5.map((r) => r.strength.name),
        personality_type: personality.type,
        disc_type: disc.style,
        enneagram_type: enneagram.wingLabel,
      });
    }
  }, [top5, personality.type, disc.style, enneagram.wingLabel]);

  const shareUrl = useMemo(
    () => {
      const ref = getStoredReferralCode();
      const base = "https://1test.me/?utm_source=results_share&utm_medium=referral&utm_campaign=share-strengths";
      return ref ? `${base}&ref=${ref}` : base;
    },
    [],
  );

  const shareText = useMemo(
    () =>
      isPaid
        ? `I'm a ${personality.type} (${personality.label}) with a ${disc.style} DISC profile and Enneagram ${enneagram.wingLabel}. My top strength is ${top5[0]?.strength.name ?? ""}. Discover yours:`
        : `My top strength is ${top5[0]?.strength.name ?? ""} — discover yours with one free test:`,
    [isPaid, personality, disc, enneagram, top5],
  );

  const domainCounts: Record<string, number> = {};
  for (const r of top5) {
    const d = r.strength.domain;
    domainCounts[d] = (domainCounts[d] || 0) + 1;
  }

  const ogImageUrl = useMemo(() => {
    const params = new URLSearchParams({
      type: personality.type,
      strength: top5[0]?.strength.name ?? "",
      domain: top5[0]?.strength.domain ?? "doing",
      paid: isPaid ? "1" : "0",
    });
    if (disc.style) params.set("disc", disc.style);
    if (enneagram.wingLabel) params.set("enneagram", enneagram.wingLabel);
    return `https://1test.me/api/og-image?${params.toString()}`;
  }, [personality.type, disc.style, enneagram.wingLabel, top5, isPaid]);

  const seoTitle = useMemo(
    () =>
      isPaid
        ? `${personality.type} (${personality.label}) | 1Test Results`
        : `${top5[0]?.strength.name ?? "Strengths"} | 1Test Results`,
    [isPaid, personality, top5],
  );

  const seoDescription = useMemo(
    () =>
      isPaid
        ? `I'm a ${personality.type} with a ${disc.style} DISC profile and Enneagram ${enneagram.wingLabel}. Discover your personality type with one free test.`
        : `My top strength is ${top5[0]?.strength.name ?? ""}. Discover yours with one free test at 1Test.me.`,
    [isPaid, personality, disc, enneagram, top5],
  );

  if (showDetailed && isPaid) {
    return (
      <DetailedResults
        results={results}
        personality={personality}
        enneagram={enneagram}
        disc={disc}
        onBack={() => setShowDetailed(false)}
        ogImageUrl={ogImageUrl}
        seoTitle={seoTitle}
        seoDescription={seoDescription}
      />
    );
  }

  return (
    <div className="results">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonicalUrl="https://1test.me/results"
        ogImage={ogImageUrl}
      />
      <h1>Your Top 5 Strengths</h1>
      <p className="results-subtitle">
        Your unique combination out of 1,860,480 possible sequences
      </p>

      <div className="top5">
        {top5.map((r, i) => (
          <div
            key={r.strength.id}
            className="top5-card"
            style={{
              borderLeftColor: domainColors[r.strength.domain],
            }}
          >
            <div className="top5-rank">#{i + 1}</div>
            <div className="top5-content">
              <div className="top5-header">
                <h2>{r.strength.name}</h2>
                <span
                  className="domain-badge"
                  style={{
                    background: domainColors[r.strength.domain],
                  }}
                >
                  {domainLabels[r.strength.domain]}
                </span>
                <span className="score-badge">{r.score}%</span>
              </div>
              <p className="top5-desc">{r.strength.description}</p>
              <div className="top5-energy">
                <div className="energy-item energized">
                  <strong>Energized by:</strong> {r.strength.energized}
                </div>
                <div className="energy-item drained">
                  <strong>Drained by:</strong> {r.strength.drained}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isPaid ? (
        <>
          <div className="bridge-teaser">
            <h3>Your personality type and Enneagram</h3>
            <p className="bridge-subtitle">
              Derived from the same 120 answers — no extra test needed
            </p>

            <div className="bridge-cards">
              <div className="bridge-card">
                <span className="bridge-label">16 Personalities</span>
                <span className="bridge-value">{personality.type}</span>
                <span className="bridge-sublabel">{personality.label}</span>
              </div>
              <div className="bridge-card">
                <span className="bridge-label">DISC Profile</span>
                <span className="bridge-value">{disc.style}</span>
                <span className="bridge-sublabel">{disc.primary.name}</span>
              </div>
              <div className="bridge-card">
                <span className="bridge-label">Enneagram</span>
                <span className="bridge-value">{enneagram.wingLabel}</span>
                <span className="bridge-sublabel">{enneagram.primary.name}</span>
              </div>
            </div>

            <button
              className="btn-start btn-detailed"
              onClick={() => setShowDetailed(true)}
            >
              See Your Full Profile &rarr;
            </button>
          </div>

          <div className="domain-summary">
            <h3>Domain Distribution</h3>
            <div className="domain-bars">
              {Object.entries(domainLabels).map(([key, label]) => (
                <div key={key} className="domain-bar-row">
                  <span
                    className="domain-bar-label"
                    style={{ color: domainColors[key] }}
                  >
                    {label}
                  </span>
                  <div className="domain-bar-track">
                    <div
                      className="domain-bar-fill"
                      style={{
                        width: `${((domainCounts[key] || 0) / 5) * 100}%`,
                        background: domainColors[key],
                      }}
                    />
                  </div>
                  <span className="domain-bar-count">
                    {domainCounts[key] || 0}/5
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="full-ranking">
            <h3>Full Ranking (All 20 Strengths)</h3>
            <div className="ranking-list">
              {results.map((r) => (
                <div key={r.strength.id} className="ranking-row">
                  <span className="ranking-rank">#{r.rank}</span>
                  <span className="ranking-name">{r.strength.name}</span>
                  <span
                    className="ranking-domain"
                    style={{ color: domainColors[r.strength.domain] }}
                  >
                    {domainLabels[r.strength.domain]}
                  </span>
                  <div className="ranking-bar-track">
                    <div
                      className="ranking-bar-fill"
                      style={{
                        width: `${r.score}%`,
                        background:
                          r.rank <= 5
                            ? domainColors[r.strength.domain]
                            : "#64748b",
                      }}
                    />
                  </div>
                  <span className="ranking-score">{r.score}%</span>
                </div>
              ))}
            </div>
          </div>

          <ActionBranches
            results={results}
            personality={personality}
            enneagram={enneagram}
            disc={disc}
          />

          <div className="scoring-explanation">
            <h3>How Scoring Works</h3>
            <p>
              Each of the 20 strengths is measured by 6 statements. Your slider
              position (0-100) is recorded for each statement. Reversed items are
              flipped (100 - value). The average of your 6 responses becomes your
              score for that strength. All 20 scores are then ranked to produce
              your unique strength sequence. Your top 5 are your signature
              strengths. Your personality type and Enneagram are derived from the
              same data using weighted correlations.
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="bridge-teaser">
            <h3>We also found your personality type and Enneagram</h3>
            <p className="bridge-subtitle">
              Derived from the same 120 answers — no extra test needed
            </p>

            <p className="bridge-summary">
              As a <strong>{personality.type} ({personality.label})</strong>, {personality.description}
            </p>

            <div className="bridge-cards">
              <div className="bridge-card bridge-card-locked">
                <span className="bridge-label">16 Personalities</span>
                <span className="bridge-value bridge-value-locked">{personality.type}</span>
                <span className="bridge-sublabel">{personality.label}</span>
              </div>
              <div className="bridge-card bridge-card-locked">
                <span className="bridge-label">DISC Profile</span>
                <span className="bridge-value bridge-value-locked">{disc.style}</span>
                <span className="bridge-sublabel">{disc.primary.name}</span>
              </div>
              <div className="bridge-card bridge-card-locked">
                <span className="bridge-label">Enneagram</span>
                <span className="bridge-value bridge-value-locked">{enneagram.wingLabel}</span>
                <span className="bridge-sublabel">{enneagram.primary.name}</span>
              </div>
            </div>
          </div>

          <FreeValueBlocks
            results={results}
            personality={personality}
            enneagram={enneagram}
            disc={disc}
          />

          <div className="share-section">
            <div className="share-section-header">
              <h3>Share Your Results</h3>
              <p className="share-section-subtitle">
                Let others discover their strengths — share your top result
              </p>
            </div>

            <ShareCard
              ref={cardRef}
              results={results}
              personality={personality}
              enneagram={enneagram}
              disc={disc}
              isPaid={isPaid}
            />

            <ShareButtons
              shareText={shareText}
              shareUrl={shareUrl}
              framework="strengths"
            />

            <div className="share-actions-row">
              <button
                className="btn-start btn-share-download"
                onClick={() => downloadImage("1test-results.png")}
              >
                Download as Image
              </button>
            </div>
          </div>

          <EmailCapture
            frameworkName="Strengths"
            frameworkType={top5[0]?.strength?.name || "Achiever"}
            oneSentenceTraitSummary={
              top5[0]?.strength?.description ||
              "You have unique strengths that set you apart"
            }
          />

          <InviteSection
            results={results}
            personality={personality}
            enneagram={enneagram}
            disc={disc}
          />

          <UpgradePrompt variant="teaser" />

          <BlockTracker name="ai_playbook_teaser" />
          <section className="branch-card branch-card-highlight playbook-teaser">
            <div className="branch-icon">🤖</div>
            <h3>AI Playbook — Your Personalized Action Plan</h3>
            <p className="branch-desc">
              Get a personalized action plan generated from your unique profile.
              Career paths, communication guide, 30/60/90 day growth plan — built
              specifically for a {personality.type} with your strengths.
            </p>
            <div className="branch-preview">
              <ul className="playbook-features">
                <li>Career paths matched to your unique profile</li>
                <li>Communication guide based on your personality type</li>
                <li>30/60/90 day growth plan with actionable steps</li>
                <li>Includes everything in the Full Profile</li>
              </ul>
            </div>
            <button className="btn-start btn-upgrade" onClick={handlePlaybookClick}>
              Get AI Playbook — $19
            </button>
            <p className="upgrade-subtitle">
              One-time purchase. AI-generated in minutes.
            </p>
          </section>
        </>
      )}

      <button className="btn-start" onClick={onRestart}>
        Retake Assessment
      </button>
    </div>
  );
}