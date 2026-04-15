import type { EmailCategory } from "./inbound-types";

const CATEGORY_KEYWORDS: Record<EmailCategory, string[]> = {
  refund: [
    "refund",
    "money back",
    "cancel and refund",
    "want a refund",
    "request a refund",
    "reimbursement",
  ],
  gdpr_data: [
    "gdpr",
    "delete my data",
    "delete my account",
    "personal data",
    "right to",
    "right to be forgotten",
    "right to access",
    "data request",
    "data deletion",
    "privacy request",
    "data export",
    "data portability",
  ],
  account_technical: [
    "account",
    "login",
    "password",
    "sign in",
    "sign up",
    "can't access",
    "cannot access",
    "broken",
    "error",
    "not working",
    "bug",
    "crash",
    "loading",
    "won't load",
    "results not showing",
    "can't complete",
    "test not loading",
  ],
  pricing: [
    "price",
    "pricing",
    "cost",
    "how much",
    "plan",
    "plans",
    "upgrade",
    "subscription",
    "tier",
    "what do i get",
    "free vs paid",
    "is it free",
  ],
  billing_finance: [
    "invoice",
    "receipt",
    "payment",
    "charge",
    "billing",
    "cancel subscription",
    "overcharged",
    "transaction",
    "statement",
    "debit",
    "credit",
    "bank",
    "paypal",
    "stripe",
  ],
  partnership_outreach: [
    "partner",
    "affiliate",
    "press",
    "media",
    "collaboration",
    "sponsor",
    "collab",
    "influencer",
    "brand deal",
    "promotion",
    "guest post",
    "backlink",
    "seo partnership",
  ],
  general_support: [
    "help",
    "question",
    "results",
    "test",
    "where is",
    "how do i",
    "lost my results",
    "can't find",
  ],
  spam_noise: [
    "viagra",
    "casino",
    "lottery",
    "winner",
    "congratulations you have won",
    "nigerian",
    "prince",
    "millions",
    "click here",
    "buy cheap",
    "enlargement",
    "pharmacy",
  ],
};

const SPAM_FROM_PATTERNS = [
  /noreply@/i,
  /no-reply@/i,
  /mailer-daemon@/i,
  /postmaster@/i,
];

const SPAM_SUBJECT_PATTERNS = [
  /^\[spam\]/i,
  /^\[bulk\]/i,
  /^undelivered/i,
  /^mail delivery failed/i,
  /^delivery status notification/i,
  /^out of office/i,
  /^auto:/i,
  /^automated reply/i,
];

export function classifyEmail(
  subject: string,
  text: string,
  from: string,
  html: string,
): EmailCategory {
  const combinedText = `${subject} ${text || ""} ${(html || "").replace(/<[^>]*>/g, " ")}`.toLowerCase();

  if (SPAM_FROM_PATTERNS.some((p) => p.test(from))) {
    return "spam_noise";
  }

  if (SPAM_SUBJECT_PATTERNS.some((p) => p.test(subject))) {
    return "spam_noise";
  }

  const spamScore = CATEGORY_KEYWORDS.spam_noise.filter((kw) =>
    combinedText.includes(kw.toLowerCase()),
  ).length;
  if (spamScore >= 2) {
    return "spam_noise";
  }

  const refundScore = CATEGORY_KEYWORDS.refund.filter((kw) =>
    combinedText.includes(kw.toLowerCase()),
  ).length;
  if (refundScore >= 1) {
    return "refund";
  }

  const gdprScore = CATEGORY_KEYWORDS.gdpr_data.filter((kw) =>
    combinedText.includes(kw.toLowerCase()),
  ).length;
  if (gdprScore >= 1) {
    return "gdpr_data";
  }

  const pricingScore = CATEGORY_KEYWORDS.pricing.filter((kw) =>
    combinedText.includes(kw.toLowerCase()),
  ).length;
  const accountScore = CATEGORY_KEYWORDS.account_technical.filter((kw) =>
    combinedText.includes(kw.toLowerCase()),
  ).length;
  const billingScore = CATEGORY_KEYWORDS.billing_finance.filter((kw) =>
    combinedText.includes(kw.toLowerCase()),
  ).length;
  const partnershipScore = CATEGORY_KEYWORDS.partnership_outreach.filter((kw) =>
    combinedText.includes(kw.toLowerCase()),
  ).length;
  const supportScore = CATEGORY_KEYWORDS.general_support.filter((kw) =>
    combinedText.includes(kw.toLowerCase()),
  ).length;

  const scores: Array<{ category: EmailCategory; score: number }> = [
    { category: "pricing", score: pricingScore },
    { category: "account_technical", score: accountScore },
    { category: "billing_finance", score: billingScore },
    { category: "partnership_outreach", score: partnershipScore },
    { category: "general_support", score: supportScore },
  ];

  scores.sort((a, b) => b.score - a.score);

  if (scores[0].score >= 2) {
    return scores[0].category;
  }

  if (scores[0].score >= 1) {
    return scores[0].category;
  }

  return "general_support";
}

export function shouldAutoRespond(category: EmailCategory): boolean {
  return ["general_support", "pricing", "account_technical", "gdpr_data", "refund"].includes(category);
}

export function shouldFlagForReview(category: EmailCategory): boolean {
  return ["billing_finance", "partnership_outreach"].includes(category);
}

export function isRefundRequest(subject: string, text: string): boolean {
  const combined = `${subject} ${text || ""}`.toLowerCase();
  return /\brefund\b/.test(combined) || /money back/i.test(combined) || /reimbursement/i.test(combined);
}