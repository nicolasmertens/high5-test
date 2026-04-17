import { useEffect, useRef } from "react";
import { type EnneagramResult } from "../../../data/derivations";
import { getStressInfo } from "../../../data/profileContent";
import { trackBlockViewed } from "../../../utils/analytics";
import { LogoIcon } from "../../LogoIcon";

interface Props {
  enneagram: EnneagramResult;
  isPaid: boolean;
}

export function StressBlock({ enneagram, isPaid }: Props) {
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
      <h3>You Under Stress</h3>
      <p className="branch-desc">
        As an Enneagram {enneagram.wingLabel} ({enneagram.primary.name}), stress pushes you toward
        different behaviors than your usual self.
      </p>
      <div className="branch-preview">
        <div className="stress-grid">
          <div className="stress-item stress-normal">
            <strong>At your best</strong>
            <p>{info.best}</p>
          </div>
          <div className="stress-item stress-bad">
            <strong>Under stress</strong>
            <p>{info.stress}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
