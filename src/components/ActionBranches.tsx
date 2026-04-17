import { type StrengthScore } from "../hooks/useAssessment";
import { type PersonalityResult, type EnneagramResult, type DISCResult } from "../data/derivations";
import { ShareButtons } from "./ShareButtons";
import { InviteSection } from "./InviteSection";
import { CommunitiesBlock } from "./CommunitiesBlock";
import { LogoIcon } from "./LogoIcon";
import { BonusBlock } from "./BonusBlock";
import { getBookRecommendations, getAffiliateUrl } from "../data/books";
import { trackBookClick } from "../utils/analytics";
import { type IntakeAnswers } from "../careerData/segmentConfig";
import {
  getBlockSegment,
  BLOCK_ORDER,
  BLOCK_OVERRIDES,
  type BlockId,
} from "../careerData/blockSegmentConfig";

interface Props {
  results: StrengthScore[];
  personality: PersonalityResult;
  enneagram: EnneagramResult;
  disc: DISCResult;
  intakeAnswers: IntakeAnswers | null;
}

export function ActionBranches({ results, personality, enneagram, disc, intakeAnswers }: Props) {
  const top5 = results.slice(0, 5);
  const bottom5 = results.slice(15);
  const books = getBookRecommendations(personality.type, top5.map((r) => r.strength.id), enneagram.primary.type);

  const segment = getBlockSegment(intakeAnswers);
  const blockOrder = BLOCK_ORDER[segment];
  const overrides = BLOCK_OVERRIDES[segment] ?? {};

  function renderBlock(id: BlockId) {
    switch (id) {
      case "books": {
        const o = overrides.books;
        return (
          <section key="books" className="branch-card">
            <div className="branch-icon">📚</div>
            <h3>{o?.title ?? "Books For Your Profile"}</h3>
            <p className="branch-desc">
              {o?.subtitle ??
                "Curated reading based on your strengths and personality type — books that will resonate with how you think and what drives you."}
            </p>
            <div className="branch-preview">
              {books.map((book) => (
                <div key={book.id} className="book-row">
                  <div className="book-info">
                    <a
                      href={getAffiliateUrl(book.asin)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="book-title book-link"
                      onClick={() => trackBookClick(book.id, "paid")}
                    >
                      {book.title}
                    </a>
                    <span className="book-author">{book.author}</span>
                  </div>
                  <span className="book-why">{book.why}</span>
                </div>
              ))}
            </div>
          </section>
        );
      }
      case "careers": {
        const o = overrides.careers;
        return (
          <section key="careers" className="branch-card">
            <div className="branch-icon">💼</div>
            <h3>{o?.title ?? "Career Paths That Fit You"}</h3>
            <p className="branch-desc">
              {o?.subtitle ??
                `Based on your ${personality.type} personality and top strengths (${top5.map((r) => r.strength.name).join(", ")}), these career directions naturally align with how you're wired.`}
            </p>
            <div className="branch-preview">
              <div className="career-tags">
                {getCareerSuggestions(personality.type, top5).map((career) => (
                  <span key={career} className="career-tag">
                    {career}
                  </span>
                ))}
              </div>
            </div>
          </section>
        );
      }
      case "famous":
        return (
          <section key="famous" className="branch-card">
            <div className="branch-icon">⭐</div>
            <h3>Famous People Like You</h3>
            <p className="branch-desc">
              Notable {personality.type}s who share your personality pattern.
            </p>
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
      case "stress":
        return (
          <section key="stress" className="branch-card">
            <div className="branch-icon"><LogoIcon size={20} /></div>
            <h3>You Under Stress</h3>
            <p className="branch-desc">
              As an Enneagram {enneagram.wingLabel} ({enneagram.primary.name}),
              stress pushes you toward different behaviors than your usual self.
            </p>
            <div className="branch-preview">
              <div className="stress-grid">
                <div className="stress-item stress-normal">
                  <strong>At your best</strong>
                  <p>{getStressInfo(enneagram.primary.type).best}</p>
                </div>
                <div className="stress-item stress-bad">
                  <strong>Under stress</strong>
                  <p>{getStressInfo(enneagram.primary.type).stress}</p>
                </div>
              </div>
            </div>
          </section>
        );
      case "leadership":
        return (
          <section key="leadership" className="branch-card">
            <div className="branch-icon">👑</div>
            <h3>Your Leadership Style</h3>
            <p className="branch-desc">
              How your {disc.style} DISC profile and {personality.type} personality shape
              the way you lead — and what to watch out for.
            </p>
            <div className="branch-preview">
              <div className="leadership-preview">
                <p>{getLeadershipStyle(disc.primary.code, personality.type)}</p>
              </div>
            </div>
          </section>
        );
      case "communities": {
        const o = overrides.communities;
        return (
          <CommunitiesBlock
            key="communities"
            personalityType={personality.type}
            isPaid={true}
            titleOverride={o?.subtitle ?? o?.title}
          />
        );
      }
    }
  }

  return (
    <div className="branches">
      {/* Communication — always first for paid users */}
      <section className="branch-card">
        <div className="branch-icon">💬</div>
        <h3>How You Communicate</h3>
        <p className="branch-desc">
          As a <strong>{disc.style}</strong> ({disc.primary.name}), you tend to
          be {disc.primary.traits.slice(0, 3).join(", ").toLowerCase()}. Here's
          how to adapt your style for different people.
        </p>
        <div className="branch-preview">
          <div className="comm-row">
            <span className="comm-label" style={{ background: "#e53e3e" }}>
              With D types
            </span>
            <span className="comm-tip">
              Be direct. Lead with results, skip the small talk.
            </span>
          </div>
          <div className="comm-row">
            <span className="comm-label" style={{ background: "#f6ad55" }}>
              With I types
            </span>
            <span className="comm-tip">
              Be enthusiastic. Share stories, brainstorm together.
            </span>
          </div>
          <div className="comm-row">
            <span className="comm-label" style={{ background: "#48bb78" }}>
              With S types
            </span>
            <span className="comm-tip">
              Be patient. Give them time, don't rush decisions.
            </span>
          </div>
          <div className="comm-row">
            <span className="comm-label" style={{ background: "#4299e1" }}>
              With C types
            </span>
            <span className="comm-tip">
              Be precise. Bring data, respect their process.
            </span>
          </div>
        </div>
      </section>

      {/* Blind Spots — always second for paid users */}
      <section className="branch-card">
        <div className="branch-icon">🪞</div>
        <h3>Your Blind Spots</h3>
        <p className="branch-desc">
          Your bottom strengths reveal where you may struggle or need support
          from others.
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

      {/* Segment-ordered promotable blocks */}
      {blockOrder.map((id) => renderBlock(id))}

      {/* Bonus block — one per segment */}
      <BonusBlock segment={segment} />

      {/* Share — always last before Invite */}
      <section className="branch-card branch-card-highlight">
        <div className="branch-icon">🔗</div>
        <h3>Share Your Profile</h3>
        <p className="branch-desc">
          Let others know what makes you tick — share your results on social
          media or download an image.
        </p>
        <div className="branch-preview">
          <ShareButtons
            shareText={`I'm a ${personality.type} (${personality.label}) with a ${disc.style} DISC profile. My top strength is ${results[0]?.strength.name ?? ""}. Discover yours:`}
            shareUrl={`https://1test.me/?utm_source=results_share&utm_medium=referral&utm_campaign=share-profile`}
            framework="profile"
          />
        </div>
      </section>

      {/* Invite — always last */}
      <section className="branch-card branch-card-highlight">
        <InviteSection
          results={results}
          personality={personality}
          enneagram={enneagram}
          disc={disc}
        />
      </section>
    </div>
  );
}

// ============================================================
// Data helpers — lightweight content, no API needed
// ============================================================

export function getCareerSuggestions(
  personalityType: string,
  _top5: StrengthScore[],
): string[] {
  const careers: Record<string, string[]> = {
    ENTP: ["Entrepreneur", "Product Manager", "Strategy Consultant", "Creative Director", "Venture Capital", "Startup Founder", "Innovation Lead"],
    ENTJ: ["CEO / Executive", "Management Consultant", "Investment Banking", "Corporate Strategy", "Operations Director", "Program Manager"],
    INTP: ["Software Architect", "Data Scientist", "Research Analyst", "Systems Designer", "Technical Lead", "Academic Researcher"],
    INTJ: ["Strategic Planner", "Investment Analyst", "Engineering Manager", "Independent Consultant", "Policy Analyst", "Technical Architect"],
    ENFP: ["Brand Strategist", "UX Designer", "Recruiter", "Nonprofit Director", "Content Creator", "Community Manager"],
    ENFJ: ["HR Director", "Executive Coach", "Teacher / Professor", "Nonprofit Leader", "Therapist", "Training Manager"],
    INFP: ["Writer / Author", "Counselor", "UX Researcher", "Social Worker", "Graphic Designer", "Psychologist"],
    INFJ: ["Life Coach", "Organizational Psychologist", "Writer", "Therapist", "Human Rights Advocate", "Curriculum Designer"],
    ESTP: ["Sales Director", "Real Estate Developer", "Paramedic", "Military Officer", "Sports Agent", "Stockbroker"],
    ESFP: ["Event Planner", "PR Specialist", "Fitness Coach", "Performer", "Tour Guide", "Sales Representative"],
    ISTP: ["Mechanical Engineer", "Forensic Analyst", "Pilot", "Surgeon", "Software Developer", "Cybersecurity Analyst"],
    ISFP: ["Interior Designer", "Chef", "Veterinarian", "Massage Therapist", "Photographer", "Fashion Designer"],
    ESTJ: ["Operations Manager", "Military Officer", "Judge", "Financial Manager", "School Principal", "Project Manager"],
    ESFJ: ["Nurse Manager", "Event Coordinator", "Public Relations", "Real Estate Agent", "HR Manager", "Social Worker"],
    ISTJ: ["Accountant", "Supply Chain Manager", "Compliance Officer", "Database Administrator", "Quality Assurance", "Auditor"],
    ISFJ: ["Nurse", "Elementary Teacher", "Librarian", "Customer Success Manager", "Administrative Director", "Dietitian"],
  };
  return careers[personalityType] || careers["ENTP"];
}


export function getFamousPeople(personalityType: string): string[] {
  const famous: Record<string, string[]> = {
    ENTP: ["Steve Jobs", "Mark Twain", "Thomas Edison", "Céline Dion", "Barack Obama", "Sacha Baron Cohen"],
    ENTJ: ["Margaret Thatcher", "Steve Jobs", "Napoleon", "Gordon Ramsay", "Elon Musk"],
    INTP: ["Albert Einstein", "Bill Gates", "Marie Curie", "Larry Page", "Isaac Newton"],
    INTJ: ["Elon Musk", "Nikola Tesla", "Michelle Obama", "Christopher Nolan", "Mark Zuckerberg"],
    ENFP: ["Robin Williams", "Robert Downey Jr.", "Ellen DeGeneres", "Will Smith", "Walt Disney"],
    ENFJ: ["Oprah Winfrey", "Martin Luther King Jr.", "Barack Obama", "Jennifer Lawrence"],
    INFP: ["Shakespeare", "J.R.R. Tolkien", "Princess Diana", "Johnny Depp", "Kurt Cobain"],
    INFJ: ["Nelson Mandela", "Mother Teresa", "Martin Luther King Jr.", "Lady Gaga", "Plato"],
    ESTP: ["Ernest Hemingway", "Madonna", "Jack Nicholson", "Eddie Murphy", "Donald Trump"],
    ESFP: ["Marilyn Monroe", "Adele", "Jamie Oliver", "Miley Cyrus", "Elvis Presley"],
    ISTP: ["Bruce Lee", "Clint Eastwood", "Michael Jordan", "Bear Grylls", "Tom Cruise"],
    ISFP: ["Bob Dylan", "David Bowie", "Lana Del Rey", "Frida Kahlo", "Jimi Hendrix"],
    ESTJ: ["Henry Ford", "Judge Judy", "Sonia Sotomayor", "Frank Sinatra", "Lyndon B. Johnson"],
    ESFJ: ["Taylor Swift", "Hugh Jackman", "Jennifer Garner", "Ed Sheeran", "Larry King"],
    ISTJ: ["George Washington", "Warren Buffett", "Angela Merkel", "Jeff Bezos", "Queen Elizabeth II"],
    ISFJ: ["Beyoncé", "Queen Elizabeth II", "Rosa Parks", "Anne Hathaway", "Kate Middleton"],
  };
  return famous[personalityType] || famous["ENTP"];
}

export function getStressInfo(type: number): { best: string; stress: string } {
  const info: Record<number, { best: string; stress: string }> = {
    1: { best: "Principled, fair, and inspiring others with your integrity.", stress: "Become overly critical, rigid, and resentful. May lash out at imperfection." },
    2: { best: "Genuinely caring, generous, and empowering others.", stress: "Become manipulative, possessive, or martyr-like. 'After all I've done for you.'" },
    3: { best: "Authentic, inspiring, and genuinely excellent at what you do.", stress: "Become image-obsessed, deceptive, or hostile when success is threatened." },
    4: { best: "Creative, emotionally honest, and deeply empathetic.", stress: "Become self-absorbed, envious, and withdrawn. Drama increases." },
    5: { best: "Insightful, innovative, and intellectually generous.", stress: "Become isolated, hoarding resources, and emotionally detached." },
    6: { best: "Loyal, courageous, and a reliable team anchor.", stress: "Become anxious, suspicious, and either overly aggressive or paralyzed." },
    7: { best: "Joyful, productive, and bringing inspiring ideas to life.", stress: "Become scattered, escapist, and impulsive. Start too many things." },
    8: { best: "Protective, empowering, and using strength to serve others.", stress: "Become domineering, aggressive, and unwilling to show vulnerability." },
    9: { best: "Harmonious, accepting, and bringing people together effortlessly.", stress: "Become passive-aggressive, disengaged, and stubbornly resistant to change." },
  };
  return info[type] || info[7];
}

export function getLeadershipStyle(discCode: string, personalityType: string): string {
  const styles: Record<string, string> = {
    D: `You lead from the front — decisive, fast, results-first. Your team knows exactly where you stand. Watch out for steamrolling quieter voices. As an ${personalityType}, you combine this directness with strategic vision.`,
    I: `You lead through energy and inspiration — rallying people around a vision with enthusiasm. Your team loves your optimism. Watch out for over-promising and under-following-through. As an ${personalityType}, your ideas are your superpower.`,
    S: `You lead through trust and consistency — creating a stable environment where people feel safe to do their best work. Watch out for avoiding necessary conflict. As an ${personalityType}, you build loyalty that lasts.`,
    C: `You lead through expertise and high standards — your team respects your thoroughness and fairness. Watch out for analysis paralysis and micromanaging. As an ${personalityType}, your precision sets the bar.`,
  };
  return styles[discCode] || styles["I"];
}
