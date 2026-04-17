export interface NurtureEmailData {
  firstName: string;
  frameworkName: string;
  frameworkType: string;
  oneSentenceTraitSummary: string;
  upgradeUrl: string;
  faqUrl: string;
  unsubscribeLink: string;
}

export const NURTURE_SCHEDULES = [120, 2880, 5760] as const;

export interface NurtureSubscriber {
  id: string;
  email: string;
  firstName: string;
  frameworkName: string;
  frameworkType: string;
  oneSentenceTraitSummary: string;
  enrolledAt: number;
  nextEmailNumber: number;
  nextEmailAt: number;
  suppressed: boolean;
  purchasedAt: number | null;
  emailsSent: number[];
}