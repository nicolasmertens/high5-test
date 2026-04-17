import { type StrengthScore } from "../hooks/useAssessment";

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
