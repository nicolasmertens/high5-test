import { type StrengthScore } from "../../hooks/useAssessment";
import { type PersonalityResult, type EnneagramResult, type DISCResult } from "../../data/derivations";
import { ShareButtons } from "../ShareButtons";
import { InviteSection } from "../InviteSection";
import { CommunitiesBlock } from "../CommunitiesBlock";
import { BonusBlock } from "../BonusBlock";
import { type IntakeAnswers } from "../../careerData/segmentConfig";
import {
  getBlockSegment,
  BLOCK_OVERRIDES,
  getContentBlockIds,
  type ContentBlockId,
  type BlockId,
} from "../../careerData/blockSegmentConfig";
import { BooksBlock } from "./blocks/BooksBlock";
import { CareersBlock } from "./blocks/CareersBlock";
import { FamousPeopleBlock } from "./blocks/FamousPeopleBlock";
import { StressBlock } from "./blocks/StressBlock";
import { LeadershipBlock } from "./blocks/LeadershipBlock";
import { CommunicationBlock } from "./blocks/CommunicationBlock";
import { BlindSpotsBlock } from "./blocks/BlindSpotsBlock";
import { CareerAlignmentBlock } from "./blocks/CareerAlignmentBlock";

interface Props {
  results: StrengthScore[];
  personality: PersonalityResult;
  enneagram: EnneagramResult;
  disc: DISCResult;
  intakeAnswers: IntakeAnswers | null;
  isPaid: boolean;
}

export function ContentBlocks({
  results,
  personality,
  enneagram,
  disc,
  intakeAnswers,
  isPaid,
}: Props) {
  const segment = getBlockSegment(intakeAnswers);
  const blockIds = getContentBlockIds(isPaid, segment);
  const overrides = BLOCK_OVERRIDES[segment] ?? {};

  function renderBlock(id: ContentBlockId) {
    switch (id) {
      case "communication":
        return <CommunicationBlock key="communication" disc={disc} />;
      case "blind_spots":
        return <BlindSpotsBlock key="blind_spots" results={results} />;
      case "career_alignment":
        return <CareerAlignmentBlock key="career_alignment" personality={personality} disc={disc} />;
      case "books":
        return (
          <BooksBlock
            key="books"
            results={results}
            personality={personality}
            enneagram={enneagram}
            isPaid={isPaid}
            override={overrides[id as BlockId]}
          />
        );
      case "careers":
        return (
          <CareersBlock
            key="careers"
            results={results}
            personality={personality}
            isPaid={isPaid}
            override={overrides[id as BlockId]}
          />
        );
      case "famous":
        return <FamousPeopleBlock key="famous" personality={personality} isPaid={isPaid} />;
      case "stress":
        return <StressBlock key="stress" enneagram={enneagram} isPaid={isPaid} />;
      case "leadership":
        return (
          <LeadershipBlock key="leadership" personality={personality} disc={disc} isPaid={isPaid} />
        );
      case "communities": {
        const o = overrides.communities;
        return (
          <CommunitiesBlock
            key="communities"
            personalityType={personality.type}
            isPaid={isPaid}
            titleOverride={o?.subtitle ?? o?.title}
          />
        );
      }
      case "bonus":
        return <BonusBlock key="bonus" segment={segment} />;
    }
  }

  return (
    <div className="branches">
      {blockIds.map((id) => renderBlock(id))}

      {isPaid && (
        <>
          <section className="branch-card branch-card-highlight">
            <div className="branch-icon">🔗</div>
            <h3>Share Your Profile</h3>
            <p className="branch-desc">
              Let others know what makes you tick — share your results on social media or download
              an image.
            </p>
            <div className="branch-preview">
              <ShareButtons
                shareText={`I'm a ${personality.type} (${personality.label}) with a ${disc.style} DISC profile. My top strength is ${results[0]?.strength.name ?? ""}. Discover yours:`}
                shareUrl="https://1test.me/?utm_source=results_share&utm_medium=referral&utm_campaign=share-profile"
                framework="profile"
              />
            </div>
          </section>

          <section className="branch-card branch-card-highlight">
            <InviteSection
              results={results}
              personality={personality}
              enneagram={enneagram}
              disc={disc}
            />
          </section>
        </>
      )}
    </div>
  );
}
