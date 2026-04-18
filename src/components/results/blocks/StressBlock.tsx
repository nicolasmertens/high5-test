import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { type EnneagramResult } from "../../../data/derivations";
import { getStressInfo } from "../../../data/profileContent";
import { trackBlockViewed } from "../../../utils/analytics";
import { LogoIcon } from "../../LogoIcon";

interface Props {
  enneagram: EnneagramResult;
  isPaid: boolean;
}

export function StressBlock({ enneagram, isPaid }: Props) {
  const { t } = useTranslation();
  const tracked = useRef(false);

  useEffect(() => {
    if (!isPaid && !tracked.current) {
      tracked.current = true;
      trackBlockViewed("stress", false);
    }
  }, [isPaid]);

  const info = getStressInfo(enneagram.primary.type);

  return (
    <section className="branch-card">
      <div className="branch-icon">
        <LogoIcon size={20} />
      </div>
      <h3>{t("resultsBlocks.stressTitle")}</h3>
      <p className="branch-desc">
        {t("resultsBlocks.stressSubtitle", { wingLabel: enneagram.wingLabel, name: enneagram.primary.name })}
      </p>
      <div className="branch-preview">
        <div className="stress-grid">
          <div className="stress-item stress-normal">
            <strong>{t("resultsBlocks.stressAtBest")}</strong>
            <p>{info.best}</p>
          </div>
          <div className="stress-item stress-bad">
            <strong>{t("resultsBlocks.stressUnder")}</strong>
            <p>{info.stress}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
