import { useState, useEffect } from "react";
import { getInviteRef, setInviteRef } from "../utils/profile";

interface InviteBannerData {
  inviterName: string;
  inviterPersonalityType: string | null;
  inviterDiscStyle: string | null;
  inviterTopStrength: string | null;
  referralCode: string;
}

export function InviteBanner() {
  const [bannerData, setBannerData] = useState<InviteBannerData | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      setInviteRef(ref);
      loadInviteInfo(ref);
    } else {
      const storedRef = getInviteRef();
      if (storedRef) {
        loadInviteInfo(storedRef);
      }
    }
  }, []);

  async function loadInviteInfo(ref: string) {
    try {
      const res = await fetch(`/api/invite?ref=${encodeURIComponent(ref)}`);
      if (!res.ok) return;
      const data = await res.json();
      setBannerData({
        inviterName: data.inviterName || "Someone",
        inviterPersonalityType: data.inviterPersonalityType,
        inviterDiscStyle: data.inviterDiscStyle,
        inviterTopStrength: data.inviterTopStrength,
        referralCode: data.referralCode,
      });
    } catch {}
  }

  if (!bannerData || dismissed) return null;

  return (
    <div className="invite-banner">
      <div className="invite-banner-content">
        <div className="invite-banner-text">
          <strong>{bannerData.inviterName === "Someone" ? "" : bannerData.inviterName}</strong>
          {bannerData.inviterName !== "Someone" ? " " : ""}
          invited you to see how you work together
          {bannerData.inviterPersonalityType && (
            <span className="invite-banner-detail">
              {" "}— they're a {bannerData.inviterPersonalityType}
              {bannerData.inviterDiscStyle ? ` (${bannerData.inviterDiscStyle} DISC)` : ""}
            </span>
          )}
        </div>
        <button
          className="invite-banner-cta"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setDismissed(true);
          }}
        >
          Take the Free Assessment
        </button>
      </div>
      <button className="invite-banner-close" onClick={() => setDismissed(true)} aria-label="Dismiss">
        ✕
      </button>
    </div>
  );
}