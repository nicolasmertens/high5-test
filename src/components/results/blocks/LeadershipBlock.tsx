import { useEffect, useRef } from "react";
import { type PersonalityResult, type DISCResult } from "../../../data/derivations";
import { getLeadershipStyle } from "../../../data/profileContent";
import { trackBlockViewed } from "../../../utils/analytics";

interface Props {
  personality: PersonalityResult;
  disc: DISCResult;
  isPaid: boolean;
}

export function LeadershipBlock({ personality, disc, isPaid }: Props) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!isPaid && !tracked.current) {
      tracked.current = true;
      trackBlockViewed("leadership", false);
    }
  }, [isPaid]);

  return (
    <section className="branch-card">
      <div className="branch-icon">👑</div>
      <h3>Your Leadership Style</h3>
      <p className="branch-desc">
        How your {disc.style} DISC profile and {personality.type} personality shape the way you
        lead — and what to watch out for.
      </p>
      <div className="branch-preview">
        <div className="leadership-preview">
          <p>{getLeadershipStyle(disc.primary.code, personality.type)}</p>
        </div>
      </div>
    </section>
  );
}
