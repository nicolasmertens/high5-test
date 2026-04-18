import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { type PersonalityResult, type DISCResult } from "../../../data/derivations";
import { getLeadershipStyle } from "../../../data/profileContent";
import { trackBlockViewed } from "../../../utils/analytics";

interface Props {
  personality: PersonalityResult;
  disc: DISCResult;
  isPaid: boolean;
}

export function LeadershipBlock({ personality, disc, isPaid }: Props) {
  const { t } = useTranslation();
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
      <h3>{t("resultsBlocks.leadershipTitle")}</h3>
      <p className="branch-desc">
        {t("resultsBlocks.leadershipSubtitle", { disc: disc.style, type: personality.type })}
      </p>
      <div className="branch-preview">
        <div className="leadership-preview">
          <p>{getLeadershipStyle(disc.primary.code, personality.type)}</p>
        </div>
      </div>
    </section>
  );
}
