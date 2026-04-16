import { gcsGet, gcsSet, gcsExists, gcsList, gcsDelete } from "./gcs-storage.js";
import type { Subscriber } from "./types.js";

export async function createSubscriber(data: {
  email: string;
  firstName: string;
  frameworkName: string;
  frameworkType: string;
  oneSentenceTraitSummary: string;
}): Promise<Subscriber> {
  const existingId = await getSubscriberIdByEmail(data.email);
  if (existingId) {
    const existing = await getSubscriber(existingId);
    if (existing && !existing.suppressed) return existing;
  }

  const id = crypto.randomUUID();
  const now = Date.now();
  const subscriber: Subscriber = {
    id,
    email: data.email,
    firstName: data.firstName,
    frameworkName: data.frameworkName,
    frameworkType: data.frameworkType,
    oneSentenceTraitSummary: data.oneSentenceTraitSummary,
    subscribedAt: now,
    nextEmailNumber: 1,
    nextEmailAt: now,
    suppressed: false,
    purchasedAt: null,
    emailsSent: [],
  };

  await gcsSet(`subscribers/${id}.json`, subscriber);
  await gcsSet(`subscribers/by-email/${data.email.toLowerCase()}.json`, { subscriberId: id });
  return subscriber;
}

export async function getSubscriber(id: string): Promise<Subscriber | null> {
  return gcsGet<Subscriber>(`subscribers/${id}.json`);
}

async function getSubscriberIdByEmail(email: string): Promise<string | null> {
  const idx = await gcsGet<{ subscriberId: string }>(`subscribers/by-email/${email.toLowerCase()}.json`);
  return idx?.subscriberId ?? null;
}

export async function getSubscriberByEmail(email: string): Promise<Subscriber | null> {
  const id = await getSubscriberIdByEmail(email);
  if (!id) return null;
  return getSubscriber(id);
}

export async function updateSubscriber(subscriber: Subscriber): Promise<void> {
  await gcsSet(`subscribers/${subscriber.id}.json`, subscriber);
}

export async function suppressSubscriber(id: string): Promise<Subscriber | null> {
  const subscriber = await getSubscriber(id);
  if (!subscriber) return null;
  subscriber.suppressed = true;
  subscriber.purchasedAt = Date.now();
  await updateSubscriber(subscriber);
  return subscriber;
}

export async function scheduleEmail(subscriberId: string, sendAt: number): Promise<void> {
  await gcsSet(`schedule/${sendAt}/${subscriberId}.json`, { subscriberId, sendAt });
}

export async function getScheduledSubscribers(before: number): Promise<Array<{ subscriberId: string; sendAt: number }>> {
  const results: Array<{ subscriberId: string; sendAt: number }> = [];
  const scheduleFiles = await gcsList("schedule/");

  for (const filePath of scheduleFiles) {
    const match = filePath.match(/^schedule\/(\d+)\/(.+)\.json$/);
    if (!match) continue;

    const timestamp = parseInt(match[1], 10);
    if (isNaN(timestamp) || timestamp > before) continue;

    const entry = await gcsGet<{ subscriberId: string; sendAt: number }>(filePath);
    if (entry) {
      results.push(entry);
      await gcsDelete(filePath);
    }
  }

  return results;
}

export async function unsubscribeById(id: string): Promise<boolean> {
  const subscriber = await getSubscriber(id);
  if (!subscriber) return false;
  subscriber.suppressed = true;
  await updateSubscriber(subscriber);
  return true;
}