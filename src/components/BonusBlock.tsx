import { useEffect, useRef } from "react";
import { trackBonusBlockViewed } from "../utils/analytics";
import type { SegmentKey } from "../careerData/blockSegmentConfig";

interface BonusContent {
  icon: string;
  title: string;
  description: string;
  items: string[];
}

const BONUS_CONTENT: Partial<Record<SegmentKey, BonusContent>> = {
  university: {
    icon: "📝",
    title: "Cover Letter Strength Template",
    description:
      "Use your top strengths as the backbone of your cover letter — a structure that turns your personality profile into compelling job application language.",
    items: [
      "Opening hook based on your #1 strength",
      "Mid-section: how your top 3 strengths apply to the role",
      "Closing: what makes you distinctly valuable",
      "What to emphasize for your personality type",
    ],
  },
  early_career: {
    icon: "📊",
    title: "Skill Gap Radar",
    description:
      "Based on your profile, here are the skills where early-career professionals with your type tend to lag — and what to prioritize to close the gap faster.",
    items: [
      "Technical vs. soft skill balance for your personality type",
      "3 skills to build in the next 6 months",
      "Where your natural strengths create shortcuts",
      "How to position growth areas in interviews",
    ],
  },
  plateaued: {
    icon: "⚖️",
    title: "Management vs Specialist Calculator",
    description:
      "At your stage, the fork in the road is real: move into management, or double down as a specialist. Here's what your profile suggests.",
    items: [
      "Which path your DISC profile favors",
      "Signals that suggest management potential",
      "Signals that suggest deep specialist strength",
      "Questions to ask yourself before deciding",
    ],
  },
  career_changer: {
    icon: "🧭",
    title: "Values Alignment Check",
    description:
      "Career pivots that last are built on values, not just skills. Here's a framework to check whether your target direction is truly aligned with who you are.",
    items: [
      "Your top 3 values based on your profile",
      "Questions to stress-test a new career direction",
      "Red flags that signal misalignment",
      "How to explain a pivot authentically",
    ],
  },
  senior: {
    icon: "🌿",
    title: "Legacy and Mentorship Paths",
    description:
      "The next chapter isn't just about what you do — it's about what you leave behind. Your profile points to where you can create lasting impact.",
    items: [
      "Your natural mentorship style based on personality type",
      "Roles that leverage your depth of experience",
      "How to transition from doing to teaching",
      "Communities where your wisdom is most valued",
    ],
  },
  solopreneur: {
    icon: "🚀",
    title: "Your First Hire Should Be...",
    description:
      "As a solopreneur, your first hire is one of the most important decisions you'll make. Your profile makes clear what you should NOT be doing yourself.",
    items: [
      "Your weakest operational areas based on personality type",
      "The profile of a complementary first hire",
      "What to delegate first vs. last",
      "How to onboard someone who thinks differently than you",
    ],
  },
};

interface Props {
  segment: SegmentKey;
}

export function BonusBlock({ segment }: Props) {
  const ref = useRef<HTMLElement>(null);
  const tracked = useRef(false);
  const content = BONUS_CONTENT[segment];

  useEffect(() => {
    if (!content || tracked.current || !ref.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tracked.current) {
          tracked.current = true;
          trackBonusBlockViewed(segment);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [content, segment]);

  if (!content) return null;

  return (
    <section ref={ref} className="branch-card branch-card-bonus">
      <div className="branch-icon">{content.icon}</div>
      <span className="bonus-badge">Free Bonus</span>
      <h3>{content.title}</h3>
      <p className="branch-desc">{content.description}</p>
      <div className="branch-preview">
        <ul className="bonus-list">
          {content.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
