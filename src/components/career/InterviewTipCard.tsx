interface Props {
  tip: string;
  coverLetterTip?: string;
  segment: string;
}

export function InterviewTipCard({ tip, coverLetterTip, segment }: Props) {
  if (segment !== "university" && segment !== "early_career") return null;

  return (
    <section className="branch-card interview-tip-card">
      <div className="branch-icon">🎯</div>
      {segment === "university" ? (
        <h3>Interview Tip for Your Profile</h3>
      ) : (
        <h3>Job Search Tip for Your Profile</h3>
      )}
      <p className="branch-desc">{tip}</p>
      {coverLetterTip && (
        <div className="interview-tip-extra">
          <strong>Cover letter tip:</strong> {coverLetterTip}
        </div>
      )}
    </section>
  );
}