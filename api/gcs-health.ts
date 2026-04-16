import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Storage } from "@google-cloud/storage";
import { getPrivateKey } from "./lib/gcs-storage.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const b64Raw = process.env.GCS_PRIVATE_KEY_BASE64 || "";
  const rawKeyRaw = process.env.GCS_PRIVATE_KEY || "";
  const projectIdRaw = process.env.GCS_PROJECT_ID || "";
  const clientEmailRaw = process.env.GCS_CLIENT_EMAIL || "";
  const bucketNameRaw = process.env.GCS_BUCKET_NAME || "";

  const b64Present = !!b64Raw.trim();
  const rawKeyPresent = !!rawKeyRaw.trim();
  const projectId = projectIdRaw.trim();
  const clientEmail = clientEmailRaw.trim();
  const bucketName = bucketNameRaw.trim();

  const privateKey = getPrivateKey();
  const decodedKeyStartsWithBegin = privateKey ? privateKey.startsWith("-----BEGIN PRIVATE KEY-----") : false;
  const decodedKeyLength = privateKey ? privateKey.length : 0;

  const source = b64Present ? "GCS_PRIVATE_KEY_BASE64" : rawKeyPresent ? "GCS_PRIVATE_KEY" : "none";

  const clientEmailMasked = clientEmail.length > 4 ? clientEmail.slice(0, 2) + "***@" + clientEmail.split("@")[1] : "MISSING_OR_SHORT";

  let authResult: string;
  if (!projectId || !clientEmail || !privateKey) {
    authResult = `skipped: missing credentials (projectId=${!!projectId} clientEmail=${!!clientEmail} privateKey=${!!privateKey})`;
  } else {
    try {
      const storage = new Storage({
        projectId,
        credentials: {
          client_email: clientEmail,
          private_key: privateKey,
        },
      });
      const bucket = storage.bucket(bucketName);
      const [exists] = await bucket.exists();
      authResult = exists ? "ok" : "auth_ok_bucket_not_found";
    } catch (err: any) {
      authResult = `error: ${err.code || "unknown"} - ${err.message || String(err)}`;
    }
  }

  return res.status(200).json({
    envVars: { b64Present, rawKeyPresent, projectIdPresent: !!projectId, clientEmailPresent: !!clientEmail, bucketNamePresent: !!bucketName },
    keyNormalization: { decodedKeyStartsWithBegin, decodedKeyLength, source },
    clientEmailMasked,
    projectId,
    authResult,
  });
}