import { type DISCResult } from "../../../data/derivations";

interface Props {
  disc: DISCResult;
}

export function CommunicationBlock({ disc }: Props) {
  return (
    <section className="branch-card">
      <div className="branch-icon">💬</div>
      <h3>How You Communicate</h3>
      <p className="branch-desc">
        As a <strong>{disc.style}</strong> ({disc.primary.name}), you tend to be{" "}
        {disc.primary.traits.slice(0, 3).join(", ").toLowerCase()}. Here's how to adapt your style
        for different people.
      </p>
      <div className="branch-preview">
        <div className="comm-row">
          <span className="comm-label" style={{ background: "#e53e3e" }}>With D types</span>
          <span className="comm-tip">Be direct. Lead with results, skip the small talk.</span>
        </div>
        <div className="comm-row">
          <span className="comm-label" style={{ background: "#f6ad55" }}>With I types</span>
          <span className="comm-tip">Be enthusiastic. Share stories, brainstorm together.</span>
        </div>
        <div className="comm-row">
          <span className="comm-label" style={{ background: "#48bb78" }}>With S types</span>
          <span className="comm-tip">Be patient. Give them time, don't rush decisions.</span>
        </div>
        <div className="comm-row">
          <span className="comm-label" style={{ background: "#4299e1" }}>With C types</span>
          <span className="comm-tip">Be precise. Bring data, respect their process.</span>
        </div>
      </div>
    </section>
  );
}
