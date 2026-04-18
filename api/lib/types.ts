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

export const AGENT_FROM_EMAILS: Record<string, string> = {
  alex: "Alex at 1Test <alex@1test.me>",
  clara: "Clara at 1Test <clara@1test.me>",
  oscar: "Oscar at 1Test <oscar@1test.me>",
  leo: "Leo at 1Test <leo@1test.me>",
  emma: "Emma at 1Test <emma@1test.me>",
  lucas: "Lucas at 1Test <lucas@1test.me>",
};

export const AGENT_REPLY_TO_EMAILS: Record<string, string> = {
  alex: "alex@1test.me",
  clara: "clara@1test.me",
  oscar: "oscar@1test.me",
  leo: "leo@1test.me",
  emma: "emma@1test.me",
  lucas: "lucas@1test.me",
};