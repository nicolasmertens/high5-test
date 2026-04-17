import i18n from "../i18n";

export type Segment =
  | "university"
  | "early_career"
  | "plateaued"
  | "midlife"
  | "late_career"
  | "solopreneur";

export interface ShareCopy {
  shareText: string;
  cardSubtitle: string;
  landingCTA: string;
  compareText: string;
}

export function getShareCopy(segment: Segment | null): ShareCopy {
  const t = i18n.t.bind(i18n);
  switch (segment) {
    case "university":
      return {
        shareText: t("share.university.shareText", "I just discovered my top strengths — and they match careers I never considered. Take the free test:"),
        cardSubtitle: t("share.university.cardSubtitle", "Your career starts here"),
        landingCTA: t("share.university.landingCTA", "Start your career right — 1test.me"),
        compareText: t("share.university.compareText", "Compare your strengths with a friend"),
      };
    case "early_career":
      return {
        shareText: t("share.earlyCareer.shareText", "Turns out my personality type explains why certain roles drain me. Take the free test:"),
        cardSubtitle: t("share.earlyCareer.cardSubtitle", "Find your edge"),
        landingCTA: t("share.earlyCareer.landingCTA", "Find your edge — 1test.me"),
        compareText: t("share.earlyCareer.compareText", "See how you compare with your team"),
      };
    case "plateaued":
      return {
        shareText: t("share.plateaued.shareText", "I found my leadership gap — and it was not what I expected. Take the free test:"),
        cardSubtitle: t("share.plateaued.cardSubtitle", "Close your leadership gap"),
        landingCTA: t("share.plateaued.landingCTA", "Discover your leadership gap — 1test.me"),
        compareText: t("share.plateaued.compareText", "Compare leadership styles with a colleague"),
      };
    case "midlife":
      return {
        shareText: t("share.midlife.shareText", "My strengths pointed to a career I never thought about. Take the free test:"),
        cardSubtitle: t("share.midlife.cardSubtitle", "What's next for you?"),
        landingCTA: t("share.midlife.landingCTA", "Find what's next — 1test.me"),
        compareText: t("share.midlife.compareText", "See how your strengths compare"),
      };
    case "late_career":
      return {
        shareText: t("share.lateCareer.shareText", "I just mapped my strengths at 55 — and got clarity on what comes next. Take the free test:"),
        cardSubtitle: t("share.lateCareer.cardSubtitle", "Your next chapter starts here"),
        landingCTA: t("share.lateCareer.landingCTA", "Start your next chapter — 1test.me"),
        compareText: t("share.lateCareer.compareText", "Share your strengths with someone you trust"),
      };
    case "solopreneur":
      return {
        shareText: t("share.solopreneur.shareText", "The test told me my blind spot as a founder. Wish I knew this sooner. Take the free test:"),
        cardSubtitle: t("share.solopreneur.cardSubtitle", "Know your blind spots"),
        landingCTA: t("share.solopreneur.landingCTA", "Know your blind spots — 1test.me"),
        compareText: t("share.solopreneur.compareText", "Compare founder profiles with a co-founder"),
      };
    default:
      return {
        shareText: t("share.default.shareText", "I just discovered my top 5 strengths — and they changed how I think about my career. Take the free test:"),
        cardSubtitle: t("share.default.cardSubtitle", "One Test. Four Frameworks."),
        landingCTA: t("share.default.landingCTA", "Take the free test — 1test.me"),
        compareText: t("share.default.compareText", "Compare your results with a friend"),
      };
  }
}
