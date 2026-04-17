import { gcsGet, gcsSet, gcsList, gcsDelete } from "./gcs-storage.js";
import type { NurtureSubscriber } from "./nurture-types.js";

export async function createNurtureSubscriber(data: {
  email: string;
  firstName: string;
  frameworkName: string;
  frameworkType: string;
  oneSentenceTraitSummary: string;
}): Promise<NurtureSubscriber> {
  const existingId = await getNurtureSubscriberIdByEmail(data.email);
  if (existingId) {
    const existing = await getNurtureSubscriber(existingId);
    if (existing && !existing.suppressed) return existing;
  }

  const id = crypto.randomUUID();
  const now = Date.now();
  const subscriber: NurtureSubscriber = {
    id,
    email: data.email,
    firstName: data.firstName,
    frameworkName: data.frameworkName,
    frameworkType: data.frameworkType,
    oneSentenceTraitSummary: data.oneSentenceTraitSummary,
    enrolledAt: now,
    nextEmailNumber: 1,
    nextEmailAt: now,
    suppressed: false,
    purchasedAt: null,
    emailsSent: [],
  };

  await gcsSet(`nurture/${id}.json`, subscriber);
  await gcsSet(`nurture/by-email/${data.email.toLowerCase()}.json`, { subscriberId: id });
  return subscriber;
}

export async function getNurtureSubscriber(id: string): Promise<NurtureSubscriber | null> {
  return gcsGet<NurtureSubscriber>(`nurture/${id}.json`);
}

async function getNurtureSubscriberIdByEmail(email: string): Promise<string | null> {
  const idx = await gcsGet<{ subscriberId: string }>(`nurture/by-email/${email.toLowerCase()}.json`);
  return idx?.subscriberId ?? null;
}

export async function getNurtureSubscriberByEmail(email: string): Promise<NurtureSubscriber | null> {
  const id = await getNurtureSubscriberIdByEmail(email);
  if (!id) return null;
  return getNurtureSubscriber(id);
}

export async function updateNurtureSubscriber(subscriber: NurtureSubscriber): Promise<void> {
  await gcsSet(`nurture/${subscriber.id}.json`, subscriber);
}

export async function suppressNurtureSubscriber(id: string): Promise<NurtureSubscriber | null> {
  const subscriber = await getNurtureSubscriber(id);
  if (!subscriber) return null;
  subscriber.suppressed = true;
  subscriber.purchasedAt = Date.now();
  await updateNurtureSubscriber(subscriber);
  return subscriber;
}

export async function scheduleNurtureEmail(subscriberId: string, sendAt: number): Promise<void> {
  await gcsSet(`nurture-schedule/${sendAt}/${subscriberId}.json`, { subscriberId, sendAt });
}

export async function getScheduledNurtureSubscribers(before: number): Promise<Array<{ subscriberId: string; sendAt: number }>> {
  const results: Array<{ subscriberId: string; sendAt: number }> = [];
  const scheduleFiles = await gcsList("nurture-schedule/");

  for (const filePath of scheduleFiles) {
    const match = filePath.match(/^nurture-schedule\/(\d+)\/(.+)\.json$/);
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

export async function unsubscribeNurtureById(id: string): Promise<boolean> {
  const subscriber = await getNurtureSubscriber(id);
  if (!subscriber) return false;
  subscriber.suppressed = true;
  await updateNurtureSubscriber(subscriber);
  return true;
}