export interface Question {
  id: number;
  text: string;
  keyed: "plus" | "minus"; // plus = agree = high score, minus = reversed
  strengthId: string;
}

export interface Strength {
  id: string;
  name: string;
  domain: "doing" | "thinking" | "feeling" | "motivating";
  description: string;
  energized: string;
  drained: string;
}

export const strengths: Strength[] = [
  // DOING
  {
    id: "believer",
    name: "Believer",
    domain: "doing",
    description:
      "Actions of Believers are driven by core higher values that cannot be compromised at the expense of success.",
    energized: "Living and working in alignment with your core values",
    drained:
      "When beliefs and values are questioned or misaligned with what you have to do",
  },
  {
    id: "deliverer",
    name: "Deliverer",
    domain: "doing",
    description:
      "Deliverers follow through on their commitments and enjoy seeing how it builds trust and respect among others.",
    energized: "Keeping promises and seeing others rely on you",
    drained: "When promises get broken — on the receiving or giving side",
  },
  {
    id: "focus_expert",
    name: "Focus Expert",
    domain: "doing",
    description:
      "Focus Experts enjoy getting one project to the finish line rather than changing course regularly.",
    energized: "Deep uninterrupted work on a single project",
    drained: "Constant context-switching and distractions",
  },
  {
    id: "problem_solver",
    name: "Problem Solver",
    domain: "doing",
    description:
      "Problem Solvers love finding bugs, uncovering flaws, diagnosing problems and finding solutions to them.",
    energized: "Diagnosing what went wrong and fixing it",
    drained:
      "When problems are swept under the rug and unsolved issues are ignored",
  },
  {
    id: "time_keeper",
    name: "Time Keeper",
    domain: "doing",
    description:
      "Nothing excites a Time Keeper more than meeting the deadline. They enjoy setting up processes, timelines, and plans.",
    energized: "Clear deadlines, structured timelines, and organized processes",
    drained: "Chaos where neither outcomes nor ways to achieve them are clear",
  },

  // THINKING
  {
    id: "analyst",
    name: "Analyst",
    domain: "thinking",
    description:
      "Analysts are energized by getting to look for simplicity and clarity through a large amount of data.",
    energized: "Sifting through data and finding logical clarity",
    drained:
      "When asked to follow your heart rather than logic and proven facts",
  },
  {
    id: "brainstormer",
    name: "Brainstormer",
    domain: "thinking",
    description:
      "Brainstormers are excited when asked to come up with new no-limits ideas and to connect seemingly unconnectable things.",
    energized: "Generating novel ideas and making unexpected connections",
    drained: "Standard practices and closed-minded people",
  },
  {
    id: "philomath",
    name: "Philomath",
    domain: "thinking",
    description:
      "Philomaths are in love with learning — exploring many interests, following new paths, learning as many things as possible.",
    energized: "Discovering something new and diving deep into a topic",
    drained: "Know-it-all attitudes and lack of curiosity around you",
  },
  {
    id: "strategist",
    name: "Strategist",
    domain: "thinking",
    description:
      "Strategists have the skill to see the big picture, which enables them to find the best route through the clutter.",
    energized: "Spotting patterns and mapping out the best path forward",
    drained: "People who make slow decisions or can't see the forest for the trees",
  },
  {
    id: "thinker",
    name: "Thinker",
    domain: "thinking",
    description:
      "Thinkers enjoy mental activity, intellectual discussions and spending time alone thinking.",
    energized: "Deep intellectual discussions and solo reflection time",
    drained: "Environments where acting before thinking is the norm",
  },

  // FEELING
  {
    id: "chameleon",
    name: "Chameleon",
    domain: "feeling",
    description:
      "Chameleons draw excitement from constantly changing environments, surprises, unexpected detours and working 'on the fly'.",
    energized: "New situations, adapting on the fly, variety",
    drained: "Predictability and rigid routine",
  },
  {
    id: "coach",
    name: "Coach",
    domain: "feeling",
    description:
      "Coaches enjoy discovering the potential in other people and supporting their personal growth.",
    energized: "Helping someone grow and unlock their potential",
    drained: "When potential is wasted or people refuse to develop",
  },
  {
    id: "empathizer",
    name: "Empathizer",
    domain: "feeling",
    description:
      "Empathizers are great at noticing how others feel and using this understanding to do something good.",
    energized: "Connecting emotionally and understanding others deeply",
    drained:
      "When asked to disregard feelings and follow strict logic instead",
  },
  {
    id: "optimist",
    name: "Optimist",
    domain: "feeling",
    description:
      "Optimists enjoy giving praise on what's right about people and being grateful for what they have.",
    energized:
      "Celebrating what's going well and expressing genuine gratitude",
    drained: "People who constantly pick out what's wrong in everything",
  },
  {
    id: "peacekeeper",
    name: "Peacekeeper",
    domain: "feeling",
    description:
      "Peacekeepers are masters of balance, finding alignment and building bridges among people to get to the best outcome.",
    energized: "Creating harmony and finding common ground between people",
    drained:
      "Constant friction among people who do not look for common ground",
  },

  // MOTIVATING
  {
    id: "catalyst",
    name: "Catalyst",
    domain: "motivating",
    description:
      "Catalysts enjoy getting things started and creating momentum in a stagnant environment.",
    energized: "Launching new initiatives and breaking through inertia",
    drained: "Waiting around when you could be getting things off the ground",
  },
  {
    id: "commander",
    name: "Commander",
    domain: "motivating",
    description:
      "Commanders love to be in charge, to speak up, and to be asked for a direct opinion. They do not avoid conflicts.",
    energized: "Taking charge, giving direction, and making tough calls",
    drained: "Beating around the bush and indecisive leadership",
  },
  {
    id: "self_believer",
    name: "Self-Believer",
    domain: "motivating",
    description:
      "Self-Believers are independent and self-sufficient people, inspiring others with their certainty and confidence.",
    energized: "Charting your own course and trusting your own judgment",
    drained: "When others try to tell you what to do or control your actions",
  },
  {
    id: "storyteller",
    name: "Storyteller",
    domain: "motivating",
    description:
      "Storytellers are masters of communication. They like to host, speak in public and to be listened to.",
    energized: "Captivating an audience and expressing ideas through words",
    drained:
      "Situations that do not allow expressing yourself through words",
  },
  {
    id: "winner",
    name: "Winner",
    domain: "motivating",
    description:
      "Winners can turn any mundane task into a game or challenge because the feeling of competition is essential for them.",
    energized: "Competing, measuring performance, and achieving measurable wins",
    drained: "Environments with no defined measure of success",
  },
];

