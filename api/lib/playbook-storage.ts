import { gcsGet, gcsSet } from "./gcs-storage.js";
import type { PlaybookContent } from "./claude.js";

export interface PlaybookRequest {
  email: string;
  profileHash: string;
  personalityType: string;
  topStrengths: string[];
  discStyle: string;
  enneagramWing: string;
  createdAt: number;
}

export interface PlaybookStatus {
  email: string;
  profileHash: string;
  status: "pending" | "generating" | "completed" | "failed";
  createdAt: number;
  completedAt?: number;
  error?: string;
  generationTimeMs?: number;
}

export async function createPlaybookRequest(request: PlaybookRequest): Promise<void> {
  await gcsSet(`playbooks/requests/${request.email.toLowerCase()}.json`, request);
  const status: PlaybookStatus = {
    email: request.email,
    profileHash: request.profileHash,
    status: "pending",
    createdAt: request.createdAt,
  };
  await gcsSet(`playbooks/status/${request.email.toLowerCase()}.json`, status);
}

export async function getPlaybookRequest(
  email: string,
): Promise<PlaybookRequest | null> {
  return gcsGet<PlaybookRequest>(
    `playbooks/requests/${email.toLowerCase()}.json`,
  );
}

export async function getPlaybookStatus(
  email: string,
): Promise<PlaybookStatus | null> {
  return gcsGet<PlaybookStatus>(
    `playbooks/status/${email.toLowerCase()}.json`,
  );
}

export async function updatePlaybookStatus(
  email: string,
  update: Partial<PlaybookStatus>,
): Promise<void> {
  const existing = await getPlaybookStatus(email);
  if (!existing) return;
  await gcsSet(`playbooks/status/${email.toLowerCase()}.json`, {
    ...existing,
    ...update,
  });
}

export async function storePlaybookContent(
  email: string,
  content: PlaybookContent,
): Promise<void> {
  await gcsSet(`playbooks/content/${email.toLowerCase()}.json`, content);
}

export async function getPlaybookContent(
  email: string,
): Promise<PlaybookContent | null> {
  return gcsGet<PlaybookContent>(
    `playbooks/content/${email.toLowerCase()}.json`,
  );
}

export async function deletePlaybookData(email: string): Promise<void> {
  const { gcsDelete } = await import("./gcs-storage.js");
  const lower = email.toLowerCase();
  await Promise.allSettled([
    gcsDelete(`playbooks/requests/${lower}.json`),
    gcsDelete(`playbooks/status/${lower}.json`),
    gcsDelete(`playbooks/content/${lower}.json`),
  ]);
}