export interface ResendInboundPayload {
  object: string;
  id: string;
  from: string;
  to: string[];
  created_at: string;
  subject: string;
  html: string;
  text: string;
  reply_to: string[];
  attachments: Array<{
    id: string;
    filename: string;
    content_type: string;
    content: string;
    size: number;
  }>;
}

export type EmailCategory =
  | "general_support"
  | "billing_finance"
  | "partnership_outreach"
  | "spam_noise"
  | "refund"
  | "gdpr_data"
  | "account_technical"
  | "pricing";

export type EmailStatus = "new" | "triaged" | "responded" | "closed";

export interface InboundEmail {
  id: string;
  resendId: string;
  from: string;
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo: string[];
  category: EmailCategory;
  status: EmailStatus;
  autoResponseSent: boolean;
  autoResponseTemplate: string | null;
  flaggedForReview: boolean;
  reviewReason: string | null;
  attachments: Array<{
    id: string;
    filename: string;
    contentType: string;
    size: number;
  }>;
  receivedAt: number;
  classifiedAt: number;
}