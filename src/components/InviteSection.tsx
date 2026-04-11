import { useState, useEffect } from "react";
import { type StrengthScore } from "../hooks/useAssessment";
import { type PersonalityResult, type EnneagramResult, type DISCResult } from "../data/derivations";
import { usePayment } from "../contexts/PaymentContext";
import {
  getStoredProfileHash,
  getStoredReferralCode,
} from "../utils/profile";
import { trackInviteSent, trackInviteLinkCopied } from "../utils/analytics";

interface Props {
  results: StrengthScore[];
  personality: PersonalityResult;
  enneagram: EnneagramResult;
  disc: DISCResult;
}

export function InviteSection({ results: _results, personality, enneagram: _enneagram, disc: _disc }: Props) {
  const { isPaid } = usePayment();
  const [emails, setEmails] = useState<string[]>(["", "", ""]);
  const [sending, setSending] = useState(false);
  const [sentEmails, setSentEmails] = useState<Set<number>>(new Set());
  const [error, setError] = useState("");
  const [refLink, setRefLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [inviteCount, setInviteCount] = useState(0);
  const MAX_FREE_INVITES = 3;

  useEffect(() => {
    const code = getStoredReferralCode();
    if (code) {
      setRefLink(`https://1test.me/?ref=${code}`);
    }
    loadInviteCount();
  }, []);

  async function loadInviteCount() {
    const profileHash = getStoredProfileHash();
    if (!profileHash) return;
    try {
      const res = await fetch(`/api/invite?profile=${profileHash}`);
      if (res.ok) {
        const data = await res.json();
        const activeInvites = (data.invites || []).filter(
          (i: any) => i.status !== "expired",
        ).length;
        setInviteCount(activeInvites);
      }
    } catch {}
  }

  async function handleSend(index: number) {
    const email = emails[index]?.trim();
    if (!email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!consentGiven) {
      setError("Please confirm that your colleague will know you invited them");
      return;
    }

    const profileHash = getStoredProfileHash();
    if (!profileHash) {
      setError("Profile not found. Please complete the assessment first.");
      return;
    }

    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inviterProfileHash: profileHash,
          inviterName: personality.type,
          inviteeEmail: email,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send invite");
      }

      const data = await res.json();
      setInviteCount(data.existingCount ?? inviteCount + 1);
      setRefLink(`https://1test.me/?ref=${data.referralCode}`);
      setSentEmails((prev) => new Set([...prev, index]));

      trackInviteSent("email", inviteCount + 1, isPaid);

      setEmails((prev) => {
        const copy = [...prev];
        copy[index] = "";
        return copy;
      });
    } catch (err: any) {
      setError(err.message || "Failed to send invite");
    } finally {
      setSending(false);
    }
  }

  async function handleCopyLink() {
    const profileHash = getStoredProfileHash();
    const referralCode = getStoredReferralCode();

    if (!profileHash || !referralCode) {
      setError("Profile not found. Please refresh and try again.");
      return;
    }

    const link = `https://1test.me/?ref=${referralCode}&utm_source=invite&utm_medium=link&utm_campaign=relationship_report`;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = link;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setLinkCopied(true);
    trackInviteLinkCopied(isPaid);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  const remainingFree = MAX_FREE_INVITES - inviteCount;
  const canSendMore = isPaid || remainingFree > 0;

  return (
    <div className="invite-section">
      <div className="invite-icon">👥</div>
      <h3>See How You Work With Others</h3>
      <p className="invite-desc">
        Invite up to {isPaid ? "unlimited" : "3"} colleagues for free. Each person who
        completes the assessment unlocks a relationship report for both of you.
      </p>

      <div className="invite-emails">
        {emails.map((email, i) => {
          const isSent = sentEmails.has(i);
          const isDisabled = sending || isSent || (!canSendMore && !isPaid);

          if (isSent) {
            return (
              <div key={i} className="invite-email-row invite-email-sent">
                <span className="invite-sent-check">✓</span>
                <span className="invite-sent-text">Invite sent!</span>
              </div>
            );
          }

          if (!canSendMore && !isPaid && i > 0) {
            return null;
          }

          return (
            <div key={i} className="invite-email-row">
              <input
                type="email"
                className="invite-email-input"
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => {
                  const copy = [...emails];
                  copy[i] = e.target.value;
                  setEmails(copy);
                  setError("");
                }}
                disabled={isDisabled}
              />
              <button
                className="invite-send-btn"
                onClick={() => handleSend(i)}
                disabled={isDisabled || !email.trim()}
              >
                {sending ? "..." : "Send"}
              </button>
            </div>
          );
        })}
      </div>

      {!isPaid && (
        <p className="invite-counter">
          {inviteCount} of {MAX_FREE_INVITES} free invites used
          {remainingFree <= 0 && (
            <span className="invite-upsell">
              {" "}
              — Want unlimited invites?{" "}
              <a href="/?utm_source=invite_limit&utm_medium=upsell&utm_campaign=relationship_report#upgrade">
                Upgrade to Full Profile
              </a>
            </span>
          )}
        </p>
      )}

      {refLink && (
        <div className="invite-link-section">
          <p className="invite-link-label">Or copy your invite link:</p>
          <div className="invite-link-row">
            <input
              type="text"
              className="invite-link-input"
              value={refLink}
              readOnly
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button className="invite-copy-btn" onClick={handleCopyLink}>
              {linkCopied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}

      <label className="invite-consent">
        <input
          type="checkbox"
          checked={consentGiven}
          onChange={(e) => setConsentGiven(e.target.checked)}
        />
        <span>
          Your colleague will know you invited them and will see a compatibility report. Your detailed results stay private.
        </span>
      </label>

      {error && <p className="invite-error">{error}</p>}
    </div>
  );
}