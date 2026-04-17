import { useEffect, useRef } from "react";
import { type PersonalityResult } from "../../../data/derivations";
import { getFamousPeople } from "../../../data/profileContent";
import { trackBlockViewed } from "../../../utils/analytics";

interface Props {
  personality: PersonalityResult;
  isPaid: boolean;
}

export function FamousPeopleBlock({ personality, isPaid }: Props) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!isPaid && !tracked.current) {
      tracked.current = true;
      trackBlockViewed("famous", false);
    }
  }, [isPaid]);

  return (
    <section className="branch-card">
      <div className="branch-icon">⭐</div>
      <h3>Famous People Like You</h3>
      <p className="branch-desc">Notable {personality.type}s who share your personality pattern.</p>
      <div className="branch-preview">
        <div className="famous-tags">
          {getFamousPeople(personality.type).map((person) => (
            <span key={person} className="famous-tag">
              {person}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
