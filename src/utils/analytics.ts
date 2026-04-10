type ShareEvent = {
  framework: string;
  share_channel: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackShare(event: ShareEvent): void {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "share", {
      event_category: "engagement",
      event_label: event.framework,
      share_channel: event.share_channel,
    });
  }

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const payload = JSON.stringify({
      event: "share",
      ...event,
      timestamp: new Date().toISOString(),
    });
    navigator.sendBeacon("/api/analytics", payload);
  }
}