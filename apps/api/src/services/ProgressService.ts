import {
  DIFFICULTY_POINTS,
  LESSON_POINTS,
  type LeaderboardEntryDto,
  type ProgressSummaryDto,
  type SubmissionResultDto,
} from "@rnp/shared";
import { CacheKeys, CacheTtl, type CacheService } from "../cache/CacheService.ts";
import type { ProgressRepository } from "../repositories/ProgressRepository.ts";
import type { UserRepository } from "../repositories/UserRepository.ts";
import type { ContentService } from "./ContentService.ts";

export class ProgressService {
  constructor(
    private readonly progress: ProgressRepository,
    private readonly users: UserRepository,
    private readonly content: ContentService,
    private readonly cache: CacheService,
  ) {}

  async completeLesson(userId: string, lessonId: string): Promise<{ pointsAwarded: number }> {
    await this.content.getLesson(lessonId);
    const first = await this.progress.completeLesson(userId, lessonId);
    if (!first) return { pointsAwarded: 0 };
    await Promise.all([
      this.cache.addScore(CacheKeys.leaderboard, userId, LESSON_POINTS),
      this.cache.invalidate(CacheKeys.progress(userId)),
    ]);
    return { pointsAwarded: LESSON_POINTS };
  }

  async submitAnswer(userId: string, problemId: string, answer: string): Promise<SubmissionResultDto> {
    const problem = await this.content.loadProblem(problemId);
    const correct = ProgressService.normalize(answer) === ProgressService.normalize(problem.answer);
    const alreadySolved = correct ? await this.progress.hasSolved(userId, problemId) : false;
    await this.progress.recordAttempt(userId, problemId, answer, correct);
    const pointsAwarded = correct && !alreadySolved ? DIFFICULTY_POINTS[problem.difficulty] : 0;
    const tasks: Promise<void>[] = [this.cache.invalidate(CacheKeys.progress(userId))];
    if (pointsAwarded) tasks.push(this.cache.addScore(CacheKeys.leaderboard, userId, pointsAwarded));
    await Promise.all(tasks);
    return { correct, explanation: correct ? problem.explanation : "", pointsAwarded };
  }

  summary(userId: string): Promise<ProgressSummaryDto> {
    return this.cache.remember(CacheKeys.progress(userId), CacheTtl.progress, async () => {
      const [completedLessonIds, solved, days, nextLesson, rank, trackProgress] = await Promise.all([
        this.progress.completedLessonIds(userId),
        this.progress.solvedProblems(userId),
        this.progress.activeDays(userId),
        this.progress.nextLesson(userId),
        this.cache.rankOf(CacheKeys.leaderboard, userId),
        this.progress.completedByTrack(userId),
      ]);
      const problemPoints = solved.reduce((n, p) => n + DIFFICULTY_POINTS[p.difficulty], 0);
      return {
        completedLessons: completedLessonIds.length,
        solvedProblems: solved.length,
        totalPoints: problemPoints + completedLessonIds.length * LESSON_POINTS,
        streakDays: ProgressService.streak(days),
        rank,
        recentDays: days.slice(0, 14),
        nextLesson,
        trackProgress,
        completedLessonIds,
        solvedProblemIds: solved.map((p) => p.problemId),
      };
    });
  }

  async leaderboard(count = 20): Promise<LeaderboardEntryDto[]> {
    const top = await this.cache.topScores(CacheKeys.leaderboard, count);
    const names = await this.users.findNamesByIds(top.map((t) => t.member));
    return top.map((t, i) => ({
      rank: i + 1,
      userId: t.member,
      name: names.get(t.member) ?? "Unknown",
      points: t.score,
    }));
  }

  private static normalize(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, " ");
  }

  private static streak(days: string[]): number {
    if (!days.length) return 0;
    const dayMs = 86_400_000;
    const today = Math.floor(Date.now() / dayMs);
    const set = new Set(days.map((d) => Math.floor(Date.parse(d) / dayMs)));
    let cursor = set.has(today) ? today : today - 1;
    let streak = 0;
    while (set.has(cursor)) {
      streak += 1;
      cursor -= 1;
    }
    return streak;
  }
}
