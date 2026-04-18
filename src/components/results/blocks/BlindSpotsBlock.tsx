import { useTranslation } from "react-i18next";
import { type StrengthScore } from "../../../hooks/useAssessment";

interface Props {
  results: StrengthScore[];
}

export function BlindSpotsBlock({ results }: Props) {
  const { t } = useTranslation();
  const bottom5 = results.slice(15);

  return (
    <section className="branch-card">
      <div className="branch-icon">🪞</div>
      <h3>{t("resultsBlocks.blindSpotsTitle")}</h3>
      <p className="branch-desc">
        {t("resultsBlocks.blindSpotsSubtitle")}
      </p>
      <div className="branch-preview">
        {bottom5.map((r) => (
          <div key={r.strength.id} className="blindspot-row">
            <span className="blindspot-name">{r.strength.name}</span>
            <span className="blindspot-score">{r.score}%</span>
            <p className="blindspot-tip">{r.strength.drained}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
