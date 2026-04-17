import { gcsGet, gcsSet } from "./gcs-storage.js";

export interface StoredPayment {
  sessionId: string;
  email: string;
  tier: string;
  amount: number;
  currency: string;
  paidAt: number;
}

export async function storePayment(payment: StoredPayment): Promise<void> {
  await gcsSet(`payments/${payment.sessionId}.json`, payment);
  await gcsSet(`payments/by-email/${payment.email.toLowerCase()}.json`, {
    sessionId: payment.sessionId,
  });
}

export async function getPaymentBySessionId(
  sessionId: string,
): Promise<StoredPayment | null> {
  return gcsGet<StoredPayment>(`payments/${sessionId}.json`);
}

export async function getPaymentByEmail(
  email: string,
): Promise<StoredPayment | null> {
  const idx = await gcsGet<{ sessionId: string }>(
    `payments/by-email/${email.toLowerCase()}.json`,
  );
  if (!idx) return null;
  return getPaymentBySessionId(idx.sessionId);
}
