import { Redis } from "@upstash/redis";
import type { Subscriber } from "./types";

let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      throw new Error("UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set");
    }
    redis = new Redis({ url, token });
  }
  return redis;
}

const SUBSCRIBER_PREFIX = "sub:";
const SCHEDULE_PREFIX = "schedule:";
const EMAIL_INDEX_PREFIX = "email:";

function subscriberKey(id: string): string {
  return `${SUBSCRIBER_PREFIX}${id}`;
}

const emailIndexKey = (email: string) => `${EMAIL_INDEX_PREFIX}${email.toLowerCase()}`;
const scheduleKey = (ts: number) => `${SCHEDULE_PREFIX}${ts}`;

export async function createSubscriber(data: {
  email: string;
  firstName: string;
  frameworkName: string;
  frameworkType: string;
  oneSentenceTraitSummary: string;
}): Promise<Subscriber> {
  const kv = getRedis();
  const existingId = await kv.get<string>(emailIndexKey(data.email));
  if (existingId) {
    const raw = await kv.get<Record<string, unknown>>(subscriberKey(existingId));
    if (raw) {
      const existing = raw as unknown as Subscriber;
      if (!existing.suppressed) return existing;
    }
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

  await kv.set(subscriberKey(id), JSON.stringify(subscriber));
  await kv.set(emailIndexKey(data.email), id);
  return subscriber;
}

export async function getSubscriber(id: string): Promise<Subscriber | null> {
  const kv = getRedis();
  const raw = await kv.get<Record<string, unknown>>(subscriberKey(id));
  if (!raw) return null;
  return raw as unknown as Subscriber;
}

export async function getSubscriberByEmail(email: string): Promise<Subscriber | null> {
  const kv = getRedis();
  const id = await kv.get<string>(emailIndexKey(email));
  if (!id) return null;
  return getSubscriber(id);
}

export async function updateSubscriber(subscriber: Subscriber): Promise<void> {
  const kv = getRedis();
  await kv.set(subscriberKey(subscriber.id), JSON.stringify(subscriber));
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
  const kv = getRedis();
  const key = scheduleKey(sendAt);
  await kv.sadd(key, subscriberId);
  await kv.expire(key, 60 * 60 * 24 * 8);
}

export async function getScheduledSubscribers(before: number): Promise<Array<{ subscriberId: string; sendAt: number }>> {
  const kv = getRedis();
  const results: Array<{ subscriberId: string; sendAt: number }> = [];

  const keys = await kv.keys(`${SCHEDULE_PREFIX}*`);
  for (const key of keys) {
    const timestamp = parseInt(key.replace(SCHEDULE_PREFIX, ""), 10);
    if (isNaN(timestamp) || timestamp > before) continue;

    const members = await kv.smembers<string>(key);
    for (const memberId of members) {
      results.push({ subscriberId: memberId, sendAt: timestamp });
    }
    await kv.del(key);
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