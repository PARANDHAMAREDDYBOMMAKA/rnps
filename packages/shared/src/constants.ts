export const Difficulty = {
  Easy: "easy",
  Medium: "medium",
  Hard: "hard",
} as const;

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export const ProblemType = {
  Mcq: "mcq",
  Coding: "coding",
} as const;

export type ProblemType = (typeof ProblemType)[keyof typeof ProblemType];

export const DIFFICULTY_POINTS: Record<Difficulty, number> = {
  easy: 10,
  medium: 25,
  hard: 50,
};

export const LESSON_POINTS = 5;
