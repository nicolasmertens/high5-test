import { Storage } from "@google-cloud/storage";

let storageInstance: Storage | null = null;
let bucketInstance: ReturnType<Storage["bucket"]> | null = null;

function getStorage(): Storage {
  if (!storageInstance) {
    storageInstance = new Storage({
      projectId: process.env.GCS_PROJECT_ID,
      credentials: {
        client_email: process.env.GCS_CLIENT_EMAIL,
        private_key: process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
    });
  }
  return storageInstance;
}

export function getBucket() {
  if (!bucketInstance) {
    const bucketName = process.env.GCS_BUCKET_NAME;
    if (!bucketName) throw new Error("GCS_BUCKET_NAME must be set");
    bucketInstance = getStorage().bucket(bucketName);
  }
  return bucketInstance;
}

const PREFIX = "1test/";

export function gcsKey(path: string): string {
  return `${PREFIX}${path}`;
}

export async function gcsGet<T>(path: string): Promise<T | null> {
  const file = getBucket().file(gcsKey(path));
  const [exists] = await file.exists();
  if (!exists) return null;
  const [contents] = await file.download();
  return JSON.parse(contents.toString()) as T;
}

export async function gcsSet(path: string, data: unknown): Promise<void> {
  const file = getBucket().file(gcsKey(path));
  await file.save(Buffer.from(JSON.stringify(data)), {
    contentType: "application/json",
    metadata: {},
  });
}

export async function gcsSetWithTTL(path: string, data: unknown, ttlSeconds: number): Promise<void> {
  const file = getBucket().file(gcsKey(path));
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
  await file.save(Buffer.from(JSON.stringify(data)), {
    contentType: "application/json",
    metadata: {
      customTime: expiresAt.toISOString(),
    },
  });
}

export async function gcsExists(path: string): Promise<boolean> {
  const file = getBucket().file(gcsKey(path));
  const [exists] = await file.exists();
  return exists;
}

export async function gcsDelete(path: string): Promise<void> {
  const file = getBucket().file(gcsKey(path));
  await file.delete().catch(() => {});
}

export async function gcsList(prefix: string): Promise<string[]> {
  const [files] = getBucket().getFiles({ prefix: gcsKey(prefix) });
  return files.map((f) => f.name.replace(PREFIX, ""));
}