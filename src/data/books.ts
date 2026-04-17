export interface Book {
  id: string;
  title: string;
  author: string;
  asin: string;
  why: string; // i18n
  tags: string[];         // 16P types
  strengths: string[];    // strength IDs
  enneagram: number[];    // Enneagram types
  domain?: string;        // doing|thinking|feeling|motivating
}

export function getAffiliateUrl(asin: string): string {
  const tag = (import.meta.env.VITE_AFFILIATE_TAG as string) || "1testme-20";
  return `https://www.amazon.com/dp/${asin}?tag=${tag}`;
}

export const allBooks: Book[] = [
  // --- Analysts (NT) ---
  {
    id: "thinking-fast-slow",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    asin: "0374533555",
    why: "Deepens your understanding of how you really make decisions",
    tags: ["ENTP", "INTJ", "INTP", "ENTJ"],
    strengths: ["analyst", "problem_solver", "thinker", "strategist"],
    enneagram: [5],
    domain: "thinking",
  },
  {
    id: "zero-to-one",
    title: "Zero to One",
    author: "Peter Thiel",
    asin: "0804139296",
    why: "Matches your drive to build something genuinely new",
    tags: ["ENTP", "ENTJ"],
    strengths: ["strategist", "brainstormer", "catalyst"],
    enneagram: [3, 8],
    domain: "thinking",
  },
  {
    id: "the-black-swan",
    title: "The Black Swan",
    author: "Nassim Nicholas Taleb",
    asin: "0812979220",
    why: "Challenges how you think about uncertainty and prediction",
    tags: ["ENTP", "INTP"],
    strengths: ["thinker", "analyst"],
    enneagram: [5, 6],
    domain: "thinking",
  },
  {
    id: "the-lean-startup",
    title: "The Lean Startup",
    author: "Eric Ries",
    asin: "0307887898",
    why: "Gives your ideas a disciplined framework to become reality",
    tags: ["INTJ", "ENTJ", "ENTP"],
    strengths: ["problem_solver", "catalyst", "strategist"],
    enneagram: [3],
    domain: "doing",
  },
  {
    id: "mastery",
    title: "Mastery",
    author: "Robert Greene",
    asin: "014312417X",
    why: "Maps the path from competence to world-class skill",
    tags: ["INTJ", "ISTP"],
    strengths: ["focus_expert", "philomath", "strategist"],
    enneagram: [1, 5],
    domain: "thinking",
  },
  {
    id: "mind-for-numbers",
    title: "A Mind for Numbers",
    author: "Barbara Oakley",
    asin: "0399168282",
    why: "Channels your intellectual depth into learning anything faster",
    tags: ["INTP"],
    strengths: ["philomath", "analyst"],
    enneagram: [5],
    domain: "thinking",
  },
  {
    id: "godel-escher-bach",
    title: "Gödel, Escher, Bach",
    author: "Douglas Hofstadter",
    asin: "0465026567",
    why: "A deep exploration of consciousness, logic, and creativity",
    tags: ["INTP"],
    strengths: ["thinker", "analyst", "brainstormer"],
    enneagram: [5],
    domain: "thinking",
  },
  {
    id: "hard-thing-about-hard-things",
    title: "The Hard Thing About Hard Things",
    author: "Ben Horowitz",
    asin: "0062273205",
    why: "Honest about the messy reality of building and leading",
    tags: ["ENTJ"],
    strengths: ["commander", "strategist"],
    enneagram: [8, 3],
    domain: "doing",
  },
  {
    id: "principles",
    title: "Principles",
    author: "Ray Dalio",
    asin: "1501176194",
    why: "A systematic framework for decision-making at every scale",
    tags: ["ENTJ", "ESTJ"],
    strengths: ["commander", "strategist", "analyst"],
    enneagram: [1, 8],
    domain: "thinking",
  },
  // --- Diplomats (NF) ---
  {
    id: "power-of-full-engagement",
    title: "The Power of Full Engagement",
    author: "Jim Loehr & Tony Schwartz",
    asin: "0743226465",
    why: "Helps you sustain your energy and passion over the long run",
    tags: ["ENFP", "ESFP"],
    strengths: ["optimist", "catalyst", "coach"],
    enneagram: [7, 2],
    domain: "motivating",
  },
  {
    id: "big-magic",
    title: "Big Magic",
    author: "Elizabeth Gilbert",
    asin: "0143113168",
    why: "Gives your creativity permission to show up and be heard",
    tags: ["ENFP", "INFP", "ESFP", "ISFP"],
    strengths: ["brainstormer", "storyteller", "optimist"],
    enneagram: [4, 7],
    domain: "feeling",
  },
  {
    id: "start-with-why",
    title: "Start With Why",
    author: "Simon Sinek",
    asin: "1591846958",
    why: "Speaks directly to your need to connect work to something larger",
    tags: ["ENFP", "ENFJ", "ESTP"],
    strengths: ["believer", "catalyst", "storyteller"],
    enneagram: [2, 6],
    domain: "motivating",
  },
  {
    id: "mans-search-for-meaning",
    title: "Man's Search for Meaning",
    author: "Viktor Frankl",
    asin: "0807014293",
    why: "Speaks to your deep need for purpose and authentic living",
    tags: ["INFJ", "INFP"],
    strengths: ["believer", "empathizer"],
    enneagram: [4, 1],
    domain: "feeling",
  },
  {
    id: "quiet",
    title: "Quiet",
    author: "Susan Cain",
    asin: "0553380909",
    why: "Validates your inner world and reframes it as a superpower",
    tags: ["INFJ", "ISFJ"],
    strengths: ["thinker", "empathizer"],
    enneagram: [4, 5, 9],
    domain: "feeling",
  },
  {
    id: "road-less-traveled",
    title: "The Road Less Traveled",
    author: "M. Scott Peck",
    asin: "0743243153",
    why: "Rewards your depth of reflection with honest growth insights",
    tags: ["INFJ"],
    strengths: ["believer", "philomath"],
    enneagram: [1, 4],
    domain: "feeling",
  },
  {
    id: "artists-way",
    title: "The Artist's Way",
    author: "Julia Cameron",
    asin: "0143129321",
    why: "Unlocks creative flow and dissolves blocks that hold you back",
    tags: ["INFP", "ISFP"],
    strengths: ["brainstormer", "storyteller"],
    enneagram: [4],
    domain: "feeling",
  },
  {
    id: "dare-to-lead",
    title: "Dare to Lead",
    author: "Brené Brown",
    asin: "0399592520",
    why: "Shows how vulnerability and strength are the same thing",
    tags: ["ENFJ"],
    strengths: ["coach", "commander", "empathizer"],
    enneagram: [2, 8],
    domain: "feeling",
  },
  {
    id: "power-of-habit",
    title: "The Power of Habit",
    author: "Charles Duhigg",
    asin: "081298160X",
    why: "Reveals the invisible systems running your daily behavior",
    tags: ["ENFJ", "ESTJ"],
    strengths: ["deliverer", "time_keeper"],
    enneagram: [1, 3],
    domain: "doing",
  },
  // --- Sentinels (SJ) ---
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    asin: "0735211299",
    why: "Small habits, remarkable results — for any personality",
    tags: ["ESTJ", "ISTJ", "ESFJ", "ISFJ"],
    strengths: ["deliverer", "time_keeper", "focus_expert"],
    enneagram: [1, 3, 6],
    domain: "doing",
  },
  {
    id: "the-one-thing",
    title: "The ONE Thing",
    author: "Gary Keller",
    asin: "1884956600",
    why: "Cuts through complexity to what actually moves the needle",
    tags: ["ESTJ"],
    strengths: ["focus_expert", "deliverer", "time_keeper"],
    enneagram: [1, 3],
    domain: "doing",
  },
  {
    id: "deep-work",
    title: "Deep Work",
    author: "Cal Newport",
    asin: "1455586692",
    why: "Helps you reclaim focused time in a distracted world",
    tags: ["ISTJ", "ISTP"],
    strengths: ["focus_expert", "analyst", "philomath"],
    enneagram: [1, 5],
    domain: "thinking",
  },
  {
    id: "checklist-manifesto",
    title: "The Checklist Manifesto",
    author: "Atul Gawande",
    asin: "0312430000",
    why: "The definitive case for systems, process, and reliability",
    tags: ["ISTJ"],
    strengths: ["time_keeper", "deliverer", "problem_solver"],
    enneagram: [1, 6],
    domain: "doing",
  },
  {
    id: "how-to-win-friends",
    title: "How to Win Friends and Influence People",
    author: "Dale Carnegie",
    asin: "067142517X",
    why: "Timeless principles for connection and influence",
    tags: ["ESFJ"],
    strengths: ["coach", "empathizer", "storyteller"],
    enneagram: [2, 3],
    domain: "feeling",
  },
  {
    id: "five-love-languages",
    title: "The 5 Love Languages",
    author: "Gary Chapman",
    asin: "080241270X",
    why: "Deepens your understanding of how people give and receive care",
    tags: ["ESFJ", "ISFJ"],
    strengths: ["empathizer", "coach"],
    enneagram: [2, 9],
    domain: "feeling",
  },
  {
    id: "strengthsfinder",
    title: "StrengthsFinder 2.0",
    author: "Tom Rath",
    asin: "159562015X",
    why: "The foundational framework for your natural strengths",
    tags: ["ESFJ", "ISFJ"],
    strengths: ["believer", "coach", "empathizer"],
    enneagram: [2, 9],
    domain: "motivating",
  },
  // --- Explorers (SP) ---
  {
    id: "four-hour-workweek",
    title: "The 4-Hour Workweek",
    author: "Tim Ferriss",
    asin: "0307465357",
    why: "Matches your action-oriented, freedom-seeking style",
    tags: ["ESTP", "ISTP"],
    strengths: ["winner", "catalyst", "problem_solver"],
    enneagram: [7, 8],
    domain: "doing",
  },
  {
    id: "never-split-the-difference",
    title: "Never Split the Difference",
    author: "Chris Voss",
    asin: "1847941497",
    why: "Practical negotiation tactics that match your direct style",
    tags: ["ESTP"],
    strengths: ["winner", "commander"],
    enneagram: [8, 3],
    domain: "doing",
  },
  {
    id: "happiness-project",
    title: "The Happiness Project",
    author: "Gretchen Rubin",
    asin: "006158326X",
    why: "A fun, practical experiment in everyday well-being",
    tags: ["ESFP"],
    strengths: ["optimist", "empathizer"],
    enneagram: [7, 2],
    domain: "feeling",
  },
  {
    id: "gifts-of-imperfection",
    title: "The Gifts of Imperfection",
    author: "Brené Brown",
    asin: "159285849X",
    why: "Releases the grip of self-criticism and perfectionism",
    tags: ["ISFP"],
    strengths: ["self_believer", "empathizer"],
    enneagram: [1, 4],
    domain: "feeling",
  },
  // --- Enneagram-specific ---
  {
    id: "boundaries",
    title: "Boundaries",
    author: "Henry Cloud & John Townsend",
    asin: "0310247254",
    why: "Protects your energy while preserving your care for others",
    tags: [],
    strengths: ["empathizer", "coach"],
    enneagram: [2],
    domain: "feeling",
  },
  {
    id: "ego-is-the-enemy",
    title: "Ego Is the Enemy",
    author: "Ryan Holiday",
    asin: "1591847832",
    why: "Balances achievement drive with authenticity",
    tags: ["ENTJ", "ESTP"],
    strengths: ["commander", "winner"],
    enneagram: [3],
    domain: "motivating",
  },
  {
    id: "untethered-soul",
    title: "The Untethered Soul",
    author: "Michael Singer",
    asin: "1572245379",
    why: "Moves beyond comparison and self-labeling into self-acceptance",
    tags: [],
    strengths: ["self_believer"],
    enneagram: [4],
    domain: "feeling",
  },
  {
    id: "courage-to-be-disliked",
    title: "The Courage to Be Disliked",
    author: "Ichiro Kishimi & Fumitake Koga",
    asin: "1501197274",
    why: "Replaces anxiety and approval-seeking with self-trust",
    tags: [],
    strengths: ["self_believer"],
    enneagram: [6],
    domain: "motivating",
  },
  {
    id: "essentialism",
    title: "Essentialism",
    author: "Greg McKeown",
    asin: "0804137382",
    why: "Focuses scattered energy into what genuinely matters",
    tags: [],
    strengths: ["focus_expert", "strategist"],
    enneagram: [7, 9],
    domain: "doing",
  },
  {
    id: "daring-greatly",
    title: "Daring Greatly",
    author: "Brené Brown",
    asin: "1592407331",
    why: "Turns vulnerability into your greatest source of strength",
    tags: [],
    strengths: ["self_believer", "coach"],
    enneagram: [6],
    domain: "feeling",
  },
  // --- Strength-specific ---
  {
    id: "emotional-intelligence",
    title: "Emotional Intelligence",
    author: "Daniel Goleman",
    asin: "0553383712",
    why: "Deepens your ability to read and work with others' emotions",
    tags: [],
    strengths: ["empathizer", "coach"],
    enneagram: [2, 4],
    domain: "feeling",
  },
  {
    id: "nonviolent-communication",
    title: "Nonviolent Communication",
    author: "Marshall Rosenberg",
    asin: "1892005782",
    why: "Transforms how you express yourself and hear others",
    tags: [],
    strengths: ["peacekeeper", "empathizer"],
    enneagram: [9, 2],
    domain: "feeling",
  },
  {
    id: "mindset",
    title: "Mindset",
    author: "Carol Dweck",
    asin: "0345472322",
    why: "The foundation for how you approach any challenge or setback",
    tags: [],
    strengths: ["optimist", "self_believer", "philomath"],
    enneagram: [1, 6],
    domain: "motivating",
  },
  {
    id: "crucial-conversations",
    title: "Crucial Conversations",
    author: "Kerry Patterson et al.",
    asin: "0071771320",
    why: "A toolkit for the high-stakes conversations most people avoid",
    tags: [],
    strengths: ["peacekeeper", "coach", "commander"],
    enneagram: [9, 6],
    domain: "doing",
  },
  {
    id: "getting-to-yes",
    title: "Getting to Yes",
    author: "Roger Fisher & William Ury",
    asin: "0143118757",
    why: "The classic negotiation guide for principled outcomes",
    tags: [],
    strengths: ["peacekeeper", "strategist"],
    enneagram: [9, 6],
    domain: "doing",
  },
  {
    id: "art-of-strategy",
    title: "The Art of Strategy",
    author: "Avinash Dixit & Barry Nalebuff",
    asin: "0393347248",
    why: "Game theory applied to real decisions and competitive moves",
    tags: [],
    strengths: ["strategist", "analyst"],
    enneagram: [5],
    domain: "thinking",
  },
  {
    id: "good-to-great",
    title: "Good to Great",
    author: "Jim Collins",
    asin: "0066620996",
    why: "The patterns that separate great companies — and people — from the rest",
    tags: [],
    strengths: ["strategist", "commander"],
    enneagram: [1, 3],
    domain: "doing",
  },
  {
    id: "originals",
    title: "Originals",
    author: "Adam Grant",
    asin: "0143127930",
    why: "How non-conformists move the world — and how you can too",
    tags: ["ENTP", "ENFP"],
    strengths: ["brainstormer", "catalyst"],
    enneagram: [4, 7],
    domain: "thinking",
  },
  {
    id: "range",
    title: "Range",
    author: "David Epstein",
    asin: "0735214485",
    why: "Makes the case for breadth and curiosity in a world obsessed with specialization",
    tags: [],
    strengths: ["philomath", "chameleon"],
    enneagram: [7],
    domain: "thinking",
  },
  {
    id: "superforecasting",
    title: "Superforecasting",
    author: "Philip Tetlock",
    asin: "0520424166",
    why: "How to make better predictions by thinking like the sharpest forecasters",
    tags: [],
    strengths: ["analyst", "thinker", "problem_solver"],
    enneagram: [5, 6],
    domain: "thinking",
  },
  {
    id: "talk-like-ted",
    title: "Talk Like TED",
    author: "Carmine Gallo",
    asin: "0544216242",
    why: "A blueprint for ideas that stick and audiences that remember you",
    tags: [],
    strengths: ["storyteller", "catalyst"],
    enneagram: [3, 2],
    domain: "doing",
  },
  {
    id: "storyworthy",
    title: "Storyworthy",
    author: "Matthew Dicks",
    asin: "1608686245",
    why: "Teaches you to find and tell stories that actually matter",
    tags: [],
    strengths: ["storyteller"],
    enneagram: [4, 2],
    domain: "feeling",
  },
  {
    id: "coaching-habit",
    title: "The Coaching Habit",
    author: "Michael Stanier",
    asin: "0978440749",
    why: "Seven questions that make you a better coach and listener",
    tags: [],
    strengths: ["coach"],
    enneagram: [2, 9],
    domain: "feeling",
  },
  // --- Universal ---
  {
    id: "now-discover-strengths",
    title: "Now, Discover Your Strengths",
    author: "Marcus Buckingham",
    asin: "0743201140",
    why: "Deepens your understanding of strength-based growth",
    tags: [],
    strengths: [],
    enneagram: [],
    domain: "motivating",
  },
  {
    id: "the-success-principles",
    title: "The Success Principles",
    author: "Jack Canfield",
    asin: "0060594896",
    why: "A comprehensive roadmap for anyone serious about achieving goals",
    tags: [],
    strengths: ["winner", "deliverer"],
    enneagram: [3],
    domain: "motivating",
  },
  {
    id: "who-moved-my-cheese",
    title: "Who Moved My Cheese",
    author: "Spencer Johnson",
    asin: "0743262348",
    why: "A simple story about adapting to change before you have to",
    tags: [],
    strengths: ["chameleon"],
    enneagram: [6, 9],
    domain: "doing",
  },
];

