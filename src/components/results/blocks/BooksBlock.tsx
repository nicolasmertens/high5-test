import { useEffect, useRef } from "react";
import { type StrengthScore } from "../../../hooks/useAssessment";
import { type PersonalityResult, type EnneagramResult } from "../../../data/derivations";
import { getBookRecommendations, getAffiliateUrl } from "../../../data/books";
import { trackBookClick, trackBlockViewed } from "../../../utils/analytics";
import { type BlockOverride } from "../../../careerData/blockSegmentConfig";

interface Props {
  results: StrengthScore[];
  personality: PersonalityResult;
  enneagram: EnneagramResult;
  isPaid: boolean;
  override?: BlockOverride;
}

export function BooksBlock({ results, personality, enneagram, isPaid, override }: Props) {
  const top5 = results.slice(0, 5);
  const books = getBookRecommendations(
    personality.type,
    top5.map((r) => r.strength.id),
    enneagram.primary.type,
  );
  const tracked = useRef(false);

  useEffect(() => {
    if (!isPaid && !tracked.current) {
      tracked.current = true;
      trackBlockViewed("books", false);
    }
  }, [isPaid]);

  return (
    <section className="branch-card">
      <div className="branch-icon">📚</div>
      <h3>{override?.title ?? "Books For Your Profile"}</h3>
      <p className="branch-desc">
        {override?.subtitle ??
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
                onClick={() => trackBookClick(book.id, isPaid ? "paid" : "free")}
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
