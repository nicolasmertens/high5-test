import posthog from "posthog-js";
import i18n from "../i18n";

function getLanguage(): string {
  try {
    return i18n.language || "en";
  } catch {
    return "en";
  }
}

export type Framework = "disc" | "personality" | "enneagram" | "strengths";

export type UpgradeType = "full_profile" | "ai_playbook" | "team_monthly";

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const UTM_SESSION_KEY = "1test_utm";
const SESSION_STARTED_KEY = "1test_session_start";
const TEST_STARTED_KEY = "1test_test_start";

const POSTHOG_KEY = "phc_naAqjQ2GHEYrTb82N4FQCqriYmwAQFewWEtL4kzUhcHp";
const POSTHOG_HOST = "https://us.i.posthog.com";

let initialized = false;
let utmParams: UTMParams = {};
let testStartTime: number | null = null;

export function initAnalytics(): void {
  if (initialized || typeof window === "undefined") return;
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false,
    autocapture: true,
    persistence: "localStorage+cookie",
    person_profiles: "identified_only",
  });
  initialized = true;

  utmParams = captureUTMParams();

  const sessionStart = sessionStorage.getItem(SESSION_STARTED_KEY);
  if (!sessionStart) {
    sessionStorage.setItem(SESSION_STARTED_KEY, Date.now().toString());
    if (Object.keys(utmParams).length > 0) {
      posthog.capture("session_start", utmParams);
    }
  }

  trackPageView(window.location.pathname, document.title);
}

export function captureUTMParams(): UTMParams {
  if (typeof window === "undefined") return {};

  const stored = sessionStorage.getItem(UTM_SESSION_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      sessionStorage.removeItem(UTM_SESSION_KEY);
    }
  }

  const params = new URLSearchParams(window.location.search);
  const utm: UTMParams = {};
  let hasUTM = false;

  for (const key of UTM_KEYS) {
    const val = params.get(key);
    if (val) {
      utm[key] = val;
      hasUTM = true;
    }
  }

  if (hasUTM) {
    sessionStorage.setItem(UTM_SESSION_KEY, JSON.stringify(utm));
  }

  utmParams = hasUTM ? utm : utmParams;
  return utmParams;
}

export function getUTMParams(): UTMParams {
  return { ...utmParams };
}

function getDeviceType(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (/Mobi|Android.*Mobile|iPhone|iPod/i.test(ua)) return "mobile";
  if (/Tablet|iPad|Android(?!.*Mobile)/i.test(ua)) return "tablet";
  return "desktop";
}

export function trackPageView(pagePath: string, pageTitle: string): void {
  if (!initialized) return;
  posthog.capture("$pageview", {
    $current_url: pagePath,
    page_title: pageTitle,
    device_type: getDeviceType(),
    language: getLanguage(),
    ...utmParams,
  });
}

export function trackTestStarted(framework: Framework | "all", landingPage?: string): void {
  testStartTime = Date.now();
  sessionStorage.setItem(TEST_STARTED_KEY, testStartTime.toString());

  posthog.capture("test_started", {
    framework,
    landing_page: landingPage || window.location.pathname,
    language: getLanguage(),
    ...utmParams,
  });
}

export function trackQuestionAnswered(
  questionNumber: number,
  totalQuestions: number,
  framework: string = "strengths"
): void {
  const completionPct = Math.round((questionNumber / totalQuestions) * 100);
  const milestones = [25, 50, 75, 100];

  if (!milestones.some((m) => completionPct >= m && completionPct - (100 / totalQuestions) < m)) {
    return;
  }

  posthog.capture("question_answered", {
    framework,
    question_number: questionNumber,
    completion_pct: completionPct,
  });
}

export function trackTestCompleted(
  framework: string = "strengths",
  questionCount: number = 120
): void {
  const stored = sessionStorage.getItem(TEST_STARTED_KEY);
  const timeSpent = stored
    ? Math.round((Date.now() - parseInt(stored, 10)) / 1000)
    : undefined;

  posthog.capture("test_completed", {
    framework,
    question_count: questionCount,
    language: getLanguage(),
    ...(timeSpent !== undefined ? { time_spent_seconds: timeSpent } : {}),
    ...utmParams,
  });
}

