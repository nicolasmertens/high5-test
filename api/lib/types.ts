export interface WelcomeEmailData {
  firstName: string;
  frameworkName: string;
  frameworkType: string;
  oneSentenceTraitSummary: string;
  upgradeUrl: string;
  inviteUrl?: string;
  unsubscribeLink: string;
}

export const WELCOME_SEQUENCE = [
  { emailNumber: 1, delayMinutes: 0 },
  { emailNumber: 2, delayMinutes: 1440 },
  { emailNumber: 3, delayMinutes: 4320 },
  { emailNumber: 4, delayMinutes: 7200 },
  { emailNumber: 5, delayMinutes: 10080 },
] as const;

export const EMAIL_SCHEDULES = [0, 1440, 4320, 7200, 10080] as const;

export interface Subscriber {
  id: string;
  email: string;
  firstName: string;
  frameworkName: string;
  frameworkType: string;
  oneSentenceTraitSummary: string;
  subscribedAt: number;
  nextEmailNumber: number;
  nextEmailAt: number;
  suppressed: boolean;
  purchasedAt: number | null;
  emailsSent: number[];
}

export const FROM_EMAIL = "1Test <hello@1test.me>";
export const REPLY_TO = "hello@1test.me";