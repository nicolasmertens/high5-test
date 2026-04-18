import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { type PersonalityResult } from "../../../data/derivations";
import { getFamousPeople } from "../../../data/profileContent";
import { trackBlockViewed } from "../../../utils/analytics";

interface Props {
  personality: PersonalityResult;
  isPaid: boolean;
}

export function FamousPeopleBlock({ personality, isPaid }: Props) {
  const { t } = useTranslation();
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
      <h3>{t("resultsBlocks.famousTitle")}</h3>
      <p className="branch-desc">{t("resultsBlocks.famousSubtitle", { type: personality.type })}</p>
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