export function trackResultsViewed(data: {
  framework?: string;
  personality_type?: string;
  disc_type?: string;
  enneagram_type?: string;
  top_strength?: string;
  top_strengths?: string[];
}): void {
  posthog.capture("results_viewed", {
    framework: data.framework || "strengths",
    ...(data.personality_type ? { personality_type: data.personality_type } : {}),
    ...(data.disc_type ? { disc_type: data.disc_type } : {}),
    ...(data.enneagram_type ? { enneagram_type: data.enneagram_type } : {}),
    ...(data.top_strength ? { top_strength: data.top_strength } : {}),
    ...(data.top_strengths ? { top_strengths: data.top_strengths } : {}),
  });
}

export function trackUpgradeViewed(
  framework: string,
  sourceSection: string,
  upgradeType: UpgradeType = "full_profile"
): void {
  posthog.capture("upgrade_viewed", {
    framework,
    source_section: sourceSection,
    upgrade_type: upgradeType,
    ...utmParams,
  });
}

export function trackCheckoutStarted(
  framework: string = "strengths",
  upgradeType: UpgradeType = "full_profile",
  upsellVariant?: string,
): void {
  posthog.capture("begin_checkout", {
    framework,
    upgrade_type: upgradeType,
    price_variant: "12_one_time",
    ...(upsellVariant ? { upsell_variant: upsellVariant } : {}),
    ...utmParams,
  });
}

export function trackPurchase(data: {
  framework?: string;
  upgradeType?: UpgradeType;
  revenueAmount?: number;
  currency?: string;
  transactionId?: string;
  paymentMethod?: string;
}): void {
  posthog.capture("purchase", {
    framework: data.framework || "strengths",
    upgrade_type: data.upgradeType || "full_profile",
    revenue_amount: data.revenueAmount || 12,
    currency: data.currency || "USD",
    payment_method: data.paymentMethod || "card",
    ...(data.transactionId ? { transaction_id: data.transactionId } : {}),
    ...utmParams,
  });
}

export function trackDeliverableGenerated(
  framework: string,
  deliverableType: "pdf" | "playbook",
  generationTimeSeconds?: number
): void {
  posthog.capture("deliverable_generated", {
    framework,
    deliverable_type: deliverableType,
    ...(generationTimeSeconds !== undefined
      ? { generation_time_seconds: generationTimeSeconds }
      : {}),
  });
}

export function trackEmailCaptured(emailSource: string, framework?: string): void {
  posthog.capture("email_captured", {
    email_source: emailSource,
    ...(framework ? { framework } : {}),
  });
}

export function trackShare(framework: string, shareChannel: string): void {
  posthog.capture("share", {
    framework,
    share_channel: shareChannel,
  });
}

export function trackShareCardViewed(personalityType: string, segment: string | null): void {
  posthog.capture("share_card_viewed", {
    personality_type: personalityType,
    segment: segment ?? "default",
    page_path: window.location.pathname,
  });
}

export function trackShareCardShared(channel: string, personalityType: string, segment: string | null): void {
  posthog.capture("share_card_shared", {
    share_channel: channel,
    personality_type: personalityType,
    segment: segment ?? "default",
    page_path: window.location.pathname,
  });
}

export function trackShareCardDownloaded(personalityType: string, segment: string | null): void {
  posthog.capture("share_card_downloaded", {
    personality_type: personalityType,
    segment: segment ?? "default",
    page_path: window.location.pathname,
  });
}

export function trackScrollDepth(pagePath: string, depthPct: number): void {
  posthog.capture("scroll_depth", {
    page_path: pagePath,
    depth_pct: depthPct,
  });
}

const SCROLL_MILESTONES = [25, 50, 75, 100];
const SCROLL_TRACKED_KEY = "1test_scroll_milestones";

