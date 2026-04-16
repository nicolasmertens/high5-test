import { Storage } from "@google-cloud/storage";

let storageInstance: Storage | null = null;
let bucketInstance: ReturnType<Storage["bucket"]> | null = null;

export function getPrivateKey(): string | undefined {
  const b64 = process.env.GCS_PRIVATE_KEY_BASE64;
  if (b64) {
    try {
      const decoded = Buffer.from(b64, "base64").toString("utf8");
      if (decoded.startsWith("-----BEGIN PRIVATE KEY-----")) {
        return decoded;
      }
    } catch {}
  }

  const key = process.env.GCS_PRIVATE_KEY;
  if (!key) return undefined;
  let normalized = key.trim();
  if ((normalized.startsWith('"') && normalized.endsWith('"')) || (normalized.startsWith("'") && normalized.endsWith("'"))) {
    normalized = normalized.slice(1, -1);
  }
  normalized = normalized.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n");
  if (!normalized.includes("\n") && normalized.includes("-----BEGIN PRIVATE KEY-----")) {
    normalized = normalized.replace(/-----BEGIN PRIVATE KEY-----/, "-----BEGIN PRIVATE KEY-----\n").replace(/-----END PRIVATE KEY-----/, "\n-----END PRIVATE KEY-----");
  }
  return normalized;
}

function getStorage(): Storage {
  if (!storageInstance) {
    const projectId = (process.env.GCS_PROJECT_ID || "").trim();
    const clientEmail = (process.env.GCS_CLIENT_EMAIL || "").trim();
    const bucketName = (process.env.GCS_BUCKET_NAME || "").trim();
    const privateKey = getPrivateKey();

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(`GCS credentials incomplete: projectId=${!!projectId} clientEmail=${!!clientEmail} privateKey=${!!privateKey}`);
    }

    storageInstance = new Storage({
      projectId,
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    });
  }
  return storageInstance;
}

export function getBucket() {
  if (!bucketInstance) {
    const bucketName = (process.env.GCS_BUCKET_NAME || "").trim();
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
  const [files] = await getBucket().getFiles({ prefix: gcsKey(prefix) });
  return files.map((f) => f.name.replace(PREFIX, ""));
}