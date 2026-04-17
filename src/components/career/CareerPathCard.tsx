import type { CareerPath } from "../../careerData/careerPathLibrary";

interface Props {
  path: CareerPath;
  index: number;
}

export function CareerPathCard({ path, index }: Props) {
  return (
    <div className="career-path-card">
      <div className="career-path-header">
        <span className="career-path-rank">#{index + 1}</span>
        <div className="career-path-title-row">
          <h4 className="career-path-title">{path.title}</h4>
          <span className="career-path-fit">{path.fitScore}% fit</span>
        </div>
      </div>
      <p className="career-path-description">{path.description}</p>
      <div className="career-path-why">
        <strong>Why it matches:</strong> {path.whyItMatches}
      </div>
      <div className="career-path-strengths">
        {path.strengthsUsed.map((s) => (
          <span key={s} className="career-tag">{s}</span>
        ))}
      </div>
      <div className="career-path-growth">
        <strong>Growth tip:</strong> {path.growthTip}
      </div>
    </div>
  );
}