import { useState } from "react";
import { trackShareCardShared } from "../utils/analytics";
import { getShareCopy, type Segment } from "../data/share-copy";

interface Props {
  shareText: string;
  shareUrl: string;
  framework: string;
  segment?: Segment | null;
  personalityType?: string;
}

const SHARE_CHANNELS = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: "💬",
    getUrl: (text: string, url: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    className: "share-btn-whatsapp",
  },
  {
    key: "twitter",
    label: "X / Twitter",
    icon: "𝕏",
    getUrl: (text: string, url: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    className: "share-btn-twitter",
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: "f",
    getUrl: (_text: string, url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    className: "share-btn-facebook",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: "in",
    getUrl: (_text: string, url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    className: "share-btn-linkedin",
  },
] as const;

export function ShareButtons({ shareText: _shareText, shareUrl, framework: _framework, segment = null, personalityType = "" }: Props) {
  const { shareText } = getShareCopy(segment);
  const [copied, setCopied] = useState(false);

  const handleShare = (channel: string, url: string) => {
    trackShareCardShared(channel, personalityType, segment);
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const handleCopyLink = async () => {
    trackShareCardShared("copy_link", personalityType, segment);
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="share-buttons-row">
      {SHARE_CHANNELS.map((ch) => (
        <button
          key={ch.key}
          className={`share-channel-btn ${ch.className}`}
          onClick={() => handleShare(ch.key, ch.getUrl(shareText, shareUrl))}
          title={ch.label}
        >
          <span className="share-channel-icon">{ch.icon}</span>
          <span className="share-channel-label">{ch.label}</span>
        </button>
      ))}
      <button
        className="share-channel-btn share-btn-copy"
        onClick={handleCopyLink}
        title="Copy link"
      >
        <span className="share-channel-icon">{copied ? "✓" : "🔗"}</span>
        <span className="share-channel-label">{copied ? "Copied!" : "Copy Link"}</span>
      </button>
    </div>
  );
}