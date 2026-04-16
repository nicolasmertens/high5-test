import { gcsGet, gcsSetWithTTL, gcsList } from "./gcs-storage.js";

const REPORT_TTL = 60 * 60 * 24 * 90;

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

export async function storeReport(report: RelationshipReport): Promise<void> {
  await gcsSetWithTTL(`relationships/${report.id}.json`, report, REPORT_TTL);
  await gcsSetWithTTL(`relationships/by-profile/${report.profileA}/${report.id}.json`, { reportId: report.id }, REPORT_TTL);
  await gcsSetWithTTL(`relationships/by-profile/${report.profileB}/${report.id}.json`, { reportId: report.id }, REPORT_TTL);
}

export async function getReport(id: string): Promise<RelationshipReport | null> {
  return gcsGet<RelationshipReport>(`relationships/${id}.json`);
}

export async function getReportsByProfile(profileHash: string): Promise<RelationshipReport[]> {
  const keys = await gcsList(`relationships/by-profile/${profileHash}/`);
  const reports: RelationshipReport[] = [];
  for (const key of keys) {
    const idx = await gcsGet<{ reportId: string }>(key);
    if (idx) {
      const report = await getReport(idx.reportId);
      if (report) reports.push(report);
    }
  }
  return reports;
}