export function initScrollTracking(): () => void {
  if (typeof window === "undefined") return () => {};

  const tracked = new Set<number>();
  const stored = sessionStorage.getItem(SCROLL_TRACKED_KEY);
  if (stored) {
    try {
      JSON.parse(stored).forEach((m: number) => tracked.add(m));
    } catch {
      sessionStorage.removeItem(SCROLL_TRACKED_KEY);
    }
  }

  let rafId: number | null = null;

  const handler = () => {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((scrollTop / docHeight) * 100);

      for (const milestone of SCROLL_MILESTONES) {
        if (pct >= milestone && !tracked.has(milestone)) {
          tracked.add(milestone);
          trackScrollDepth(window.location.pathname, milestone);
          try {
            sessionStorage.setItem(SCROLL_TRACKED_KEY, JSON.stringify([...tracked]));
          } catch {
            // storage unavailable
          }
        }
      }
    });
  };

  window.addEventListener("scroll", handler, { passive: true });

  return () => {
    window.removeEventListener("scroll", handler);
    if (rafId !== null) cancelAnimationFrame(rafId);
  };
}

export function resetScrollTracking(): void {
  sessionStorage.removeItem(SCROLL_TRACKED_KEY);
}

export function trackInviteSent(channel: string, inviteCount: number, isPaid: boolean): void {
  posthog.capture("invite_sent", {
    channel,
    invite_count: inviteCount,
    is_paid: isPaid,
  });
}

export function trackInviteLinkCopied(isPaid: boolean): void {
  posthog.capture("invite_sent", {
    channel: "link",
    invite_count: 0,
    is_paid: isPaid,
  });
}

export function trackInviteViewed(referralCode: string, inviterProfileHash: string): void {
  posthog.capture("invite_viewed", {
    referral_code: referralCode,
    inviter_profile_hash: inviterProfileHash,
  });
}

export function trackInviteCompleted(referralCode: string, inviteeProfileHash: string): void {
  posthog.capture("invite_completed", {
    referral_code: referralCode,
    invitee_profile_hash: inviteeProfileHash,
  });
}

export function trackRelationshipReportViewed(reportId: string, viewerRole: string): void {
  posthog.capture("relationship_report_viewed", {
    report_id: reportId,
    viewer_role: viewerRole,
  });
}

export function trackRelationshipReportShared(reportId: string, shareChannel: string): void {
  posthog.capture("relationship_report_shared", {
    report_id: reportId,
    share_channel: shareChannel,
  });
}

export function trackInviteUpsellShown(invitesUsed: number, isPaid: boolean): void {
  posthog.capture("invite_upsell_shown", {
    invites_used: invitesUsed,
    is_paid: isPaid,
  });
}

export function trackInviteUpsellClicked(invitesUsed: number, isPaid: boolean): void {
  posthog.capture("invite_upsell_clicked", {
    invites_used: invitesUsed,
    is_paid: isPaid,
  });
}

export function trackProfileStored(profileHash: string): void {
  posthog.capture("profile_stored", {
    profile_hash: profileHash,
  });
}

export function trackCTAClicked(data: {
  ctaText: string;
  ctaLocation: "intro_hero" | "intro_resume" | "landing_hero" | "landing_bottom" | "bridge_teaser" | "upgrade_teaser" | "upgrade_full" | "playbook_teaser" | "career_teaser" | "career_upsell_modal" | "career_intake";
  pagePath?: string;
}): void {
  posthog.capture("cta_clicked", {
    cta_text: data.ctaText,
    cta_location: data.ctaLocation,
    page_path: data.pagePath || window.location.pathname,
    ...utmParams,
  });
}

export function trackUpsellClick(data: {
  tier: string;
  sourceSection: string;
  upsellVariant?: string;
}): void {
  posthog.capture("upsell_click", {
    tier: data.tier,
    source_section: data.sourceSection,
    ...(data.upsellVariant ? { upsell_variant: data.upsellVariant } : {}),
    ...utmParams,
  });
}

export function trackUpsellView(data: {
  sourceSection: string;
  tier: string;
  upsellVariant?: string;
}): void {
  posthog.capture("upsell_view", {
    source_section: data.sourceSection,
    tier: data.tier,
    ...(data.upsellVariant ? { upsell_variant: data.upsellVariant } : {}),
    ...utmParams,
  });
}

