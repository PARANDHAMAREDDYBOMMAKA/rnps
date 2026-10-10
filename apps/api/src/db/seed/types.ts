export interface SeedProblem {
  title: string;
  prompt: string;
  type: "mcq" | "coding";
  difficulty: "easy" | "medium" | "hard";
  options?: string[];
  answer: string;
  explanation: string;
}

export interface SeedLesson {
  title: string;
  videoId?: string;
  durationMin: number;
  content: string;
  problems: SeedProblem[];
}

export interface SeedModule {
  title: string;
  description: string;
  lessons: SeedLesson[];
}

export interface SeedTrack {
  slug: string;
  title: string;
  description: string;
  icon: string;
  modules: SeedModule[];
}
