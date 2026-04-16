import type { ResendInboundPayload } from "./inbound-types.js";
import { gcsSetWithTTL } from "./gcs-storage.js";

interface HeaderFilterResult {
  filtered: false;
}

interface HeaderFilterResultBlocked {
  filtered: true;
  rule: "precedence_bulk" | "list_unsubscribe";
}

type FilterResult = HeaderFilterResult | HeaderFilterResultBlocked;

function filterKey(id: string): string {
  return `inbound/filtered/${id}.json`;
}

export function checkInboundHeaders(payload: ResendInboundPayload): FilterResult {
  const headers = payload.headers || [];

  for (const h of headers) {
    const name = (h.name || "").toLowerCase();
    const value = (h.value || "").toLowerCase().trim();

    if (name === "precedence" && value === "bulk") {
      return { filtered: true, rule: "precedence_bulk" };
    }

    if (name === "list-unsubscribe") {
      return { filtered: true, rule: "list_unsubscribe" };
    }
  }

  return { filtered: false };
}

export async function logFilteredEmail(
  payload: ResendInboundPayload,
  rule: "precedence_bulk" | "list_unsubscribe",
): Promise<void> {
  const entry = {
    id: crypto.randomUUID(),
    resendId: payload.id || crypto.randomUUID(),
    from: payload.from,
    subject: payload.subject,
    matchedRule: rule,
    filteredAt: Date.now(),
  };

  await gcsSetWithTTL(filterKey(entry.id), entry, 60 * 60 * 24 * 90);

  console.log(
    `Inbound email filtered: id=${entry.id} resendId=${entry.resendId} from=${entry.from} rule=${rule} subject="${entry.subject}"`,
  );
}