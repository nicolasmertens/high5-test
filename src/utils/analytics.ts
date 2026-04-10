type Framework = "disc" | "personality" | "enneagram" | "strengths";

type UpgradeType = "full_profile" | "ai_playbook";

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
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

const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined;

let ga4Loaded = false;

function loadGA4(): void {
  if (ga4Loaded || !GA4_MEASUREMENT_ID || typeof window === "undefined") return;
  ga4Loaded = true;

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  }
  gtag("js", new Date());
  gtag("config", GA4_MEASUREMENT_ID, {
    send_page_view: false,
    linker: { domains: ["1test.me"] },
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  script.addEventListener("error", () => {
    ga4Loaded = false;
  });
  document.head.appendChild(script);
}

let utmParams: UTMParams = {};
let testStartTime: number | null = null;

function pushToDataLayer(data: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

function gtag(...args: unknown[]): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

export function initAnalytics(): void {
  loadGA4();
  utmParams = captureUTMParams();

  const sessionStart = sessionStorage.getItem(SESSION_STARTED_KEY);
  if (!sessionStart) {
    sessionStorage.setItem(SESSION_STARTED_KEY, Date.now().toString());
    pushToDataLayer({
      event: "session_start",
      ...utmParams,
    });
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

export function trackPageView(pagePath: string, pageTitle: string): void {
  gtag("event", "page_view", {
    page_path: pagePath,
    page_title: pageTitle,
    page_location: window.location.href,
    referrer: document.referrer,
    ...utmParams,
  });

  pushToDataLayer({
    event: "page_view",
    page_path: pagePath,
    page_title: pageTitle,
    page_location: window.location.href,
    referrer: document.referrer,
    ...utmParams,
  });
}

export function trackTestStarted(framework: Framework | "all", landingPage?: string): void {
  testStartTime = Date.now();
  sessionStorage.setItem(TEST_STARTED_KEY, testStartTime.toString());

  const event: Record<string, unknown> = {
    event: "test_started",
    framework,
    landing_page: landingPage || window.location.pathname,
    ...utmParams,
  };

  gtag("event", "test_started", event);
  pushToDataLayer(event);
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

  const event: Record<string, unknown> = {
    event: "question_answered",
    framework,
    question_number: questionNumber,
    completion_pct: completionPct,
  };

  gtag("event", "question_answered", event);
  pushToDataLayer(event);
}

export function trackTestCompleted(
  framework: string = "strengths",
  questionCount: number = 120
): void {
  const stored = sessionStorage.getItem(TEST_STARTED_KEY);
  const timeSpent = stored
    ? Math.round((Date.now() - parseInt(stored, 10)) / 1000)
    : undefined;

  const event: Record<string, unknown> = {
    event: "test_completed",
    framework,
    question_count: questionCount,
    ...(timeSpent !== undefined ? { time_spent_seconds: timeSpent } : {}),
    ...utmParams,
  };

  gtag("event", "test_completed", event);
  pushToDataLayer(event);
}

export function trackResultsViewed(data: {
  framework?: string;
  personality_type?: string;
  disc_type?: string;
  enneagram_type?: string;
  top_strength?: string;
}): void {
  const event: Record<string, unknown> = {
    event: "results_viewed",
    framework: data.framework || "strengths",
    ...(data.personality_type ? { personality_type: data.personality_type } : {}),
    ...(data.disc_type ? { disc_type: data.disc_type } : {}),
    ...(data.enneagram_type ? { enneagram_type: data.enneagram_type } : {}),
    ...(data.top_strength ? { top_strength: data.top_strength } : {}),
  };

  gtag("event", "results_viewed", event);
  pushToDataLayer(event);
}

export function trackUpgradeViewed(
  framework: string,
  sourceSection: string,
  upgradeType: UpgradeType = "full_profile"
): void {
  const event: Record<string, unknown> = {
    event: "upgrade_viewed",
    framework,
    source_section: sourceSection,
    upgrade_type: upgradeType,
  };

  gtag("event", "upgrade_viewed", event);
  pushToDataLayer(event);
}

export function trackCheckoutStarted(
  framework: string = "strengths",
  upgradeType: UpgradeType = "full_profile"
): void {
  const event: Record<string, unknown> = {
    event: "begin_checkout",
    framework,
    upgrade_type: upgradeType,
    price_variant: "12_one_time",
  };

  gtag("event", "begin_checkout", event);
  pushToDataLayer(event);
}

export function trackPurchase(data: {
  framework?: string;
  upgradeType?: UpgradeType;
  revenueAmount?: number;
  currency?: string;
  transactionId?: string;
}): void {
  const event: Record<string, unknown> = {
    event: "purchase",
    framework: data.framework || "strengths",
    upgrade_type: data.upgradeType || "full_profile",
    revenue_amount: data.revenueAmount || 12,
    currency: data.currency || "USD",
    ...(data.transactionId ? { transaction_id: data.transactionId } : {}),
    ...utmParams,
  };

  gtag("event", "purchase", event);
  pushToDataLayer(event);
}

export function trackDeliverableGenerated(
  framework: string,
  deliverableType: "pdf" | "playbook",
  generationTimeSeconds?: number
): void {
  const event: Record<string, unknown> = {
    event: "deliverable_generated",
    framework,
    deliverable_type: deliverableType,
    ...(generationTimeSeconds !== undefined
      ? { generation_time_seconds: generationTimeSeconds }
      : {}),
  };

  gtag("event", "deliverable_generated", event);
  pushToDataLayer(event);
}

export function trackEmailCaptured(emailSource: string, framework?: string): void {
  const event: Record<string, unknown> = {
    event: "email_captured",
    email_source: emailSource,
    ...(framework ? { framework } : {}),
  };

  gtag("event", "email_captured", event);
  pushToDataLayer(event);
}

export function trackShare(framework: string, shareChannel: string): void {
  const event: Record<string, unknown> = {
    event: "share",
    framework,
    share_channel: shareChannel,
  };

  gtag("event", "share", event);
  pushToDataLayer(event);

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/analytics",
      JSON.stringify({
        event: "share",
        framework,
        share_channel: shareChannel,
        timestamp: new Date().toISOString(),
      })
    );
  }
}

export function trackScrollDepth(pagePath: string, depthPct: number): void {
  const event: Record<string, unknown> = {
    event: "scroll_depth",
    page_path: pagePath,
    depth_pct: depthPct,
  };

  gtag("event", "scroll_depth", event);
  pushToDataLayer(event);
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