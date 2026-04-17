import { useEffect, useRef } from "react";
import { type StrengthScore } from "../hooks/useAssessment";
import { type PersonalityResult, type EnneagramResult, type DISCResult } from "../data/derivations";
import {
  getCareerSuggestions,
  getBookSuggestions,
  getFamousPeople,
  getStressInfo,
  getLeadershipStyle,
} from "./ActionBranches";
import { trackBlockViewed, trackUpsellClick } from "../utils/analytics";

interface Props {
  results: StrengthScore[];
  personality: PersonalityResult;
  enneagram: EnneagramResult;
  disc: DISCResult;
}

const AFFILIATE_TAG = "1testme-20";

function amazonUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

interface BookWithLink {
  title: string;
  author: string;
  why: string;
  asin: string;
}

function getBooksWithLinks(
  personalityType: string,
  enneagramType: number,
): BookWithLink[] {
  const base = getBookSuggestions(personalityType, enneagramType);
  const asinMap: Record<string, string> = {
    "The Success Principles": "0060594896",
    "Ego Is the Enemy": "1591847832",
    "Essentialism": "0804137382",
    "Dare to Lead": "0399592520",
    "The Gifts of Imperfection": "159285849X",
    "Thinking, Fast and Slow": "0374533555",
    "Zero to One": "0804139296",
    "Man's Search for Meaning": "0807014293",
    "Atomic Habits": "0735211299",
    "The 4-Hour Workweek": "0307465357",
    "Now, Discover Your Strengths": "0743201140",
  };
  return base.map((b) => ({
    ...b,
    asin: asinMap[b.title] || "0000000000",
  }));
}

interface CommunityLink {
  name: string;
  url: string;
  platform: "reddit" | "facebook" | "discord";
}

function getCommunities(personalityType: string): CommunityLink[] {
  const groupMap: Record<string, string> = {
    ENTP: "mbti_entp", ENTJ: "mbti_entj", INTP: "mbti_intp", INTJ: "mbti_intj",
    ENFP: "mbti_enfp", ENFJ: "mbti_enfj", INFP: "mbti_infp", INFJ: "mbti_infj",
    ESTP: "mbti_estp", ESFP: "mbti_esfp", ISTP: "mbti_istp", ISFP: "mbti_isfp",
    ESTJ: "mbti_estj", ESFJ: "mbti_esfj", ISTJ: "mbti_istj", ISFJ: "mbti_isfj",
  };
  const group = groupMap[personalityType] || "mbti";
  const typeLower = personalityType.toLowerCase();

  return [
    {
      name: `r/${typeLower}`,
      url: `https://www.reddit.com/r/${group}/`,
      platform: "reddit",
    },
    {
      name: `${personalityType} Community`,
      url: `https://www.facebook.com/groups/${group}/`,
      platform: "facebook",
    },
    {
      name: "Personality Discord",
      url: "https://discord.gg/mbti",
      platform: "discord",
    },
  ];
}

function BlockTracker({ name }: { name: string }) {
  const tracked = useRef(false);
  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true;
      trackBlockViewed(name, false);
    }
  }, [name]);
  return null;
}

