import { Redis } from "@upstash/redis";

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

const REPORT_PREFIX = "report:";
const REPORT_BY_PROFILE_PREFIX = "rprof:";
const REPORT_EXPIRY_SECONDS = 60 * 60 * 24 * 90;

export interface RelationshipReport {
  id: string;
  profileA: string;
  profileB: string;
  compatibilityScore: number;
  discCompatibility: DISCCompatibilityDetail;
  strengthsOverlap: StrengthsOverlapDetail;
  personalityInteraction: PersonalityPairDetail;
  enneagramConnection: EnneagramPairDetail;
  profileASummary: ProfileSummary;
  profileBSummary: ProfileSummary;
  createdAt: number;
}

export interface DISCCompatibilityDetail {
  score: number;
  typeA: string;
  typeB: string;
  howACommunicatesWithB: string;
  howBCommunicatesWithA: string;
  bestMeetingFormat: string;
  tips: string[];
}

export interface StrengthsOverlapDetail {
  score: number;
  shared: string[];
  complementA: string[];
  complementB: string[];
  friction: string[];
}

export interface PersonalityPairDetail {
  score: number;
  typeA: string;
  typeB: string;
  label: string;
  dynamic: string;
  tip: string;
}

export interface EnneagramPairDetail {
  typeA: number;
  typeB: number;
  label: string;
  dynamic: string;
  atBest: string;
  underStress: string;
}

export interface ProfileSummary {
  personalityType: string;
  personalityLabel: string;
  discStyle: string;
  discPrimary: string;
  enneagramWing: string;
  topStrengths: string[];
}

function reportKey(id: string): string {
  return `${REPORT_PREFIX}${id}`;
}

function reportByProfileKey(profileHash: string, idx: number): string {
  return `${REPORT_BY_PROFILE_PREFIX}${profileHash}:${idx}`;
}

export async function storeReport(report: RelationshipReport): Promise<void> {
  const kv = getRedis();
  await kv.set(reportKey(report.id), JSON.stringify(report));
  await kv.expire(reportKey(report.id), REPORT_EXPIRY_SECONDS);

  const aIds = await getReportIdsByProfile(kv, report.profileA);
  await kv.set(reportByProfileKey(report.profileA, aIds.length), report.id);
  await kv.expire(reportByProfileKey(report.profileA, aIds.length), REPORT_EXPIRY_SECONDS);

  const bIds = await getReportIdsByProfile(kv, report.profileB);
  await kv.set(reportByProfileKey(report.profileB, bIds.length), report.id);
  await kv.expire(reportByProfileKey(report.profileB, bIds.length), REPORT_EXPIRY_SECONDS);
}

export async function getReport(id: string): Promise<RelationshipReport | null> {
  const kv = getRedis();
  const raw = await kv.get<Record<string, unknown>>(reportKey(id));
  if (!raw) return null;
  return raw as unknown as RelationshipReport;
}

export async function getReportsByProfile(profileHash: string): Promise<RelationshipReport[]> {
  const kv = getRedis();
  const ids = await getReportIdsByProfile(kv, profileHash);
  const reports: RelationshipReport[] = [];
  for (const id of ids) {
    const report = await getReport(id);
    if (report) reports.push(report);
  }
  return reports;
}

async function getReportIdsByProfile(kv: Redis, profileHash: string): Promise<string[]> {
  const ids: string[] = [];
  let idx = 0;
  while (true) {
    const id = await kv.get<string>(reportByProfileKey(profileHash, idx));
    if (!id) break;
    ids.push(id as string);
    idx++;
    if (idx > 10) break;
  }
  return ids;
}