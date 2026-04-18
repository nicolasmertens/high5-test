import { useState, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { type StrengthScore } from "../hooks/useAssessment";
import { domainColors, domainLabels } from "../data/strengths";
import { derivePersonalityType, deriveEnneagram, deriveDISC } from "../data/derivations";
import { DetailedResults } from "./DetailedResults";
import { ContentBlocks } from "./results/ContentBlocks";
import { UpgradePrompt } from "./UpgradePrompt";
import { ShareCard } from "./ShareCard";
import { ShareButtons } from "./ShareButtons";
import { EmailCapture } from "./EmailCapture";
import { InviteSection } from "./InviteSection";
import { SEOHead } from "./SEOHead";
import { CareerPathBlock } from "./career/CareerPathBlock";
import { useShareImage } from "../hooks/useShareImage";
import { getStoredReferralCode, getStoredProfileHash, getInviteRef } from "../utils/profile";
import { usePayment } from "../contexts/PaymentContext";
import { trackUpgradeViewed, trackResultsViewed, trackBlockViewed, trackUpsellClick, trackCTAClicked, trackShareCardViewed, trackSegmentDetermined } from "../utils/analytics";
import { getShareCopy } from "../data/share-copy";
import { FrameworkDot } from "./FrameworkDotStrip";
import { loadIntakeAnswers } from "../careerData/segmentConfig";
import { getBlockSegment, AI_PLAYBOOK_TITLE } from "../careerData/blockSegmentConfig";

import { type Variant } from "../utils/abTesting";

interface Props {
  results: StrengthScore[];
  onRestart: () => void;
  emailCaptureVariant?: Variant;
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

export function ResultsScreen({ results, onRestart, emailCaptureVariant = "A" }: Props) {
  const { t } = useTranslation();
  const [showDetailed, setShowDetailed] = useState(false);
  const [inviterInfo, setInviterInfo] = useState<{ name: string; profileHash: string; personalityType: string } | null>(null);
  const { isPaid, tier } = usePayment();
  const upgradeViewedTracked = useRef(false);
  const resultsViewedTracked = useRef(false);
  const shareCardViewedTracked = useRef(false);
  const top5 = results.slice(0, 5);

  const intakeAnswers = useMemo(() => loadIntakeAnswers(), []);
  const blockSegment = useMemo(() => getBlockSegment(intakeAnswers), [intakeAnswers]);
  const aiPlaybookTitle = AI_PLAYBOOK_TITLE[blockSegment] ?? "AI Playbook — Your Personalized Action Plan";

  useEffect(() => {
    const ref = getInviteRef();
    if (!ref) return;
    fetch(`/api/invite?ref=${ref}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.inviterProfileHash && data?.inviterName) {
          setInviterInfo({
            name: data.inviterName,
            profileHash: data.inviterProfileHash,
            personalityType: data.inviterPersonalityType ?? "",
          });
        }
      })
      .catch(() => {});
  }, []);

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
  const { cardRef, downloadImage } = useShareImage(personality.type, null);

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
      if (intakeAnswers?.careerStage) {
        const inviteRef = getInviteRef();
        const utmSource = new URLSearchParams(window.location.search).get("utm_source");
        const source = inviteRef ? "referral" : utmSource ? "organic" : "direct";
        trackSegmentDetermined({
          segment: intakeAnswers.careerStage,
          personality_type: personality.type,
          source,
        });
      }
    }
  }, [top5, personality.type, disc.style, enneagram.wingLabel, intakeAnswers]);

  const shareUrl = useMemo(
    () => {
      const ref = getStoredReferralCode();
      const base = "https://1test.me/?utm_source=results_share&utm_medium=referral&utm_campaign=share-strengths";
      return ref ? `${base}&ref=${ref}` : base;
    },
    [],
  );

  const shareText = useMemo(
    () => getShareCopy(null).shareText,
    [],
  );

  useEffect(() => {
    if (!shareCardViewedTracked.current && top5.length > 0) {
      shareCardViewedTracked.current = true;
      trackShareCardViewed(personality.type, null);
    }
  }, [top5.length, personality.type]);

  const domainCounts: Record<string, number> = {};
  for (const r of top5) {
    const d = r.strength.domain;
    domainCounts[d] = (domainCounts[d] || 0) + 1;
  }

  const ogImageUrl = useMemo(() => {
    const params = new URLSearchParams({
      type: personality.type,
      strengths: top5.map((r) => r.strength.name).join(","),
      domains: top5.map((r) => r.strength.domain).join(","),
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
      <h1 style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FrameworkDot framework="strengths" size={8} />{t("results.topStrengths")}</h1>
      <p className="results-subtitle">
        {t("results.uniqueCombination")}
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
                  <strong>{t("results.energizedBy")}</strong> {r.strength.energized}
                </div>
                <div className="energy-item drained">
                  <strong>{t("results.drainedBy")}</strong> {r.strength.drained}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isPaid ? (
        <>
          <div className="bridge-teaser">
            <h3>{t("results.personalityAndEnneagram")}</h3>
            <p className="bridge-subtitle">
              {t("results.derivedFromAnswers")}
            </p>

            <div className="bridge-cards">
              <a
                className="bridge-card bridge-card-link"
                href={`/blog/${personality.type.toLowerCase()}-personality-type`}
                target="_blank"
                rel="noopener noreferrer"
                title={`Learn more about ${personality.type}`}
              >
                <span className="bridge-label">{t("results.labelPersonalities")}</span>
                <span className="bridge-value">{personality.type}</span>
                <span className="bridge-sublabel">{personality.label} ↗</span>
              </a>
              <a
                className="bridge-card bridge-card-link"
                href={`/blog/disc-type-${disc.primary.code.toLowerCase()}-${disc.primary.name.toLowerCase()}`}
                target="_blank"
                rel="noopener noreferrer"
                title={`Learn more about DISC ${disc.primary.name}`}
              >
                <span className="bridge-label">{t("results.labelDISC")}</span>
                <span className="bridge-value">{disc.style}</span>
                <span className="bridge-sublabel">{disc.primary.name} ↗</span>
              </a>
              <a
                className="bridge-card bridge-card-link"
                href={`/blog/enneagram-type-${enneagram.primary.type}-${enneagram.primary.name.replace(/^The\s+/i, "").toLowerCase().replace(/\s+/g, "-")}`}
                target="_blank"
                rel="noopener noreferrer"
                title={`Learn more about Enneagram ${enneagram.wingLabel}`}
              >
                <span className="bridge-label">{t("results.labelEnneagram")}</span>
                <span className="bridge-value">{enneagram.wingLabel}</span>
                <span className="bridge-sublabel">{enneagram.primary.name} ↗</span>
              </a>
            </div>

            <button
              className="btn-start btn-detailed"
              onClick={() => setShowDetailed(true)}
            >
              {t("results.seeFullProfile")}
            </button>
          </div>

          {inviterInfo && (() => {
            const myHash = getStoredProfileHash();
            if (!myHash) return null;
            return (
              <div className="compare-invite-cta">
                <div className="compare-invite-icon">🤝</div>
                <h3>{t("results.compareWith", { name: inviterInfo.name })}</h3>
                <p>
                  {inviterInfo.personalityType
                    ? t("results.compatibilityKnown", { myType: personality.type, theirType: inviterInfo.personalityType })
                    : t("results.compatibilityUnknown")}
                </p>
                <a
                  href={`/compare/${inviterInfo.profileHash}/${myHash}`}
                  className="btn-start btn-compare-cta"
                >
                  {t("results.compareProfiles")}
                </a>
              </div>
            );
          })()}

          <div className="domain-summary">
            <h3>{t("results.domainDistribution")}</h3>
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
            <h3>{t("results.fullRanking")}</h3>
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

          <ContentBlocks
            results={results}
            personality={personality}
            enneagram={enneagram}
            disc={disc}
            intakeAnswers={intakeAnswers}
            isPaid={true}
          />

          <CareerPathBlock
            results={results}
            personality={personality}
          />

          {tier === "ai_playbook" && (() => {
            const hash = getStoredProfileHash();
            if (!hash) return null;
            return (
              <div className="playbook-link-card">
                <span className="playbook-link-icon">🤖</span>
                <h3>{t("results.playbookReady")}</h3>
                <p>{t("results.playbookDesc")}</p>
                <a href={`/playbook?profile=${hash}`} className="btn-start btn-upgrade">
                  {t("results.viewPlaybook")}
                </a>
              </div>
            );
          })()}

          <div className="share-section">
            <div className="share-section-header">
              <h3>{t("results.shareResults")}</h3>
              <p className="share-section-subtitle">
                {t("results.shareSubtitle")}
              </p>
            </div>

            <ShareCard
              ref={cardRef}
              results={results}
              personality={personality}
              enneagram={enneagram}
              disc={disc}
              isPaid={isPaid}
              segment={null}
            />

            <ShareButtons
              shareText={shareText}
              shareUrl={shareUrl}
              framework="strengths"
              segment={null}
              personalityType={personality.type}
            />

            <div className="share-actions-row">
              <button
                className="btn-start btn-share-download"
                onClick={() => downloadImage()}
              >
                {t("results.downloadImage")}
              </button>
            </div>
          </div>

          <div className="scoring-explanation">
            <h3>{t("results.howScoringWorks")}</h3>
            <p>{t("results.scoringExplanation")}</p>
          </div>
        </>
      ) : (
        <>
          {emailCaptureVariant === "C" && (
            <EmailCapture
              frameworkName="Strengths"
              frameworkType={top5[0]?.strength?.name || "Achiever"}
              oneSentenceTraitSummary={
                top5[0]?.strength?.description ||
                t("results.uniqueStrengths")
              }
              captureLocation="results_page_top"
            />
          )}

          <div className="bridge-teaser">
            <h3>{t("results.weAlsoFound")}</h3>
            <p className="bridge-subtitle">
              {t("results.derivedFromAnswers")}
            </p>

            <p className="bridge-summary">
              As a <strong>{personality.type} ({personality.label})</strong>, {personality.description}
            </p>

            <div className="bridge-cards">
              <div className="bridge-card bridge-card-locked">
                <span className="bridge-label">{t("results.labelPersonalities")}</span>
                <span className="bridge-value bridge-value-locked">{personality.type}</span>
                <span className="bridge-sublabel">{personality.label}</span>
              </div>
              <div className="bridge-card bridge-card-locked">
                <span className="bridge-label">{t("results.labelDISC")}</span>
                <span className="bridge-value bridge-value-locked">{disc.style}</span>
                <span className="bridge-sublabel">{disc.primary.name}</span>
              </div>
              <div className="bridge-card bridge-card-locked">
                <span className="bridge-label">{t("results.labelEnneagram")}</span>
                <span className="bridge-value bridge-value-locked">{enneagram.wingLabel}</span>
                <span className="bridge-sublabel">{enneagram.primary.name}</span>
              </div>
            </div>
          </div>

          {inviterInfo && (() => {
            const myHash = getStoredProfileHash();
            if (!myHash) return null;
            return (
              <div className="compare-invite-cta">
                <div className="compare-invite-icon">🤝</div>
                <h3>{t("results.compareWith", { name: inviterInfo.name })}</h3>
                <p>
                  {inviterInfo.personalityType
                    ? t("results.compatibilityKnown", { myType: personality.type, theirType: inviterInfo.personalityType })
                    : t("results.compatibilityUnknown")}
                </p>
                <a
                  href={`/compare/${inviterInfo.profileHash}/${myHash}`}
                  className="btn-start btn-compare-cta"
                >
                  {t("results.compareProfiles")}
                </a>
              </div>
            );
          })()}

          <ContentBlocks
            results={results}
            personality={personality}
            enneagram={enneagram}
            disc={disc}
            intakeAnswers={intakeAnswers}
            isPaid={false}
          />

          <CareerPathBlock
            results={results}
            personality={personality}
          />

          <div className="share-section">
            <div className="share-section-header">
              <h3>{t("results.shareResults")}</h3>
              <p className="share-section-subtitle">
                {t("results.shareSubtitleFree")}
              </p>
            </div>

            <ShareCard
              ref={cardRef}
              results={results}
              personality={personality}
              enneagram={enneagram}
              disc={disc}
              isPaid={isPaid}
              segment={null}
            />

            <ShareButtons
              shareText={shareText}
              shareUrl={shareUrl}
              framework="strengths"
              segment={null}
              personalityType={personality.type}
            />

            <div className="share-actions-row">
              <button
                className="btn-start btn-share-download"
                onClick={() => downloadImage()}
              >
                {t("results.downloadImage")}
              </button>
            </div>
          </div>

          {emailCaptureVariant === "A" && (
            <EmailCapture
              frameworkName="Strengths"
              frameworkType={top5[0]?.strength?.name || "Achiever"}
              oneSentenceTraitSummary={
                top5[0]?.strength?.description ||
                t("results.uniqueStrengths")
              }
              captureLocation="results_page_post"
            />
          )}

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
            <h3>{aiPlaybookTitle}</h3>
            <p className="branch-desc">
              {t("results.playbookTeaserDesc", { type: personality.type })}
            </p>
            <div className="branch-preview">
              <ul className="playbook-features">
                <li>{t("results.playbookFeature1")}</li>
                <li>{t("results.playbookFeature2")}</li>
                <li>{t("results.playbookFeature3")}</li>
                <li>{t("results.playbookFeature4")}</li>
              </ul>
            </div>
            <button className="btn-start btn-upgrade" onClick={handlePlaybookClick}>
              {t("results.getAiPlaybook")}
            </button>
            <p className="upgrade-subtitle">
              {t("results.oneTimePurchaseAI")}
            </p>
          </section>
        </>
      )}

      <button className="btn-start" onClick={onRestart}>
        {t("results.retakeAssessment")}
      </button>
    </div>
  );
}