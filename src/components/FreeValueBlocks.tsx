import { useEffect, useRef } from "react";
import { type StrengthScore } from "../hooks/useAssessment";
import { type PersonalityResult, type EnneagramResult, type DISCResult } from "../data/derivations";
import {
  getCareerSuggestions,
  getFamousPeople,
  getStressInfo,
  getLeadershipStyle,
} from "./ActionBranches";
import { CommunitiesBlock } from "./CommunitiesBlock";
import { LogoIcon } from "./LogoIcon";
import { BonusBlock } from "./BonusBlock";
import { trackBlockViewed, trackBookClick } from "../utils/analytics";
import { getBookRecommendations, getAffiliateUrl } from "../data/books";
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

export function FreeValueBlocks({ results, personality, enneagram, disc, intakeAnswers }: Props) {
  const top5 = results.slice(0, 5);
  const books = getBookRecommendations(personality.type, top5.map((r) => r.strength.id), enneagram.primary.type);
  const careers = getCareerSuggestions(personality.type, top5);
  const famous = getFamousPeople(personality.type);
  const stress = getStressInfo(enneagram.primary.type);
  const leadership = getLeadershipStyle(disc.primary.code, personality.type);

  const segment = getBlockSegment(intakeAnswers);
  const blockOrder = BLOCK_ORDER[segment];
  const overrides = BLOCK_OVERRIDES[segment] ?? {};

  function renderBlock(id: BlockId) {
    switch (id) {
      case "books": {
        const o = overrides.books;
        return (
          <section key="books" className="branch-card">
            <BlockTracker name="books" />
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
                      onClick={() => trackBookClick(book.id, "free")}
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
            <BlockTracker name="careers" />
            <div className="branch-icon">💼</div>
            <h3>{o?.title ?? "Career Paths That Fit You"}</h3>
            <p className="branch-desc">
              {o?.subtitle ??
                `Based on your ${personality.type} personality and top strengths (${top5.map((r) => r.strength.name).join(", ")}), these career directions naturally align with how you're wired.`}
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
        );
      }
      case "famous":
        return (
          <section key="famous" className="branch-card">
            <BlockTracker name="famous_people" />
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
        );
      case "stress":
        return (
          <section key="stress" className="branch-card">
            <BlockTracker name="stress" />
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
                  <p>{stress.best}</p>
                </div>
                <div className="stress-item stress-bad">
                  <strong>Under stress</strong>
                  <p>{stress.stress}</p>
                </div>
              </div>
            </div>
          </section>
        );
      case "leadership":
        return (
          <section key="leadership" className="branch-card">
            <BlockTracker name="leadership" />
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
        );
      case "communities": {
        const o = overrides.communities;
        return (
          <CommunitiesBlock
            key="communities"
            personalityType={personality.type}
            isPaid={false}
            titleOverride={o?.subtitle ?? o?.title}
          />
        );
      }
    }
  }

  return (
    <div className="branches">
      {blockOrder.map((id) => renderBlock(id))}
      <BonusBlock segment={segment} />
    </div>
  );
}
