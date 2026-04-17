import { gcsGet, gcsSet } from "./gcs-storage.js";

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