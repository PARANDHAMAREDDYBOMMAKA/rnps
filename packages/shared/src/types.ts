import type { Difficulty, ProblemType } from "./constants";

export interface UserDto {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: UserDto;
}

export interface TrackDto {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  moduleCount: number;
  lessonCount: number;
}

export interface ModuleDto {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: LessonSummaryDto[];
}

export interface TrackDetailDto extends TrackDto {
  modules: ModuleDto[];
}

export interface LessonSummaryDto {
  id: string;
  title: string;
  durationMin: number;
  order: number;
  problemCount: number;
}

export interface LessonDto extends LessonSummaryDto {
  content: string;
  videoId: string | null;
  moduleId: string;
  problems: ProblemSummaryDto[];
}

export interface ProblemSummaryDto {
  id: string;
  title: string;
  type: ProblemType;
  difficulty: Difficulty;
  order: number;
}

export interface ProblemDto extends ProblemSummaryDto {
  prompt: string;
  options: string[] | null;
  lessonId: string;
}

export interface SubmissionResultDto {
  correct: boolean;
  explanation: string;
  pointsAwarded: number;
}

export interface NextLessonDto {
  lessonId: string;
  lessonTitle: string;
  durationMin: number;
  moduleTitle: string;
  trackId: string;
  trackTitle: string;
  trackIcon: string;
}

export interface ProgressSummaryDto {
  completedLessons: number;
  solvedProblems: number;
  totalPoints: number;
  streakDays: number;
  rank: number | null;
  recentDays: string[];
  nextLesson: NextLessonDto | null;
  trackProgress: Record<string, number>;
  completedLessonIds: string[];
  solvedProblemIds: string[];
}

export interface LeaderboardEntryDto {
  rank: number;
  userId: string;
  name: string;
  points: number;
}

export interface ApiError {
  error: string;
  details?: unknown;
}