export function trackNurtureEnroll(data: {
  framework: string;
  frameworkType: string;
}): void {
  posthog.capture("nurture_enrolled", {
    framework: data.framework,
    framework_type: data.frameworkType,
    ...utmParams,
  });
}

export function trackNurtureEmailClick(data: {
  emailNumber: number;
  framework: string;
  linkType: "cta_upgrade" | "link_faq";
}): void {
  posthog.capture("nurture_email_clicked", {
    email_number: data.emailNumber,
    framework: data.framework,
    link_type: data.linkType,
    ...utmParams,
  });
}

export function trackBlockViewed(blockName: string, isPaid: boolean): void {
  posthog.capture("block_viewed", {
    block_name: blockName,
    is_paid: isPaid,
    page_path: window.location.pathname,
  });
}

export function trackCommunityClick(data: {
  platform: string;
  personalityType: string;
  communityName: string;
  url: string;
  isPaid: boolean;
}): void {
  posthog.capture("community_click", {
    platform: data.platform,
    personality_type: data.personalityType,
    community_name: data.communityName,
    url: data.url,
    is_paid: data.isPaid,
    page_path: window.location.pathname,
  });
}

export function trackHomepageView(): void {
  posthog.capture("homepage_view", {
    page_path: "/",
    language: getLanguage(),
    ...utmParams,
  });
}

export function trackHeroCTAClick(ctaText: string): void {
  posthog.capture("hero_cta_click", {
    cta_text: ctaText,
    page_path: "/",
    language: getLanguage(),
    ...utmParams,
  });
}

export function trackCompareViewed(data: {
  personalityA: string;
  personalityB: string;
  discA: string;
  discB: string;
  isPaid: boolean;
}): void {
  posthog.capture("compare_viewed", {
    personality_a: data.personalityA,
    personality_b: data.personalityB,
    disc_a: data.discA,
    disc_b: data.discB,
    is_paid: data.isPaid,
  });
}

export function trackCompareShared(channel: string): void {
  posthog.capture("compare_shared", {
    share_channel: channel,
  });
}

export function trackFrameworkCardClick(framework: string): void {
  posthog.capture("framework_card_click", {
    framework,
    page_path: "/",
    language: getLanguage(),
    ...utmParams,
  });
}

export function trackCareerBlockViewed(data: {
  personalityType: string;
  segment: string;
  isPaid: boolean;
}): void {
  posthog.capture("career_block_viewed", {
    personality_type: data.personalityType,
    segment: data.segment,
    is_paid: data.isPaid,
    page_path: window.location.pathname,
  });
}

export function trackCareerIntakeCompleted(data: {
  ageRange: string;
  careerStage: string;
  testReason: string;
  personalityType: string;
}): void {
  posthog.capture("intake_completed", {
    age_range: data.ageRange,
    career_stage: data.careerStage,
    test_reason: data.testReason,
    personality_type: data.personalityType,
  });
}

export function trackCareerCTAClicked(data: {
  ctaText: string;
  personalityType: string;
  segment: string;
}): void {
  posthog.capture("career_cta_clicked", {
    cta_text: data.ctaText,
    personality_type: data.personalityType,
    segment: data.segment,
  });
}

export function trackCareerUpsellShown(data: {
  personalityType: string;
  segment: string;
}): void {
  posthog.capture("career_upsell_shown", {
    personality_type: data.personalityType,
    segment: data.segment,
  });
}

export function trackCareerAdviceShared(data: {
  personalityType: string;
  segment: string;
  shareChannel: string;
}): void {
  posthog.capture("career_advice_shared", {
    personality_type: data.personalityType,
    segment: data.segment,
    share_channel: data.shareChannel,
  });
}

export function trackBookClick(bookId: string, source: "free" | "paid"): void {
  posthog.capture("book_click", {
    book_id: bookId,
    source,
    $referrer: "amazon",
  });
}

export function trackBonusBlockViewed(segment: string): void {
  posthog.capture("bonus_block_viewed", {
    segment,
    page_path: window.location.pathname,
  });
}