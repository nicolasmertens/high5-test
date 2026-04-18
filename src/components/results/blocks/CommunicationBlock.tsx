import { useTranslation } from "react-i18next";
import { type DISCResult } from "../../../data/derivations";

interface Props {
  disc: DISCResult;
}

export function CommunicationBlock({ disc }: Props) {
  const { t } = useTranslation();
  return (
    <section className="branch-card">
      <div className="branch-icon">💬</div>
      <h3>{t("resultsBlocks.commTitle")}</h3>
      <p className="branch-desc">
        {t("resultsBlocks.commSubtitlePre")} <strong>{disc.style}</strong>{" "}
        {t("resultsBlocks.commSubtitlePost", { name: disc.primary.name, traits: disc.primary.traits.slice(0, 3).join(", ").toLowerCase() })}
      </p>
      <div className="branch-preview">
        <div className="comm-row">
          <span className="comm-label" style={{ background: "#ef4444" }}>{t("resultsBlocks.commWithD")}</span>
          <span className="comm-tip">{t("resultsBlocks.commTipD")}</span>
        </div>
        <div className="comm-row">
          <span className="comm-label" style={{ background: "#f59e0b" }}>{t("resultsBlocks.commWithI")}</span>
          <span className="comm-tip">{t("resultsBlocks.commTipI")}</span>
        </div>
        <div className="comm-row">
          <span className="comm-label" style={{ background: "#10b981" }}>{t("resultsBlocks.commWithS")}</span>
          <span className="comm-tip">{t("resultsBlocks.commTipS")}</span>
        </div>
        <div className="comm-row">
          <span className="comm-label" style={{ background: "#8b5cf6" }}>{t("resultsBlocks.commWithC")}</span>
          <span className="comm-tip">{t("resultsBlocks.commTipC")}</span>
        </div>
      </div>
    </section>
  );
}
