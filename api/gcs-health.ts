import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Storage } from "@google-cloud/storage";
import { getPrivateKey } from "./lib/gcs-storage.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const b64Present = !!(process.env.GCS_PRIVATE_KEY_BASE64 || "").trim();
  const rawKeyPresent = !!(process.env.GCS_PRIVATE_KEY || "").trim();
  const projectIdPresent = !!(process.env.GCS_PROJECT_ID || "").trim();
  const clientEmailPresent = !!(process.env.GCS_CLIENT_EMAIL || "").trim();
  const bucketNamePresent = !!(process.env.GCS_BUCKET_NAME || "").trim();

  const privateKey = getPrivateKey();
  const decodedKeyStartsWithBegin = privateKey ? privateKey.startsWith("-----BEGIN PRIVATE KEY-----") : false;
  const decodedKeyLength = privateKey ? privateKey.length : 0;

  const source = b64Present ? "GCS_PRIVATE_KEY_BASE64" : rawKeyPresent ? "GCS_PRIVATE_KEY" : "none";

  let authResult: string;
  if (!projectIdPresent || !clientEmailPresent || !privateKey) {
    authResult = `skipped: missing credentials (projectId=${projectIdPresent} clientEmail=${clientEmailPresent} privateKey=${!!privateKey})`;
  } else {
    try {
      const storage = new Storage({
        projectId: process.env.GCS_PROJECT_ID,
        credentials: {
          client_email: process.env.GCS_CLIENT_EMAIL,
          private_key: privateKey,
        },
      });
      const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || "");
      const [exists] = await bucket.exists();
      authResult = exists ? "ok" : "auth_ok_bucket_not_found";
    } catch (err: any) {
      authResult = `error: ${err.code || "unknown"} - ${err.message || String(err)}`;
    }
  }

  return res.status(200).json({
    envVars: { b64Present, rawKeyPresent, projectIdPresent, clientEmailPresent, bucketNamePresent },
    keyNormalization: { decodedKeyStartsWithBegin, decodedKeyLength, source },
    authResult,
  });
}