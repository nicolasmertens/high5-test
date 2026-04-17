import { useEffect, useRef } from "react";
import { trackBlockViewed, trackCommunityClick } from "../utils/analytics";

type Platform = "reddit" | "facebook" | "discord" | "linkedin" | "meetup";

interface CommunityLink {
  name: string;
  url: string;
  platform: Platform;
  description: string;
  paidOnly?: boolean;
}

const PLATFORM_LABEL: Record<Platform, string> = {
  reddit: "Reddit",
  facebook: "Facebook",
  discord: "Discord",
  linkedin: "LinkedIn",
  meetup: "Meetup",
};

// Subreddits that exist for each MBTI type — all 16 `r/{TYPE}` subreddits
// exist on Reddit (verified manually by Reddit's naming convention: uppercase,
// no underscores). r/mbti is the cross-type hub.
function getCommunities(personalityType: string, isPaid: boolean): CommunityLink[] {
  const type = personalityType.toUpperCase();
  const facebookSearch = `https://www.facebook.com/search/groups/?q=${encodeURIComponent(type + " personality")}`;
  const linkedinSearch = `https://www.linkedin.com/search/results/groups/?keywords=${encodeURIComponent(type)}`;
  const meetupSearch = `https://www.meetup.com/find/?keywords=${encodeURIComponent(type + " personality")}`;

  const free: CommunityLink[] = [
    {
      name: `r/${type}`,
      url: `https://www.reddit.com/r/${type}/`,
      platform: "reddit",
      description: `Type-specific subreddit for ${type}s`,
    },
    {
      name: "r/mbti",
      url: "https://www.reddit.com/r/mbti/",
      platform: "reddit",
      description: "Largest cross-type MBTI community on Reddit",
    },
    {
      name: `${type} groups on Facebook`,
      url: facebookSearch,
      platform: "facebook",
      description: `Find active ${type} Facebook groups`,
    },
    {
      name: "PersonalityCafe Discord",
      url: "https://discord.gg/personalitycafe",
      platform: "discord",
      description: "Active chat across all 16 types",
    },
  ];

  if (!isPaid) return free;

  const paidExtras: CommunityLink[] = [
    {
      name: `${type} LinkedIn groups`,
      url: linkedinSearch,
      platform: "linkedin",
      description: "Professional networks for your type",
      paidOnly: true,
    },
    {
      name: `${type} Meetups near you`,
      url: meetupSearch,
      platform: "meetup",
      description: "In-person events filtered by your type",
      paidOnly: true,
    },
  ];

  return [...free, ...paidExtras];
}

interface Props {
  personalityType: string;
  isPaid: boolean;
}

export function CommunitiesBlock({ personalityType, isPaid }: Props) {
  const viewed = useRef(false);
  const communities = getCommunities(personalityType, isPaid);

  useEffect(() => {
    if (!viewed.current) {
      viewed.current = true;
      trackBlockViewed("communities", isPaid);
    }
  }, [isPaid]);

  const handleClick = (c: CommunityLink) => {
    trackCommunityClick({
      platform: c.platform,
      personalityType,
      communityName: c.name,
      url: c.url,
      isPaid,
    });
  };

  return (
    <section className="branch-card">
      <div className="branch-icon">🌐</div>
      <h3>Communities For Your Type</h3>
      <p className="branch-desc">
        Connect with people who think like you — join {personalityType} communities
        {isPaid
          ? " across Reddit, Facebook, Discord, LinkedIn, and Meetup."
          : " across Reddit, Facebook, and Discord."}
      </p>
      <div className="branch-preview">
        <div className="community-links">
          {communities.map((c) => (
            <a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`community-link community-${c.platform}`}
              onClick={() => handleClick(c)}
            >
              <span className="community-platform">{PLATFORM_LABEL[c.platform]}</span>
              <span className="community-name">{c.name}</span>
              <span className="community-desc">{c.description}</span>
              {c.paidOnly && <span className="community-badge">Premium</span>}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