export function getBookRecommendations(
  personalityType: string,
  top5StrengthIds: string[],
  enneagramType: number,
): Book[] {
  const seen = new Set<string>();
  const picks: Book[] = [];

  const add = (book: Book) => {
    if (!seen.has(book.id) && picks.length < 5) {
      seen.add(book.id);
      picks.push(book);
    }
  };

  // 1. Primary: exact 16P type match (up to 2)
  const typeMatches = allBooks.filter((b) => b.tags.includes(personalityType));
  typeMatches.slice(0, 2).forEach(add);

  // 2. Strength match: top 2 strengths (up to 2)
  const top2 = top5StrengthIds.slice(0, 2);
  for (const sId of top2) {
    const match = allBooks.find((b) => !seen.has(b.id) && b.strengths.includes(sId));
    if (match) add(match);
  }

  // 3. Enneagram match (up to 1)
  if (picks.length < 5) {
    const ennMatch = allBooks.find(
      (b) => !seen.has(b.id) && b.enneagram.includes(enneagramType),
    );
    if (ennMatch) add(ennMatch);
  }

  // 4. Universal fillers to reach 3 minimum
  if (picks.length < 3) {
    for (const book of allBooks) {
      if (picks.length >= 3) break;
      if (!seen.has(book.id) && book.tags.length === 0 && book.strengths.length === 0 && book.enneagram.length === 0) {
        add(book);
      }
    }
  }

  // Fallback: just add any unseen book
  if (picks.length < 3) {
    for (const book of allBooks) {
      if (picks.length >= 3) break;
      if (!seen.has(book.id)) add(book);
    }
  }

  return picks;
}