// 120 questions: 6 per strength, based on IPIP public domain items
// Adapted from the International Personality Item Pool (ipip.ori.org) — public domain
export const questions: Question[] = [
  // BELIEVER (Integrity/Honesty + Values)
  { id: 1, text: "I am true to my own values.", keyed: "plus", strengthId: "believer" },
  { id: 2, text: "I believe that honesty is the basis for trust.", keyed: "plus", strengthId: "believer" },
  { id: 3, text: "I keep my promises even when it's inconvenient.", keyed: "plus", strengthId: "believer" },
  { id: 4, text: "I cannot imagine compromising my core principles for success.", keyed: "plus", strengthId: "believer" },
  { id: 5, text: "I feel uneasy when I have to act against my beliefs.", keyed: "plus", strengthId: "believer" },
  { id: 6, text: "I would rather fail than succeed by doing something I consider wrong.", keyed: "plus", strengthId: "believer" },

  // DELIVERER (Industry/Perseverance)
  { id: 7, text: "I don't quit a task before it is finished.", keyed: "plus", strengthId: "deliverer" },
  { id: 8, text: "I keep my promises.", keyed: "plus", strengthId: "deliverer" },
  { id: 9, text: "I finish things despite obstacles in the way.", keyed: "plus", strengthId: "deliverer" },
  { id: 10, text: "I feel horrible when I fail to deliver on a commitment.", keyed: "plus", strengthId: "deliverer" },
  { id: 11, text: "People know they can count on me to follow through.", keyed: "plus", strengthId: "deliverer" },
  { id: 12, text: "I give up easily when things get tough.", keyed: "minus", strengthId: "deliverer" },

  // FOCUS EXPERT (Self-regulation + Focus)
  { id: 13, text: "I am a highly disciplined person.", keyed: "plus", strengthId: "focus_expert" },
  { id: 14, text: "I don't get sidetracked when I work.", keyed: "plus", strengthId: "focus_expert" },
  { id: 15, text: "I prefer to focus on one project at a time until it's done.", keyed: "plus", strengthId: "focus_expert" },
  { id: 16, text: "I find it easy to maintain concentration for long periods.", keyed: "plus", strengthId: "focus_expert" },
  { id: 17, text: "I get frustrated when I'm pulled away from deep work.", keyed: "plus", strengthId: "focus_expert" },
  { id: 18, text: "I constantly jump between tasks without finishing them.", keyed: "minus", strengthId: "focus_expert" },

  // PROBLEM SOLVER (Judgment + Diagnosis)
  { id: 19, text: "I love finding bugs, flaws, and things that don't work right.", keyed: "plus", strengthId: "problem_solver" },
  { id: 20, text: "I try to identify the reasons for my actions.", keyed: "plus", strengthId: "problem_solver" },
  { id: 21, text: "I am energized when I diagnose what went wrong.", keyed: "plus", strengthId: "problem_solver" },
  { id: 22, text: "I weigh the pros and the cons before deciding on a fix.", keyed: "plus", strengthId: "problem_solver" },
  { id: 23, text: "I find it hard to sweep problems under the rug.", keyed: "plus", strengthId: "problem_solver" },
  { id: 24, text: "I would rather avoid dealing with complicated issues.", keyed: "minus", strengthId: "problem_solver" },

  // TIME KEEPER (Prudence + Planning)
  { id: 25, text: "I make careful choices.", keyed: "plus", strengthId: "time_keeper" },
  { id: 26, text: "I love setting up timelines and processes.", keyed: "plus", strengthId: "time_keeper" },
  { id: 27, text: "Nothing excites me more than meeting a deadline.", keyed: "plus", strengthId: "time_keeper" },
  { id: 28, text: "I follow the rules and established procedures.", keyed: "plus", strengthId: "time_keeper" },
  { id: 29, text: "I believe it is always better to be safe than sorry.", keyed: "plus", strengthId: "time_keeper" },
  { id: 30, text: "I get confused when there is no clear plan or structure.", keyed: "plus", strengthId: "time_keeper" },

  // ANALYST (Judgment/Analysis)
  { id: 31, text: "I make decisions only after I have all of the facts.", keyed: "plus", strengthId: "analyst" },
  { id: 32, text: "I am a firm believer in thinking things through.", keyed: "plus", strengthId: "analyst" },
  { id: 33, text: "I am valued by others for my objectivity.", keyed: "plus", strengthId: "analyst" },
  { id: 34, text: "I look for simplicity and clarity through large amounts of data.", keyed: "plus", strengthId: "analyst" },
  { id: 35, text: "I am valued by my friends for my good judgment.", keyed: "plus", strengthId: "analyst" },
  { id: 36, text: "I don't tend to think things through critically.", keyed: "minus", strengthId: "analyst" },

  // BRAINSTORMER (Originality/Creativity)
  { id: 37, text: "I am able to come up with new and different ideas.", keyed: "plus", strengthId: "brainstormer" },
  { id: 38, text: "I like to think of new ways to do things.", keyed: "plus", strengthId: "brainstormer" },
  { id: 39, text: "I am an original thinker.", keyed: "plus", strengthId: "brainstormer" },
  { id: 40, text: "I have an imagination that stretches beyond that of my friends.", keyed: "plus", strengthId: "brainstormer" },
  { id: 41, text: "I love connecting ideas that seem completely unrelated.", keyed: "plus", strengthId: "brainstormer" },
  { id: 42, text: "I have no special urge to do something original.", keyed: "minus", strengthId: "brainstormer" },

  // PHILOMATH (Love of Learning)
  { id: 43, text: "I am thrilled when I learn something new.", keyed: "plus", strengthId: "philomath" },
  { id: 44, text: "I look forward to the opportunity to learn and grow.", keyed: "plus", strengthId: "philomath" },
  { id: 45, text: "I am a true life-long learner.", keyed: "plus", strengthId: "philomath" },
  { id: 46, text: "I read a large variety of books.", keyed: "plus", strengthId: "philomath" },
  { id: 47, text: "I consult the library or the internet immediately if I want to know something.", keyed: "plus", strengthId: "philomath" },
  { id: 48, text: "I don't like to learn new things.", keyed: "minus", strengthId: "philomath" },

  // STRATEGIST (Perspective/Wisdom)
  { id: 49, text: "I have a broad outlook on what is going on.", keyed: "plus", strengthId: "strategist" },
  { id: 50, text: "I have been described as wise beyond my years.", keyed: "plus", strengthId: "strategist" },
  { id: 51, text: "I quickly see patterns that others miss.", keyed: "plus", strengthId: "strategist" },
  { id: 52, text: "I have a mature view on life.", keyed: "plus", strengthId: "strategist" },
  { id: 53, text: "I naturally find the best route through the clutter.", keyed: "plus", strengthId: "strategist" },
  { id: 54, text: "I am not good at figuring out what really matters.", keyed: "minus", strengthId: "strategist" },

  // THINKER (Curiosity + Introspection)
  { id: 55, text: "I find the world a very interesting place.", keyed: "plus", strengthId: "thinker" },
  { id: 56, text: "I enjoy deep intellectual discussions.", keyed: "plus", strengthId: "thinker" },
  { id: 57, text: "I love spending time alone with my thoughts.", keyed: "plus", strengthId: "thinker" },
  { id: 58, text: "I think that my life is extremely interesting.", keyed: "plus", strengthId: "thinker" },
  { id: 59, text: "I am excited by many different ideas and concepts.", keyed: "plus", strengthId: "thinker" },
  { id: 60, text: "I have few intellectual interests.", keyed: "minus", strengthId: "thinker" },

  // CHAMELEON (Social/Emotional Intelligence)
  { id: 61, text: "I am able to fit into any situation.", keyed: "plus", strengthId: "chameleon" },
  { id: 62, text: "I get along well with people I have just met.", keyed: "plus", strengthId: "chameleon" },
  { id: 63, text: "I draw excitement from constantly changing environments.", keyed: "plus", strengthId: "chameleon" },
  { id: 64, text: "I thrive on surprises and unexpected detours.", keyed: "plus", strengthId: "chameleon" },
  { id: 65, text: "I quickly adapt to new and unfamiliar situations.", keyed: "plus", strengthId: "chameleon" },
  { id: 66, text: "I am bored to tears by predictability and routine.", keyed: "plus", strengthId: "chameleon" },

  // COACH (Kindness/Generosity + Growth)
  { id: 67, text: "I go out of my way to cheer up people who appear down.", keyed: "plus", strengthId: "coach" },
  { id: 68, text: "I love to make other people happy.", keyed: "plus", strengthId: "coach" },
  { id: 69, text: "I enjoy discovering potential in other people.", keyed: "plus", strengthId: "coach" },
  { id: 70, text: "I get excited when I see someone grow because of my support.", keyed: "plus", strengthId: "coach" },
  { id: 71, text: "I find it hard to accept when someone's potential is getting wasted.", keyed: "plus", strengthId: "coach" },
  { id: 72, text: "I get impatient when others talk to me about their problems.", keyed: "minus", strengthId: "coach" },

  // EMPATHIZER (Capacity for Love + Emotional Sensing)
  { id: 73, text: "I can express love to someone else.", keyed: "plus", strengthId: "empathizer" },
  { id: 74, text: "I am good at sensing what others are feeling.", keyed: "plus", strengthId: "empathizer" },
  { id: 75, text: "I know what to say to make people feel good.", keyed: "plus", strengthId: "empathizer" },
  { id: 76, text: "I naturally pick up on the emotions in a room.", keyed: "plus", strengthId: "empathizer" },
  { id: 77, text: "I feel deeply affected by others' suffering.", keyed: "plus", strengthId: "empathizer" },
  { id: 78, text: "I do not easily share my feelings with others.", keyed: "minus", strengthId: "empathizer" },

  // OPTIMIST (Hope/Optimism + Gratitude)
  { id: 79, text: "I look on the bright side.", keyed: "plus", strengthId: "optimist" },
  { id: 80, text: "I can find the positive in what seems negative to others.", keyed: "plus", strengthId: "optimist" },
  { id: 81, text: "I am an extremely grateful person.", keyed: "plus", strengthId: "optimist" },
  { id: 82, text: "I feel a profound sense of appreciation every day.", keyed: "plus", strengthId: "optimist" },
  { id: 83, text: "I stop to count my blessings.", keyed: "plus", strengthId: "optimist" },
  { id: 84, text: "I expect the worst.", keyed: "minus", strengthId: "optimist" },

  // PEACEKEEPER (Equity/Fairness + Forgiveness)
  { id: 85, text: "I treat all people equally.", keyed: "plus", strengthId: "peacekeeper" },
  { id: 86, text: "I believe that everyone should have a say.", keyed: "plus", strengthId: "peacekeeper" },
  { id: 87, text: "I let bygones be bygones.", keyed: "plus", strengthId: "peacekeeper" },
  { id: 88, text: "I try to respond with understanding when someone treats me badly.", keyed: "plus", strengthId: "peacekeeper" },
  { id: 89, text: "I naturally build bridges between people who disagree.", keyed: "plus", strengthId: "peacekeeper" },
  { id: 90, text: "I hold grudges.", keyed: "minus", strengthId: "peacekeeper" },

  // CATALYST (Zest/Enthusiasm/Vitality)
  { id: 91, text: "I can't wait to get started on a project.", keyed: "plus", strengthId: "catalyst" },
  { id: 92, text: "I prefer to participate fully rather than view life from the sidelines.", keyed: "plus", strengthId: "catalyst" },
  { id: 93, text: "I don't approach things halfheartedly.", keyed: "plus", strengthId: "catalyst" },
  { id: 94, text: "I hate stagnation — I'd rather start something imperfect than wait.", keyed: "plus", strengthId: "catalyst" },
  { id: 95, text: "I create momentum wherever I go.", keyed: "plus", strengthId: "catalyst" },
  { id: 96, text: "I dread getting up in the morning.", keyed: "minus", strengthId: "catalyst" },

  // COMMANDER (Leadership + Directness)
  { id: 97, text: "I am good at helping people work well together.", keyed: "plus", strengthId: "commander" },
  { id: 98, text: "I am told that I am a strong but fair leader.", keyed: "plus", strengthId: "commander" },
  { id: 99, text: "I love to be in charge and to speak up.", keyed: "plus", strengthId: "commander" },
  { id: 100, text: "I do not avoid conflicts when they need to be resolved.", keyed: "plus", strengthId: "commander" },
  { id: 101, text: "People look to me for direction in confusing situations.", keyed: "plus", strengthId: "commander" },
  { id: 102, text: "I am not good at taking charge of a group.", keyed: "minus", strengthId: "commander" },

  // SELF-BELIEVER (Valor/Bravery + Independence)
  { id: 103, text: "I don't hesitate to express an unpopular opinion.", keyed: "plus", strengthId: "self_believer" },
  { id: 104, text: "I can face my fears.", keyed: "plus", strengthId: "self_believer" },
  { id: 105, text: "I am a brave person.", keyed: "plus", strengthId: "self_believer" },
  { id: 106, text: "I trust my own judgment even when others disagree.", keyed: "plus", strengthId: "self_believer" },
  { id: 107, text: "I cannot stand when others try to control my actions.", keyed: "plus", strengthId: "self_believer" },
  { id: 108, text: "I do not stand up for my beliefs.", keyed: "minus", strengthId: "self_believer" },

  // STORYTELLER (Humor/Communication + Expression)
  { id: 109, text: "I use laughter to brighten the days of others.", keyed: "plus", strengthId: "storyteller" },
  { id: 110, text: "I try to add some humor to whatever I do.", keyed: "plus", strengthId: "storyteller" },
  { id: 111, text: "I love speaking in front of people and holding their attention.", keyed: "plus", strengthId: "storyteller" },
  { id: 112, text: "I am a master at expressing ideas through words.", keyed: "plus", strengthId: "storyteller" },
  { id: 113, text: "I light up when I get to present or host an event.", keyed: "plus", strengthId: "storyteller" },
  { id: 114, text: "I drain in situations that do not allow me to express myself.", keyed: "plus", strengthId: "storyteller" },

  // WINNER (Competition + Achievement)
  { id: 115, text: "I am a goal-oriented person.", keyed: "plus", strengthId: "winner" },
  { id: 116, text: "I turn mundane tasks into games or challenges.", keyed: "plus", strengthId: "winner" },
  { id: 117, text: "I measure my performance against others.", keyed: "plus", strengthId: "winner" },
  { id: 118, text: "I am driven by a desire to be the best at what I do.", keyed: "plus", strengthId: "winner" },
  { id: 119, text: "I feel lost when there is no defined measure of success.", keyed: "plus", strengthId: "winner" },
  { id: 120, text: "I am not naturally competitive.", keyed: "minus", strengthId: "winner" },
];

// Shuffle using Fisher-Yates but keep questions grouped in blocks of ~20
// so that each block has roughly one question per strength
export function shuffleQuestions(qs: Question[]): Question[] {
  // Group by strength
  const byStrength: Record<string, Question[]> = {};
  for (const q of qs) {
    if (!byStrength[q.strengthId]) byStrength[q.strengthId] = [];
    byStrength[q.strengthId].push(q);
  }

  // Build 6 rounds, each with 1 question per strength (shuffled within round)
  const rounds: Question[][] = [];
  for (let i = 0; i < 6; i++) {
    const round = Object.values(byStrength).map((group) => group[i]);
    // Shuffle round
    for (let j = round.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [round[j], round[k]] = [round[k], round[j]];
    }
    rounds.push(round);
  }

  return rounds.flat();
}

export const domainColors: Record<string, string> = {
  doing: "#f59e0b",
  thinking: "#6366f1",
  feeling: "#ec4899",
  motivating: "#10b981",
};

export const domainLabels: Record<string, string> = {
  doing: "DOING",
  thinking: "THINKING",
  feeling: "FEELING",
  motivating: "MOTIVATING",
};