export function FreeValueBlocks({ results, personality, enneagram, disc }: Props) {
  const top5 = results.slice(0, 5);
  const books = getBooksWithLinks(personality.type, enneagram.primary.type);
  const careers = getCareerSuggestions(personality.type, top5);
  const famous = getFamousPeople(personality.type);
  const stress = getStressInfo(enneagram.primary.type);
  const leadership = getLeadershipStyle(disc.primary.code, personality.type);
  const communities = getCommunities(personality.type);

  const handlePlaybookClick = () => {
    trackUpsellClick({ tier: "ai_playbook", sourceSection: "free_blocks_playbook" });
    fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier: "ai_playbook" }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Checkout failed");
        return res.json();
      })
      .then((data) => {
        window.location.href = data.url;
      })
      .catch(() => {});
  };

  return (
    <div className="branches">
      <BlockTracker name="books" />
      <section className="branch-card">
        <div className="branch-icon">📚</div>
        <h3>Books For Your Profile</h3>
        <p className="branch-desc">
          Curated reading based on your strengths and personality type —
          books that will resonate with how you think and what drives you.
        </p>
        <div className="branch-preview">
          {books.map((book) => (
            <div key={book.title} className="book-row">
              <div className="book-info">
                <a
                  href={amazonUrl(book.asin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="book-title book-link"
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

      <BlockTracker name="careers" />
      <section className="branch-card">
        <div className="branch-icon">💼</div>
        <h3>Career Paths That Fit You</h3>
        <p className="branch-desc">
          Based on your {personality.type} personality and top strengths (
          {top5.map((r) => r.strength.name).join(", ")}), these career
          directions naturally align with how you're wired.
        </p>
        <div className="branch-preview">
          <div className="career-tags">
            {careers.map((career) => (
              <span key={career} className="career-tag">
                {career}
              </span>
            ))}
          </div>
        </div>
      </section>

      <BlockTracker name="famous_people" />
      <section className="branch-card">
        <div className="branch-icon">⭐</div>
        <h3>Famous People Like You</h3>
        <p className="branch-desc">
          Notable {personality.type}s who share your personality pattern.
        </p>
        <div className="branch-preview">
          <div className="famous-tags">
            {famous.map((person) => (
              <span key={person} className="famous-tag">
                {person}
              </span>
            ))}
          </div>
        </div>
      </section>

      <BlockTracker name="stress" />
      <section className="branch-card">
        <div className="branch-icon">⚡</div>
        <h3>You Under Stress</h3>
        <p className="branch-desc">
          As an Enneagram {enneagram.wingLabel} ({enneagram.primary.name}),
          stress pushes you toward different behaviors than your usual self.
        </p>
        <div className="branch-preview">
          <div className="stress-grid">
            <div className="stress-item stress-normal">
              <strong>At your best</strong>
              <p>{stress.best}</p>
            </div>
            <div className="stress-item stress-bad">
              <strong>Under stress</strong>
              <p>{stress.stress}</p>
            </div>
          </div>
        </div>
      </section>

      <BlockTracker name="leadership" />
      <section className="branch-card">
        <div className="branch-icon">👑</div>
        <h3>Your Leadership Style</h3>
        <p className="branch-desc">
          How your {disc.style} DISC profile and {personality.type} personality shape
          the way you lead — and what to watch out for.
        </p>
        <div className="branch-preview">
          <div className="leadership-preview">
            <p>{leadership}</p>
          </div>
        </div>
      </section>

      <BlockTracker name="communities" />
      <section className="branch-card">
        <div className="branch-icon">🌐</div>
        <h3>Communities For Your Type</h3>
        <p className="branch-desc">
          Connect with people who think like you — join {personality.type} communities
          across Reddit, Facebook, and Discord.
        </p>
        <div className="branch-preview">
          <div className="community-links">
            {communities.map((c) => (
              <a
                key={c.name}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`community-link community-${c.platform}`}
              >
                <span className="community-platform">{c.platform === "reddit" ? "Reddit" : c.platform === "facebook" ? "Facebook" : "Discord"}</span>
                <span className="community-name">{c.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <BlockTracker name="ai_playbook_teaser" />
      <section className="branch-card branch-card-highlight playbook-teaser">
        <div className="branch-icon">🤖</div>
        <h3>AI Playbook — Your Personalized Action Plan</h3>
        <p className="branch-desc">
          Get a personalized action plan generated from your unique profile.
          Career paths, communication guide, 30/60/90 day growth plan — built
          specifically for a {personality.type} with your strengths.
        </p>
        <div className="branch-preview">
          <ul className="playbook-features">
            <li>Career paths matched to your unique profile</li>
            <li>Communication guide based on your personality type</li>
            <li>30/60/90 day growth plan with actionable steps</li>
            <li>Includes everything in the Full Profile</li>
          </ul>
        </div>
        <button className="btn-start btn-upgrade" onClick={handlePlaybookClick}>
          Get AI Playbook — $19
        </button>
        <p className="upgrade-subtitle">
          One-time purchase. AI-generated in minutes.
        </p>
      </section>
    </div>
  );
}
